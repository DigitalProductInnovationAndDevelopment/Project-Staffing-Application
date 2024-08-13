import {
  addSkillsToUserService,
  createNewSkillsService,
  deleteSkillsService,
  updateSkillsService,
} from './skill.js'
import Assignment from '../models/Assignment.js'
import Contract from '../models/Contract.js'
import Leave from '../models/Leave.js'
import ProjectWorkingHours from '../models/ProjectWorkingHours.js'
import User from '../models/User.js'
import { getProjectWorkingHourDistributionByUserId } from '../utils/projectWorkingHoursHelper.js'
import { updateContractService } from './contract.js'

// Function to create a new user
export const createNewUserService = async (userData) => {
  try {
    // create a new user object
    let newUser = new User({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password, //TODO: hash password (temporary complicated password)
      canWorkRemote: userData.canWorkRemote || false,
      officeLocation: userData.officeLocation || null,
      roles: userData.roles || [],
    })
    await newUser.save()

    // create a new contract object if data provided
    if (userData.contract) {
      const newContract = new Contract(userData.contract)
      await newContract.save()
      try {
        newUser = await updateUserFieldsService(newUser._id, {
          contractId: newContract._id,
        })
      } catch (err) {
        await Contract.findByIdAndDelete(newContract._id)
        throw new Error(`Failed to create contract: ${err.message}`)
      }
    }

    // create new leave objects if data provided
    if (userData.leaves) {
      const leaveIds = []
      for (const leave of userData.leaves) {
        const newLeave = new Leave(leave)
        await newLeave.save()
        leaveIds.push(newLeave._id)
      }
      try {
        newUser = await updateUserFieldsService(newUser._id, {
          leaveIds: leaveIds,
        })
      } catch (err) {
        for (const id of leaveIds) {
          await Leave.findByIdAndDelete(id)
        }
        throw new Error(`Failed to create leave: ${err.message}`)
      }
    }

    // check if targetSkillPoints is greater than skillPoints else throw error
    for (const userSkill of userData.skills) {
      if (
        userSkill.targetSkillPoints &&
        userSkill.targetSkillPoints < userSkill.skillPoints
      ) {
        throw new Error(
          'Invalid target skill points. Target skill points should be greater than or equal to skill points'
        )
      }
    }

    // create new skills objects
    const newSkill = await createNewSkillsService(userData.skills)
    const newSkillIds = newSkill.map((skill) => skill._id)

    // if targetSkillPoints is not provided, use skillPoints as targetSkillPoints
    const targetSkillsInformation = userData.skills.map((skill) => {
      if (!skill.targetSkillPoints) {
        return {
          skillCategory: skill.skillCategory,
          skillPoints: skill.skillPoints,
        }
      } else {
        return {
          skillCategory: skill.skillCategory,
          skillPoints: skill.targetSkillPoints,
        }
      }
    })

    // create new targetSkills objects
    const newTargetSkill = await createNewSkillsService(targetSkillsInformation)
    const newTargetSkillIds = newTargetSkill.map((skill) => skill._id)

    const newUserWithSkills = await addSkillsToUserService(
      newUser._id,
      newSkillIds,
      newTargetSkillIds
    )

    return newUserWithSkills
  } catch (err) {
    throw new Error(`Failed to create user: ${err.message}`)
  }
}

