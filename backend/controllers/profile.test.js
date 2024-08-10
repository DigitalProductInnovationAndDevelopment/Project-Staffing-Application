import {
  getAllProfilesByProjectIdController,
  getProfileByIdController,
  createNewProfilesController,
  updateProfileController,
  deleteProfileController,
  getAssignmentsByProjectIdController,
  updateAssignmentController,
} from '../controllers/profile.js'
import * as projectDemandProfile from '../services/projectDemandProfile.js'
import * as assignment from '../services/assignment.js'

describe('Profile Controller Tests', () => {
  describe('getAllProfilesByProjectIdController', () => {
    it('should return 404 if profile ids are not found', async () => {
      const req = {
        params: {
          projectId: 'sampleProjectId',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      projectDemandProfile.getAllProfileIdsByProjectIdService = jest
        .fn()
        .mockResolvedValue(null)

      await getAllProfilesByProjectIdController(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Profile ids not found.',
      })
    })

    it('should return 500 if failed to retrieve all profiles', async () => {
      const req = {
        params: {
          projectId: 'sampleProjectId',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const profileIds = ['profileId1', 'profileId2']
      const profiles = [
        { id: 'profileId1', name: 'profile1', targetDemandId: 'demandId1' },
      ]

      projectDemandProfile.getAllProfileIdsByProjectIdService = jest
        .fn()
        .mockResolvedValue(profileIds)

      projectDemandProfile.getInformationForProfilesService = jest
        .fn()
        .mockResolvedValue(profiles)

      await getAllProfilesByProjectIdController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to retrieve all profile data.',
      })
    })

    it('should return all profiles successfully', async () => {
      const req = {
        params: {
          projectId: 'sampleProjectId',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const profileIds = ['profileId1', 'profileId2']
      const profiles = [
        { id: 'profileId1', name: 'profile1', targetDemandId: 'demandId1' },
        { id: 'profileId2', name: 'profile2', targetDemandId: 'demandId2' },
      ]

      projectDemandProfile.getAllProfileIdsByProjectIdService = jest
        .fn()
        .mockResolvedValue(profileIds)

      projectDemandProfile.getInformationForProfilesService = jest
        .fn()
        .mockResolvedValue(profiles)

      await getAllProfilesByProjectIdController(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Retrieved all profiles successfully.',
        profiles: profiles,
      })
    })

    it('should return 500 if failed to get all profiles by project id', async () => {
      const req = {
        params: {
          projectId: 'sampleProjectId',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      projectDemandProfile.getAllProfileIdsByProjectIdService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await getAllProfilesByProjectIdController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to get all profiles by project id.',
        error: 'Some error.',
      })
    })
  })

  describe('getProfileByIdController', () => {
    it('should return 404 if profile is not found', async () => {
      const req = {
        params: {
          profileId: 'sampleProfileId',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      projectDemandProfile.getProfileByIdService = jest
        .fn()
        .mockResolvedValue(null)

      await getProfileByIdController(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: 'Profile not found.' })
    })

    it('should return profile successfully', async () => {
      const req = {
        params: {
          profileId: 'sampleProfileId',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      projectDemandProfile.getProfileByIdService = jest
        .fn()
        .mockResolvedValue({
          id: 'sampleProfileId',
          name: 'sampleProfile',
          targetDemandId: 'demandId',
        })

      await getProfileByIdController(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        id: 'sampleProfileId',
        name: 'sampleProfile',
        targetDemandId: 'demandId',
      })
    })

    it('should return 500 if failed to get profile by id', async () => {
      const req = {
        params: {
          profileId: 'sampleProfileId',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      projectDemandProfile.getProfileByIdService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await getProfileByIdController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to get profile by id.',
        error: 'Some error.',
      })
    })
  })

  describe('createNewProfilesController', () => {
    it('should create new profiles successfully', async () => {
      const req = {
        params: {
          projectId: 'sampleProjectId',
        },
        body: {
          profiles: [
            { id: 'profileId1', name: 'profile1', targetDemandId: 'demandId1' },
            { id: 'profileId2', name: 'profile2', targetDemandId: 'demandId2' },
          ],
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const profiles = [
        { id: ' profileId1', name: 'profile1', targetDemandId: 'demandId1' },
        { id: 'profileId2', name: 'profile2', targetDemandId: 'demandId2' },
      ]

      projectDemandProfile.createNewProfilesService = jest
        .fn()
        .mockResolvedValue(profiles)

      await createNewProfilesController(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Profiles created successfully.',
        profiles: profiles,
      })
    })

    it('should return 500 if failed to create new profiles', async () => {
      const req = {
        params: {
          projectId: 'sampleProjectId',
        },
        body: {
          profiles: [
            { id: 'profileId1', name: 'profile1', targetDemandId: 'demandId1' },
            { id: 'profileId2', name: 'profile2', targetDemandId: 'demandId2' },
          ],
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      projectDemandProfile.createNewProfilesService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await createNewProfilesController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to create new profiles.',
        error: 'Some error.',
      })
    })

    it('should return 500 if failed to create new profiles', async () => {
      const req = {
        params: {
          projectId: 'sampleProjectId',
        },
        body: {
          profiles: [
            { id: 'profileId1', name: 'profile1', targetDemandId: 'demandId1' },
            { id: 'profileId2', name: 'profile2', targetDemandId: 'demandId2' },
          ],
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      projectDemandProfile.createNewProfilesService = jest
        .fn()
        .mockResolvedValue(null)

      await createNewProfilesController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to create profiles.',
      })
    })
  })

  describe('updateProfileController', () => {
    it('should return 500 if failed to update profile', async () => {
      const req = {
        params: {
          profileId: 'sampleProfileId',
        },
        body: {
          name: 'updatedName',
          targetDemandId: 'updatedDemandId',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      projectDemandProfile.updateProfileService = jest
        .fn()
        .mockResolvedValue(null)

      await updateProfileController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to update profile (NULL).',
      })
    })

    it('should return 404 if profile is not found', async () => {
      const req = {
        params: {
          profileId: 'sampleProfileId',
        },
        body: {
          name: 'updatedName',
          targetDemandId: 'updatedDemandId',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      projectDemandProfile.updateProfileService = jest
        .fn()
        .mockRejectedValue(new Error('Profile not found.'))

      await updateProfileController(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Profile not found.' })
    })

    it('should update profile successfully', async () => {
      const req = {
        params: {
          profileId: 'sampleProfileId',
        },
        body: {
          name: 'updatedName',
          targetDemandId: 'updatedDemandId',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      projectDemandProfile.updateProfileService = jest
        .fn()
        .mockResolvedValue({
          id: 'sampleProfileId',
          name: 'updatedName',
          targetDemandId: 'updatedDemandId',
        })

      await updateProfileController(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Profile updated successfully.',
        data: {
          id: 'sampleProfileId',
          name: 'updatedName',
          targetDemandId: 'updatedDemandId',
        },
      })
    })

    it('should return 500 if failed to update profile', async () => {
      const req = {
        params: {
          profileId: 'sampleProfileId',
        },
        body: {
          name: 'updatedName',
          targetDemandId: 'updatedDemandId',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      projectDemandProfile.updateProfileService = jest
        .fn()
        .mockRejectedValue(new Error('Failed to update profile.'))

      await updateProfileController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to update profile.',
        error: 'Failed to update profile.',
      })
    })
  })

  describe('deleteProfileController', () => {
    it('should return 404 if profile is not found', async () => {
      const req = {
        params: {
          projectId: 'sampleProjectId',
          profileId: 'sampleProfileId',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      projectDemandProfile.getProfileByIdService = jest
        .fn()
        .mockResolvedValue(null)

      await deleteProfileController(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Profile not found.' })
    })

    it('should delete profile successfully', async () => {
      const req = {
        params: {
          projectId: 'sampleProjectId',
          profileId: 'sampleProfileId',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      projectDemandProfile.getProfileByIdService = jest
        .fn()
        .mockResolvedValue({
          id: 'sampleProfileId',
          name: 'sampleProfile',
          targetDemandId: 'demandId',
        })

      projectDemandProfile.deleteProfileService = jest
        .fn()
        .mockResolvedValue({
          id: 'sampleProfileId',
          name: 'sampleProfile',
          targetDemandId: 'demandId',
        })

      await deleteProfileController(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Profile deleted successfully.',
        data: {
          id: 'sampleProfileId',
          name: 'sampleProfile',
          targetDemandId: 'demandId',
        },
      })
    })

    it('should return 500 if failed to delete profile', async () => {
      const req = {
        params: {
          projectId: 'sampleProjectId',
          profileId: 'sampleProfileId',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      projectDemandProfile.getProfileByIdService = jest
        .fn()
        .mockResolvedValue({
          id: 'sampleProfileId',
          name: 'sampleProfile',
          targetDemandId: 'demandId',
        })

      projectDemandProfile.deleteProfileService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await deleteProfileController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to delete profile.',
        error: 'Some error.',
      })
    })

    it('should return 500 if failed to delete profile', async () => {
      const req = {
        params: {
          projectId: 'sampleProjectId',
          profileId: 'sampleProfileId',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      projectDemandProfile.getProfileByIdService = jest
        .fn()
        .mockResolvedValue({
          id: 'sampleProfileId',
          name: 'sampleProfile',
          targetDemandId: 'demandId',
        })

      projectDemandProfile.deleteProfileService = jest
        .fn()
        .mockResolvedValue(null)

      await deleteProfileController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to delete profile (NULL).',
      })
    })
  })

  describe('getAssignmentsByProjectIdController', () => {
    it('should return assignment data successfully', async () => {
      const req = {
        params: {
          projectId: 'sampleProjectId',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      assignment.getProfilesWithAssignedEmployeesAndSuitableEmployeesService =
        jest.fn().mockResolvedValue({ data: 'sampleData' })

      await getAssignmentsByProjectIdController(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Assignment by profile id successfully retrieved.',
        data: { data: 'sampleData' },
      })
    })

    it('should return 500 if failed to get project assignment by profile id', async () => {
      const req = {
        params: {
          projectId: 'sampleProjectId',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      assignment.getProfilesWithAssignedEmployeesAndSuitableEmployeesService =
        jest.fn().mockRejectedValue(new Error('Some error.'))

      await getAssignmentsByProjectIdController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to get project assignment by profile id.',
        error: 'Some error.',
      })
    })

    it('should return 500 if failed to get project assignment by profile id', async () => {
      const req = {
        params: {
          projectId: 'sampleProjectId',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      assignment.getProfilesWithAssignedEmployeesAndSuitableEmployeesService =
        jest.fn().mockResolvedValue(null)

      await getAssignmentsByProjectIdController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to get profiles with employees.',
      })
    })
  })

  describe('updateAssignmentController', () => {
    it('should update assignments successfully', async () => {
      const req = {
        body: {
          profiles: 'sampleProfiles',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      assignment.updateAssignmentsService = jest
        .fn()
        .mockResolvedValue({ data: 'sampleData' })

      await updateAssignmentController(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Assignments successfully updated.',
        data: { data: 'sampleData' },
      })
    })

    it('should return 500 if failed to update assignments by profile', async () => {
      const req = {
        body: {
          profiles: 'sampleProfiles',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      assignment.updateAssignmentsService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await updateAssignmentController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to update assignments by profile.',
        error: 'Some error.',
      })
    })

    it('should return 500 if failed to update assignments by profile', async () => {
      const req = {
        body: {
          profiles: 'sampleProfiles',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      assignment.updateAssignmentsService = jest.fn().mockResolvedValue(null)

      await updateAssignmentController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to update assignments by profile (NULL).',
      })
    })
  })
})
