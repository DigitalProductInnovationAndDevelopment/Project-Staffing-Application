import User from '../models/User.js'
import Contract from '../models/Contract.js'
import ProjectWorkingHours from '../models/ProjectWorkingHours.js'
import { getProjectWorkingHourDistributionByUserId } from '../utils/projectWorkingHoursHelper.js'

export const createNewUserService = async (userData) => {
  try {
    const newUser = new User(userData)
    await newUser.save()
    return newUser
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`)
  }
}

// enriches the returned user object with 3 additional values: "numberOfProjectsLast3Months", "projectWorkingHourDistributionInHours", "projectWorkingHourDistributionInPercentage" <-> based on ProjectWorkingHours
export const getAllUsersService = async () => {
  // get all users
  const all_users = await User.find() //TODO???
    .select('-password') //exclude password from query response
    .populate('skills')
    .populate({
      path: 'contractId',
      select: 'weeklyWorkingHours', // selecting weeklyWorkingHours field from Contract
    })
  // get all projectWorkingHours
  const all_projectWorkingHours = await ProjectWorkingHours.find()

  // iterate through all users and calculate the number of projects within the last 3 months
  for (let i = 0; i < all_users.length; i++) {
    const user = all_users[i].toObject() // convert Mongoose document to a plain JavaScript object
    const userId = user._id
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 3)
    const endDate = new Date()
    const workingHourDistribution = getProjectWorkingHourDistributionByUserId(
      all_projectWorkingHours,
      userId,
      startDate,
      endDate
    )
    // enrich user object with additional value
    user.numberOfProjectsLast3Months = workingHourDistribution.numberOfProjects
    user.projectWorkingHourDistributionInHours =
      workingHourDistribution.distribution
    user.projectWorkingHourDistributionInPercentage =
      workingHourDistribution.percentageDistribution
    all_users[i] = user
  }
  // console.log('all_users')
  // console.log(all_users)
  return all_users
}

// enriches the returned user object with project history based on ProjectWorkingHours for 4 time spans
// (1) last 7 days (current) -> "numberOfProjectsLast7Days" + "projectWorkingHourDistributionInPercentageLast7Days"
// (2) last 3 months <-> "numberOfProjectsLast3Months" + "projectWorkingHourDistributionInPercentageLast3Months"
// (3) last year <-> "numberOfProjectsLastYear" + "projectWorkingHourDistributionInPercentageLastYear"
// (4) last 5 years <-> "numberOfProjectsLast5Years" + "projectWorkingHourDistributionInPercentageLast5Years"
export const getUserByUserIdService = async (userId) => {
  try {
    const user = await User.findById(userId)
      .select('-password')
      .populate('skills')
      .populate({
        path: 'targetSkills',
        select: 'skillCategory skillPoints',
      })
      .populate({
        path: 'contractId',
        select: 'weeklyWorkingHours', // selecting weeklyWorkingHours field from Contract
      })
    if (!user) {
      throw new Error('User not found')
    }
    // console.log(user);

    const all_projectWorkingHours = await ProjectWorkingHours.find()
    const endDate = new Date() // endDate is always today

    // (1) last 7 days (current)
    const startDate7DaysAgo = new Date()
    startDate7DaysAgo.setDate(startDate7DaysAgo.getDate() - 7)
    const pwdLast7Days = getProjectWorkingHourDistributionByUserId(
      all_projectWorkingHours,
      userId,
      startDate7DaysAgo,
      endDate
    )

    // (2) last 3 months
    const startDate3MonthsAgo = new Date()
    startDate3MonthsAgo.setMonth(startDate3MonthsAgo.getMonth() - 3)
    const pwdPast3Months = getProjectWorkingHourDistributionByUserId(
      all_projectWorkingHours,
      userId,
      startDate3MonthsAgo,
      endDate
    )

    // (3) last year
    const startDateYearAgo = new Date()
    startDateYearAgo.setFullYear(startDateYearAgo.getFullYear() - 1)
    const pwdPastYear = getProjectWorkingHourDistributionByUserId(
      all_projectWorkingHours,
      userId,
      startDateYearAgo,
      endDate
    )

    // (4) last 5 years
    const startDate5YearsAgo = new Date()
    startDate5YearsAgo.setFullYear(startDate5YearsAgo.getFullYear() - 5)
    const pwdPast5Years = getProjectWorkingHourDistributionByUserId(
      all_projectWorkingHours,
      userId,
      startDate5YearsAgo,
      endDate
    )

    // enrich userObject with additional values
    const userObject = user.toObject() // convert user document to plain JavaScript object

    userObject.numberOfProjectsLast7Days = pwdLast7Days.numberOfProjects
    userObject.projectWorkingHourDistributionInPercentageLast7Days =
      pwdLast7Days.percentageDistribution
    
    userObject.numberOfProjectsLast3Months = pwdPast3Months.numberOfProjects
    userObject.projectWorkingHourDistributionInPercentageLast3Months =
      pwdPast3Months.percentageDistribution

    userObject.numberOfProjectsLastYear = pwdPastYear.numberOfProjects
    userObject.projectWorkingHourDistributionInPercentageLastYear =
      pwdPastYear.percentageDistribution

    userObject.numberOfProjectsLast5Years = pwdPast5Years.numberOfProjects
    userObject.projectWorkingHourDistributionInPercentageLast5Years =
      pwdPast5Years.percentageDistribution

      // console.log('userObject');
      // console.log(userObject);

    userObject.skills.forEach((skill) => {
      // console.log(userObject.firstName);
      // console.log(skill.skillCategory);
      const targetSkill = userObject.targetSkills.find(targetSkill => targetSkill.skillCategory === skill.skillCategory);
      // console.log("Points:" + targetSkill.skillPoints);
      skill.targetSkillPoints = targetSkill.skillPoints;
      // console.log(skill.skillPoints);
      skill.delta = skill.targetSkillPoints - skill.skillPoints;
    });

    return userObject
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`)
  }
}

//mongoose will only update the specified fields within "updateData" and leave the other fields unchanged
export const updateUserService = async (_id, updateData) => {
  try {
    //find the user by ID and update the document with the new data
    const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
      new: true,
    }) // { new: true } => return updated document
    // update skills objects
    if (!updatedUser) {
      throw new Error('User not found')
    }
    return updatedUser
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`)
  }
}

export const deleteUserService = async (_id) => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id })
    if (!deletedUser) {
      throw new Error('User not found')
    }
    return deletedUser
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`)
  }
}