// Function to get all users
// enriches the returned user object with 3 additional values: "numberOfProjectsLast3Months", "projectWorkingHourDistributionInHours", "projectWorkingHourDistributionInPercentage" <-> based on ProjectWorkingHours
export const getAllUsersService = async () => {
  // get all users
  const all_users = await User.find()
    .select('-password')
    // populate skills, contractId, targetSkills fields
    // transform the populated fields skills and targetSkills to the required format (skillPoints, skillCategory, maxSkillPoints)
    .populate({
      path: 'skills',
      populate: {
        path: 'skillCategory',
        select: 'name maxPoints',
        transform: (doc) =>
          doc == null
            ? null
            : { skillCategory: doc.name, maxPoints: doc.maxPoints },
      },
      transform: (doc) =>
        doc == null
          ? null
          : {
              _id: doc._id,
              skillPoints: doc.skillPoints,
              skillCategory: doc.skillCategory?.skillCategory,
              maxSkillPoints: doc.skillCategory?.maxPoints,
            },
    })
    .populate({
      path: 'contractId',
      select: 'weeklyWorkingHours',
    })
    .populate({
      path: 'targetSkills',
      select: 'skillCategory skillPoints',
      populate: {
        path: 'skillCategory',
        select: 'name maxPoints',
        transform: (doc) =>
          doc == null
            ? null
            : { skillCategory: doc.name, maxPoints: doc.maxPoints },
      },
      transform: (doc) =>
        doc == null
          ? null
          : {
              _id: doc._id,
              skillPoints: doc.skillPoints,
              skillCategory: doc.skillCategory?.skillCategory,
              maxSkillPoints: doc.skillCategory?.maxPoints,
            },
    })

  // enrich the user object with additional value delta and targetSkillPoints
  for (let i = 0; i < all_users.length; i++) {
    const user = all_users[i]
    const skills = user.skills
    const targetSkills = user.targetSkills
    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i]
      const targetSkill = targetSkills.find(
        (targetSkill) => targetSkill.skillCategory === skill.skillCategory
      )
      if (targetSkill) {
        skill.targetSkillPoints = targetSkill.skillPoints
        skill.delta = targetSkill.skillPoints - skill.skillPoints
      }
    }
  }

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

  return all_users
}

// Function to get a user by userId
// enriches the returned user object with project history based on ProjectWorkingHours for 4 time spans
// (1) last 7 days (current) -> "numberOfProjectsLast7Days" + "projectWorkingHourDistributionInPercentageLast7Days"
// (2) last 3 months <-> "numberOfProjectsLast3Months" + "projectWorkingHourDistributionInPercentageLast3Months"
// (3) last year <-> "numberOfProjectsLastYear" + "projectWorkingHourDistributionInPercentageLastYear"
// (4) last 5 years <-> "numberOfProjectsLast5Years" + "projectWorkingHourDistributionInPercentageLast5Years"
export const getUserByUserIdService = async (userId) => {
  try {
    const user = await User.findById(userId)
      .select('-password')
      // populate skills, contractId, targetSkills fields
      // transform the populated fields skills and targetSkills to the required format (skillPoints, skillCategory, maxSkillPoints)
      .populate({
        path: 'skills',
        populate: {
          path: 'skillCategory',
          select: 'name maxPoints',
          transform: (doc) =>
            doc == null
              ? null
              : { skillCategory: doc.name, maxPoints: doc.maxPoints },
        },
        transform: (doc) =>
          doc == null
            ? null
            : {
                _id: doc._id,
                skillPoints: doc.skillPoints,
                skillCategory: doc.skillCategory?.skillCategory,
                maxSkillPoints: doc.skillCategory?.maxPoints,
              },
      })
      .populate({
        path: 'contractId',
        select: 'weeklyWorkingHours', // selecting weeklyWorkingHours field from Contract
      })
      .populate({
        path: 'targetSkills',
        select: 'skillCategory skillPoints',
        populate: {
          path: 'skillCategory',
          select: 'name maxPoints',
          transform: (doc) =>
            doc == null
              ? null
              : { skillCategory: doc.name, maxPoints: doc.maxPoints },
        },
        transform: (doc) =>
          doc == null
            ? null
            : {
                _id: doc._id,
                skillPoints: doc.skillPoints,
                skillCategory: doc.skillCategory?.skillCategory,
                maxSkillPoints: doc.skillCategory?.maxPoints,
              },
      })
    if (!user) {
      throw new Error('User not found')
    }

    // enrich the user object with additional value delta and targetSkillPoints
    const skills = user.skills
    const targetSkills = user.targetSkills
    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i]
      const targetSkill = targetSkills.find(
        (targetSkill) => targetSkill.skillCategory === skill.skillCategory
      )
      if (targetSkill) {
        skill.targetSkillPoints = targetSkill.skillPoints
        skill.delta = targetSkill.skillPoints - skill.skillPoints
      }
    }

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

    if (!userObject) {
      throw new Error('User Object not found')
    }

    return userObject
  } catch (err) {
    throw new Error(`Failed to get user: ${err.message}`)
  }
}

