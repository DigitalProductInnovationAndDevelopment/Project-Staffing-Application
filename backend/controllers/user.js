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
      newUser = await updateUserService(newUser._id, { //TODO
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
      newUser = await updateUserService(newUser._id, { leaveIds: leaveIds })//TODO
    }
    try {
      for (const userSkill of userData.skills) {
        if (userSkill.targetSkillPoints && userSkill.targetSkillPoints < userSkill.skillPoints) {
          return res.status(400).json({
            message: 'Invalid target skill points. Target skill points should be greater than or equal to skill points.',
          });
        }
      }

      const newSkill = await createNewSkillsService(userData.skills)
      const newSkillIds = newSkill.map((skill) => skill._id)

      const targetSkillsInformation = userData.skills.map((skill) => {
        if(!skill.targetSkillPoints){ 
          return {
            skillCategory: skill.skillCategory,
            skillPoints: skill.skillPoints,
          };
        }else{
          return {
            skillCategory: skill.skillCategory,
            skillPoints: skill.targetSkillPoints,
          };
        }
      });

      // console.log(targetSkillsInformation);

      const newTargetSkill = await createNewSkillsService(targetSkillsInformation);
      // console.log(newTargetSkill);
      const newTargetSkillIds = newTargetSkill.map((skill) => skill._id)

      const newUserWithSkills = await addSkillsToUserService(
        newUser._id,
        newSkillIds,
        newTargetSkillIds
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
      await updateContractService(contract._id, updateData.contractId) //TODO
      await updateUserService(userId, { contractId: updateData.contractId }) //TODO
    }
    if (updateData.leaves) {
      const leaveIds = user.leaveIds
      for (const id of leaveIds) {
        await Leave.findByIdAndDelete(id) //TODO
      }
      const newLeaveIds = []
      for (const leave of updateData.leaves) {
        const newLeave = new Leave(leave)
        await newLeave.save()
        newLeaveIds.push(newLeave._id)
      }
      await updateUserService(userId, { leaveIds: newLeaveIds }) //TODO
    }
    if (updateData.skills) {

      for (const userSkill of updateData.skills) {
        if (userSkill.targetSkillPoints < userSkill.skillPoints) {
          return res.status(400).json({
            message: 'Invalid target skill points. Target skill points should be greater than or equal to skill points.',
          });
        }
      }
      await updateSkillsService(updateData.skills, user.skills) //TODO
      const targetSkillsInformation = updateData.skills.map((skill) => {
        return {
          skillCategory: skill.skillCategory,
          skillPoints: skill.targetSkillPoints,
        }
      })
      await updateSkillsService(targetSkillsInformation, user.targetSkills) //TODO
    }

    const { skills = [], leave = [], contractId= [], ...rest } = updateData

    const updatedUser = await updateUserService(userId, rest) //TODO
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
  const user = await getUserByUserIdService(userId) //TODO
  const skillIds = user.skills.map((skill) => skill._id)
  await deleteSkillsService(skillIds) //TODO
  const targetSkillPoints = user.targetSkills.map((skill) => skill._id)
  await deleteSkillsService(targetSkillPoints) //TODO
  const contractId = user.contractId
  await Contract.findByIdAndDelete(contractId) //TODO
  const leaveIds = user.leaveIds
  for (const id of leaveIds) {
    await Leave.findByIdAndDelete(id) //TODO
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
