import {
  getAllProfileIdsByProjectIdService,
  getProfileByIdService,
  updateProfileService,
  deleteProfileService,
  getInformationForProfilesService,
  createNewProfilesService,
} from '../services/projectDemandProfile.js'
import {
  getProfilesWithAssignedEmployeesAndSuitableEmployeesService,
  updateAssignmentsService,
} from '../services/assignment.js'

export const getAllProfilesByProjectIdController = async (req, res) => {
  try {
    const projectId = req.params.projectId

    const allProfileIds = await getAllProfileIdsByProjectIdService(projectId)
    if (!allProfileIds) {
      return res.status(404).json({ message: 'Profile ids not found.' })
    }

    const allProfiles = await getInformationForProfilesService(allProfileIds)

    if (allProfiles.length != allProfileIds.length) {
      return res
        .status(500)
        .json({ message: 'Failed to retrieve all profile data.' })
    }

    res.status(200).json({
      message: 'Retrieved all profiles successfully.',
      profiles: allProfiles,
    })
  } catch (err) {
    res.status(500).json({
      message: 'Failed to get all profiles by project id.',
      error: err.message,
    })
  }
}

export const getProfileByIdController = async (req, res) => {
  try {
    const { profileId } = req.params

    const profile = await getProfileByIdService(profileId)
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found.' })
    }

    res.status(200).json(profile)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to get profile by id.', error: err.message })
  }
}

export const createNewProfilesController = async (req, res, next) => {
  try {
    const { projectId } = req.params
    const data = req.body

    const newProfiles = await createNewProfilesService(projectId, data)
    if (!newProfiles) {
      return res.status(500).json({ message: 'Failed to create profiles.' })
    }

    return res.status(201).json({
      message: 'Profiles created successfully.',
      profiles: newProfiles,
    })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to create new profiles.', error: err.message })
  }
}

export const updateProfileController = async (req, res) => {
  try {
    const { profileId } = req.params
    const updateData = req.body

    const updatedProfile = await updateProfileService(profileId, updateData)
    if (!updatedProfile) {
      return res
        .status(500)
        .json({ message: 'Failed to update profile (NULL).' })
    }

    res
      .status(200)
      .json({ message: 'Profile updated successfully.', data: updatedProfile })
  } catch (err) {
    if (err.message === 'Profile not found.') {
      return res.status(404).json({ message: 'Profile not found.' })
    }
    res
      .status(500)
      .json({ message: 'Failed to update profile.', error: err.message })
  }
}

export const deleteProfileController = async (req, res) => {
  try {
    const { projectId, profileId } = req.params

    const profile = await getProfileByIdService(profileId)
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found.' })
    }

    const deletedProfile = await deleteProfileService(profileId, projectId)
    if (!deletedProfile) {
      return res
        .status(500)
        .json({ message: 'Failed to delete profile (NULL).' })
    }

    res
      .status(200)
      .json({ message: 'Profile deleted successfully.', data: deletedProfile })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to delete profile.', error: err.message })
  }
}

export const getAssignmentsByProjectIdController = async (req, res) => {
  try {
    const { projectId } = req.params

    const data =
      await getProfilesWithAssignedEmployeesAndSuitableEmployeesService(
        projectId
      )
    if (!data) {
      return res.status(500).json({
        message: 'Failed to get profiles with employees.',
      })
    }

    res.status(200).json({
      message: 'Assignment by profile id successfully retrieved.',
      data: data,
    })
  } catch (err) {
    res.status(500).json({
      message: 'Failed to get project assignment by profile id.',
      error: err.message,
    })
  }
}

export const updateAssignmentController = async (req, res) => {
  try {
    const profiles = req.body

    const updateAssignments = await updateAssignmentsService(profiles)
    if (!updateAssignments) {
      return res.status(500).json({
        message: 'Failed to update assignments by profile (NULL).',
      })
    }

    res.status(200).json({
      message: 'Assignments successfully updated.',
      data: updateAssignments,
    })
  } catch (err) {
    res.status(500).json({
      message: 'Failed to update assignments by profile.',
      error: err.message,
    })
  }
}
