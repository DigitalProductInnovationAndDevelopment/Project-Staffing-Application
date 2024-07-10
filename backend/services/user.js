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
  const all_users = await User.find().select('-password') //exclude password from query response
  .populate('skills')
  .populate({
    path: 'contractId',
    select: 'weeklyWorkingHours' // selecting weeklyWorkingHours field from Contract
  }); 
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
    user.projectWorkingHourDistributionInHours = workingHourDistribution.distribution
    user.projectWorkingHourDistributionInPercentage = workingHourDistribution.percentageDistribution
    all_users[i] = user
  }
  console.log('all_users')
  console.log(all_users)
  return all_users
}

// enriches the returned user object with 3 additional values: "numberOfProjectsLast3Months", "projectWorkingHourDistributionInHours", "projectWorkingHourDistributionInPercentage" <-> based on ProjectWorkingHours
export const getUserByUserIdService = async (userId) => {
  try {
    const user = await User.findById(userId)
      .select('-password')
      .populate('skills')
      .populate({
        path: 'contractId',
        select: 'weeklyWorkingHours' // selecting weeklyWorkingHours field from Contract
      });
    if (!user) {
      throw new Error('User not found')
    }

    const all_projectWorkingHours = await ProjectWorkingHours.find()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 3)
    const endDate = new Date()
    const workingHourDistribution = getProjectWorkingHourDistributionByUserId(
      all_projectWorkingHours,
      userId,
      startDate,
      endDate
    )

    const userObject = user.toObject() // Convert user document to plain JavaScript object

    // enrich userObject with additional values
    userObject.numberOfProjectsLast3Months =
      workingHourDistribution.numberOfProjects
    userObject.projectWorkingHourDistributionInHours =
      workingHourDistribution.distribution
    userObject.projectWorkingHourDistributionInPercentage =
      workingHourDistribution.percentageDistribution

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
