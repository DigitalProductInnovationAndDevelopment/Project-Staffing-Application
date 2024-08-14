import Project from '../models/Project.js'
import Demand from '../models/Demand.js'
import ProjectDemandProfile from '../models/ProjectDemandProfile.js'
import * as profileService from './projectDemandProfile.js'
import * as projectService from './project.js'
const mockingoose = require('mockingoose')

import { createNewProfileService } from './projectDemandProfile.js'

describe('Project Service Tests', () => {
  describe('getAllProfileIdsByProjectIdService', () => {
    it('should throw an error when project is not found', async () => {
      const projectId = '1'
      projectService.getProjectByProjectIdService = jest
        .fn()
        .mockResolvedValue(null)

      const result =
        profileService.getAllProfileIdsByProjectIdService(projectId)

      await expect(result).rejects.toThrow('Project not found')
      expect(projectService.getProjectByProjectIdService).toHaveBeenCalledWith(
        projectId
      )
    })

    it('should throw an error when profile IDs are not found', async () => {
      const projectId = '1'
      const mockProject = { demandProfiles: null }
      projectService.getProjectByProjectIdService = jest
        .fn()
        .mockResolvedValue(mockProject)

      const result =
        profileService.getAllProfileIdsByProjectIdService(projectId)

      await expect(result).rejects.toThrow('Profile IDs not found')
      expect(projectService.getProjectByProjectIdService).toHaveBeenCalledWith(
        projectId
      )
    })
  })

  describe('getAllProfilesService', () => {
    it('should throw an error when profiles are not found', async () => {
      mockingoose(ProjectDemandProfile).toReturn(null, 'find')

      await expect(profileService.getAllProfilesService()).rejects.toThrow()
    })

    it('should throw an error when an exception occurs', async () => {
      mockingoose(ProjectDemandProfile).toReturn(
        new Error('Database error'),
        'find'
      )

      await expect(profileService.getAllProfilesService()).rejects.toThrow()
    })
  })

  describe('getProfileByIdService', () => {
    it('should throw an error when profile is not found', async () => {
      const profileId = '1'
      mockingoose(ProjectDemandProfile).toReturn(null, 'findOne')

      await expect(
        profileService.getProfileByIdService(profileId)
      ).rejects.toThrow()
    })

    it('should throw an error when an exception occurs', async () => {
      const profileId = '1'
      mockingoose(ProjectDemandProfile).toReturn(
        new Error('Some error'),
        'findOne'
      )

      await expect(
        profileService.getProfileByIdService(profileId)
      ).rejects.toThrow()
    })
  })

  describe('addProfileIdToProjectService', () => {
    const projectId = 'testProjectId'
    const profileId = 'testProfileId'
    it('should add profile ID to project successfully', async () => {
      const mockProject = { _id: projectId, demandProfiles: [profileId] }
      mockingoose(Project).toReturn(mockProject, 'findOneAndUpdate')

      const result = await profileService.addProfileIdToProjectService(
        projectId,
        profileId
      )

      expect(result._id).not.toBeNull()
      expect(result.demandProfiles).not.toBeNull()
    })

    it('should throw an error if project is not found', async () => {
      mockingoose(Project).toReturn(null, 'findOneAndUpdate')

      await expect(
        profileService.addProfileIdToProjectService(projectId, profileId)
      ).rejects.toThrow('Project not found')
    })

    it('should throw an error if database operation fails', async () => {
      mockingoose(Project).toReturn(
        new Error('Database error'),
        'findOneAndUpdate'
      )

      await expect(
        profileService.addProfileIdToProjectService(projectId, profileId)
      ).rejects.toThrow('Failed to add profile ID to project: Database error')
    })
  })

  describe('removeProfileIdFromProjectService', () => {
    const projectId = 'testProjectId'
    const profileId = 'testProfileId'

    it('should throw an error if project is not found', async () => {
      mockingoose(Project).toReturn(null, 'findOne')

      await expect(
        profileService.removeProfileIdFromProjectService(projectId, profileId)
      ).rejects.toThrow('Project not found')
    })

    it('should throw an error if database operation fails', async () => {
      mockingoose(Project).toReturn(new Error('Database error'), 'findOne')

      await expect(
        profileService.removeProfileIdFromProjectService(projectId, profileId)
      ).rejects.toThrow(
        'Failed to remove profile ID from project: Database error'
      )
    })
  })

  describe('getDemandByProfileIdsService', () => {
    const profileIds = ['profileId1', 'profileId2']

    it('should throw an error if profile retrieval fails', async () => {
      profileService.getProfileByIdService = jest
        .fn()
        .mockRejectedValue(new Error('Profile retrieval error'))

      await expect(
        profileService.getDemandByProfileIdsService(profileIds)
      ).rejects.toThrow()
    })

    it('should throw an error if demand retrieval fails', async () => {
      const mockProfiles = [
        { _id: 'profileId1', targetDemandId: 'demandId1' },
        { _id: 'profileId2', targetDemandId: 'demandId2' },
      ]

      profileService.getProfileByIdService = jest.fn((id) => {
        return mockProfiles.find((profile) => profile._id === id)
      })

      mockingoose(Demand).toReturn(
        new Error('Demand retrieval error'),
        'findOne'
      )

      await expect(
        profileService.getDemandByProfileIdsService(profileIds)
      ).rejects.toThrowError()
    })
  })
})
