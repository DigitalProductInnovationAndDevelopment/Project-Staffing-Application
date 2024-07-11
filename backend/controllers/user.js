import {
  getAllUsersService,
  getUserByUserIdService,
  updateUserService,
  deleteUserService,
  createNewUserService,
} from '../services/user.js'
import {
  createNewSkillService,
  createNewSkillsService,
  addSkillsToUserService,
  getSkillBySkillIdService,
  deleteSkillsService,
  updateSkillPointsBySkillIdService,
  updateSkillsService,
} from '../services/skill.js'
import maxSkillPointsArray from '../utils/maxSkillPoints.js'
import { updateContractService } from '../services/contract.js'
import { updateLeaveService } from '../services/leave.js'
import Contract from '../models/Contract.js'
import Leave from '../models/Leave.js'

export const createNewUserController = async (req, res) => {
  const userData = req.body
  try {
    let newUser = await createNewUserService({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      canWorkRemote: userData.canWorkRemote,
      officeLocation: userData.officeLocation,
      roles: userData.roles,
    })
    if (userData.contract) {
      const newContract = new Contract(userData.contract)
      await newContract.save()
      newUser = await updateUserService(newUser._id, {
        contractId: newContract._id,
      })
    }
    if (userData.leaves) {
      const leaveIds = []
      for (const leave of userData.leaves) {
        const newLeave = new Leave(leave)
        await newLeave.save()
        leaveIds.push(newLeave._id)
      }
      newUser = await updateUserService(newUser._id, { leaveIds: leaveIds })
    }
    try {
      const newSkill = await createNewSkillsService(userData.skills)
      const newSkillIds = newSkill.map((skill) => skill._id)
      const newUserWithSkills = await addSkillsToUserService(
        newUser._id,
        newSkillIds
      )
      return res.status(201).json({
        message: 'User created successfully',
        data: newUserWithSkills,
      })
    } catch (error) {
      deleteUserService(newUser._id)
      return res.status(500).json({
        message: error.message + ' skill could not be created',
      })
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const getAllUsersController = async (req, res, next) => {
  try {
    const all_users = await getAllUsersService()
    if (!all_users) {
      next(new AppError('Users not found.', 400))
    }
    res.status(200).json(all_users)
  } catch (err) {
    next(err)
  }
}

export const getUserByIdController = async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await getUserByUserIdService(userId)
    if (!user) {
      next(new AppError('User not found.', 400))
    }
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}

export const updateUserController = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await getUserByUserIdService(userId)
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    let updateData = req.body
     if (updateData.contractId) {
      const contract = user.contractId
      await updateContractService(contract._id, updateData.contractId)
      await updateUserService(userId, {contractId: updateData.contractId})
    }
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
      await updateUserService(userId, { leaveIds: newLeaveIds })
    }
    if (updateData.skills) {
      await updateSkillsService(updateData.skills, user.skills)
    }

    const { skills, ...rest } = updateData

    const updatedUser = await updateUserService(userId, rest)
    return res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }

}

export const deleteUserController = async (req, res) => {
  const { userId } = req.params
  const user = await getUserByUserIdService(userId)
  const skillIds = user.skills.map((skill) => skill._id)
  await deleteSkillsService(skillIds)
  const contractId = user.contractId
  await Contract.findByIdAndDelete(contractId)
  const leaveIds = user.leaveIds
  for (const id of leaveIds) {
    await Leave.findByIdAndDelete(id)
  }
  const _id = user._id
  try {
    const deletedUser = await deleteUserService(_id)
    return res.status(200).json({
      message: 'User deleted successfully',
      data: deletedUser,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
