import {
  getAllProfileIdsByProjectIdService,
  getProfileByIdService,
  createNewProfileService,
  updateProfileService,
  deleteProfileService,
  addProfileIdToProjectService,
  removeProfileIdFromProjectService,
} from '../services/projectDemandProfile.js'
import { getProjectByIdController } from './project.js'
import {
  createNewAssignmentService,
  deleteAssignmentService,
  getAssignmentByProfileIdService,
  updateAssignmentService,
} from '../services/assignment.js'
import {
  deleteSkillsService,
  updateSkillsService,
  createNewSkillsService,
  addSkillsToProfileService,
} from '../services/skill.js'

export const getAllProfilesByProjectIdController = async (req, res, next) => {
  try {
    const allProfileIds = await getAllProfileIdsByProjectIdService(
      req.params.projectId
    )
    if (!allProfileIds) {
      return res.status(404).json({ message: 'Profile ids not found' })
    } else if (allProfileIds.length === 0) {
      return res
        .status(200)
        .json({ message: 'No profiles found for this project' })
    } //status code ???
    const allProfiles = await Promise.all(
      allProfileIds.map(async (profileId) => {
        const profile = await getProfileByIdService(profileId)
        return profile
      })
    )
    if (allProfiles.length !== allProfileIds.length) {
      return res
        .status(500)
        .json({ message: 'Failed to retrieve all profiles' })
    }
    res.status(200).json({ profiles: allProfiles })
  } catch (err) {
    res.status(500).json({
      message: 'Failed to get all profiles by project id',
      error: err.message,
    })
  }
}

export const getProfileByIdController = async (req, res) => {
  try {
    const { projectId, profileId } = req.params
    const profile = await getProfileByIdService(profileId)
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
    }
    res.status(200).json(profile)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to get profile by id', error: err.message })
  }
}

export const createNewProfileController = async (req, res, next) => {
  try {
    const { projectId } = req.params
    const data = req.body
    const profile = await createNewProfileService(data)
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
    }
    addProfileIdToProjectService(projectId, profile._id)
    createNewAssignmentService(profile._id)
    try {
      const newSkill = await createNewSkillsService(
        data.targetSkills ? data.targetSkills : []
      )
      const newSkillIds = newSkill.map((skill) => skill._id)
      console.log(newSkillIds)
      const profileWithSkills = await addSkillsToProfileService(
        profile._id,
        newSkillIds
      )
      return res.status(201).json({
        message: 'User created successfully',
        data: profileWithSkills,
      })
    } catch (error) {
      deleteProfileService(profile._id)
      return res.status(500).json({
        message: error.message + ' skill could not be created',
      })
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to create new profile', error: err.message })
  }
}

export const updateProfileController = async (req, res, next) => {
  try {
    const { projectId, profileId } = req.params
    const profile = await getProfileByIdService(profileId)
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' })
    }
    let updateData = req.body
    if (updateData.targetSkills) {
      await updateSkillsService(updateData.targetSkills, profile.targetSkills)
    }

    const { targetSkills, ...rest } = updateData

    const updatedProfile = await updateProfileService(profile._id, rest)
    res
      .status(200)
      .json({ message: 'Profile updated successfully', data: updatedProfile })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to update profile', error: err.message })
  }
}

export const deleteProfileController = async (req, res, next) => {
  try {
    const { projectId, profileId } = req.params
    const profile = await getProfileByIdService(profileId)
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' })
    }
    
    const deletedProfile = await deleteProfileService(profileId, projectId)
    res
      .status(200)
      .json({ message: 'Profile deleted successfully', data: deletedProfile })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to delete profile', error: err.message })
  }
}

export const getAssignmentByProfileIdController = async (req, res, next) => {
  try {
    const { projectId, profileId } = req.params

    const assignment = await getAssignmentByProfileIdService(profileId)
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' })
    }

    res.status(200).json({
      message: 'Assignment by profile id successfully retrieved',
      data: assignment,
    })
  } catch (err) {
    res.status(500).json({
      message: 'Failed to get project assignment by profile id',
      error: err.message,
    })
  }
}

export const updateAssignmentController = async (req, res, next) => {
  try {
    const { projectId, profileId } = req.params

    const assignment = await getAssignmentByProfileIdService(profileId)
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' })
    }

    console.log(assignment._id)

    const updatedAssignment = await updateAssignmentService(
      assignment._id,
      req.body
    )
    res.status(200).json({
      message: 'Assignment successfully updated',
      data: updatedAssignment,
    })
  } catch (err) {
    res.status(500).json({
      message: 'Failed to update assignment by profile',
      error: err.message,
    })
  }
}