//mongoose will only update the specified fields within "updateData" and leave the other fields unchanged
// Function to update a user
export const updateUserService = async (userId, updateData) => {
  try {
    // check if the user exists
    const user = await getUserByUserIdService(userId)

    // update the contract object if contractId is part of the update
    if (updateData.contractId) {
      const contractId = user.contractId
      const updatedContract = await updateContractService(
        contractId,
        updateData.contractId
      )
      await updateUserFieldsService(userId, {
        contractId: updatedContract._id,
      })
    }

    // update the leave objects if leaves is part of the update
    // requires all existing leaves to be passed in the request
    // deletes all existing leaves and creates new leaves
    if (updateData.leaves) {
      const leaveIds = user.leaveIds
      for (const id of leaveIds) {
        await Leave.findByIdAndDelete(id)
      }
      const newLeaveIds = []
      for (const leave of updateData.leaves) {
        const newLeave = new Leave(leave)
        await newLeave.save()
        newLeaveIds.push(newLeave._id)
      }
      await updateUserFieldsService(userId, {
        leaveIds: newLeaveIds,
      })
    }

    // update the skills objects if skills is part of the update
    if (updateData.skills) {
      // check if targetSkillPoints is greater than skillPoints else throw error
      for (const userSkill of updateData.skills) {
        if (userSkill.targetSkillPoints < userSkill.skillPoints) {
          throw new Error(
            'Invalid target skill points. Target skill points should be greater than or equal to skill points'
          )
        }
      }
      await updateSkillsService(updateData.skills, user.skills)
      // update targetSkills objects with the new targetSkillPoints //TODO
      const targetSkillsInformation = updateData.skills.map((skill) => {
        return {
          skillCategory: skill.skillCategory,
          skillPoints: skill.targetSkillPoints,
        }
      })
      await updateSkillsService(targetSkillsInformation, user.targetSkills)
    }

    // eslint-disable-next-line no-unused-vars
    const { skills = [], leave = [], contractId = [], ...rest } = updateData

    //find the user by ID and update the document with the new data
    const updatedUser = await updateUserFieldsService(userId, rest)

    return updatedUser
  } catch (err) {
    throw new Error(`Failed to update user: ${err.message}`)
  }
}

// Function to update user fields
export const updateUserFieldsService = async (userId, updateData) => {
  try {
    const user = await getUserByUserIdService(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    })
    if (!updatedUser) {
      throw new Error('User fields could not be updated')
    }

    return updatedUser
  } catch (err) {
    throw new Error(`Failed to update user fields: ${err.message}`)
  }
}

// Function to delete a user
export const deleteUserService = async (userId) => {
  try {
    // get the user by userId
    const user = await getUserByUserIdService(userId)

    // delete all associated skills
    const skillIds = user.skills.map((skill) => skill._id)
    await deleteSkillsService(skillIds)

    const targetSkillPoints = user.targetSkills.map((skill) => skill._id)
    await deleteSkillsService(targetSkillPoints)

    const contractId = user.contractId
    const contract = await Contract.findByIdAndDelete(contractId)
    if (!contract) {
      throw new Error('Contract not found')
    }

    const leaveIds = user.leaveIds
    for (const id of leaveIds) {
      const leave = await Leave.findByIdAndDelete(id)
      if (!leave) {
        throw new Error('Leave not found')
      }
    }

    //delete the user from all assignments
    const allAssignments = await Assignment.find()
    if (!allAssignments) {
      throw new Error('Assignments not found')
    }
    for (const assignment of allAssignments) {
      const updatedAssignment = await Assignment.findByIdAndUpdate(
        assignment._id,
        { $pull: { userId: userId } },
        { new: true, useFindAndModify: false}
      )
      if (!updatedAssignment) {
        throw new Error('Assignment could not be updated')
      }
    }

    const deletedUser = await User.findOneAndDelete({ _id: userId })
    if (!deletedUser) {
      throw new Error('User could not be deleted')
    }

    return deletedUser
  } catch (err) {
    throw new Error(`Failed to delete user: ${err.message}`)
  }
}
