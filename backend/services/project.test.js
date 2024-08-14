import {
  getAllProjectsWithProfilesEmployeesAndDemandService,
  getAllProjectsService,
  getProjectByProjectIdService,
  createNewProjectService,
  updateProjectService,
  deleteProjectService,
} from '../services/project.js'
import Project from '../models/Project.js'
import * as profileService from '../services/projectDemandProfile.js'
const mockingoose = require('mockingoose')

describe('Project Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockingoose.resetAll()
  })

  describe('getAllProjectsWithProfilesEmployeesAndDemandService', () => {
    it('should throw an error if failed to get all projects with profiles, employees, and demand information', async () => {
      const errorMessage = 'Some error'
      Project.find = jest.fn().mockRejectedValue(new Error(errorMessage))
      await expect(
        getAllProjectsWithProfilesEmployeesAndDemandService()
      ).rejects.toThrowError(errorMessage)
    })
  })

  describe('getAllProjectsService', () => {
    it('should return all projects', async () => {
      const projects = [{ name: 'Project 1' }, { name: 'Project 2' }]
      Project.find = jest.fn().mockResolvedValue(projects)
      const result = await getAllProjectsService()
      expect(Project.find).toHaveBeenCalled()
      expect(result).toEqual(projects)
    })

    it('should throw an error if projects not found', async () => {
      const errorMessage = 'Projects not found'
      Project.find = jest.fn().mockResolvedValue(null)

      await expect(getAllProjectsService).rejects.toThrowError(errorMessage)
    })
    it('should throw an error if failed to get all projects', async () => {
      const errorMessage = 'Some error'
      Project.find = jest.fn().mockRejectedValue(new Error(errorMessage))

      await expect(getAllProjectsService).rejects.toThrowError(errorMessage)
    })
  })

  describe('getProjectByProjectIdService', () => {
    it('should return a project by project ID', async () => {
      const projectId = '1'
      const project = { name: 'Project 1' }
      Project.findById = jest.fn().mockResolvedValue(project)

      const result = await getProjectByProjectIdService(projectId)

      expect(Project.findById).toHaveBeenCalledWith(projectId)
      expect(result).toEqual(project)
    })

    it('should throw an error if project not found', async () => {
      const projectId = '1'
      const errorMessage = 'Project not found'
      Project.findById = jest.fn().mockResolvedValue(null)

      const result = getProjectByProjectIdService(projectId)

      await expect(result).rejects.toThrowError(errorMessage)
    })

    it('should throw an error if failed to get project', async () => {
      const projectId = '1'
      Project.findById = jest.fn().mockRejectedValue(new Error('Some error'))

      const result = getProjectByProjectIdService(projectId)

      expect(result).rejects.toThrowError('Some error')
    })
  })

  describe('createNewProjectService', () => {
    it('should create a new project successfully', async () => {
      const mockProjectData = {
        projectName: 'New Project',
        kickoffDate: '2021-01-01',
      }

      mockingoose(Project).toReturn(mockProjectData, 'save')

      const result = await createNewProjectService(mockProjectData)

      const resultKickoffDate = new Date(result.kickoffDate)
        .toISOString()
        .split('T')[0]
      expect(resultKickoffDate).toEqual(mockProjectData.kickoffDate)
      expect(result.projectName).toEqual(mockProjectData.projectName)
    })

    it('should throw an error if the project could not be created', async () => {
      const mockProjectData = {
        projectName: 'New Project',
        kickoffDate: '2021-01-01',
      }

      mockingoose(Project).toReturn(
        new Error('New project could not be created'),
        'save'
      )

      await expect(
        createNewProjectService(mockProjectData)
      ).rejects.toThrowError('New project could not be created')
    })

    it('should throw an error if saving the project fails', async () => {
      const mockProjectData = {
        projectName: 'New Project',
        kickoffDate: '2021-01-01',
      }

      mockingoose(Project).toReturn(new Error('Save failed'), 'save')

      await expect(
        createNewProjectService(mockProjectData)
      ).rejects.toThrowError('Failed to create new project: Save failed')
    })
  })

  describe('updateProjectService', () => {
    it('should update a project given project ID and patch data', async () => {
      const projectId = '1'
      const updateData = { name: 'Updated Project' }
      const updatedProject = { _id: projectId, ...updateData }
      Project.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedProject)

      const result = await updateProjectService(projectId, updateData)

      expect(Project.findByIdAndUpdate).toHaveBeenCalledWith(
        projectId,
        updateData,
        { new: true }
      )
      expect(result).toEqual(updatedProject)
    })

    it('should throw an error if project could not be updated', async () => {
      const projectId = '1'
      const updateData = { name: 'Updated Project' }
      const errorMessage = 'Project could not be updated'
      Project.findByIdAndUpdate = jest.fn().mockResolvedValue(null)

      const result = updateProjectService(projectId, updateData)

      expect(result).rejects.toThrowError(errorMessage)
    })

    it('should throw an error if failed to update project', async () => {
      const projectId = '1'
      const updateData = { name: 'Updated Project' }
      Project.findByIdAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error('Some error'))

      const result = updateProjectService(projectId, updateData)

      expect(result).rejects.toThrowError(
        'Failed to update project: Some error'
      )
    })
  })

  describe('deleteProjectService', () => {
    it('should delete the project and associated profiles successfully', async () => {
      const projectId = '12345'
      const profileIds = ['profile1', 'profile2']

      profileService.getAllProfileIdsByProjectIdService = jest
        .fn()
        .mockResolvedValue(profileIds)
      profileService.deleteProfileService = jest.fn().mockResolvedValue(true)
      Project.findByIdAndDelete = jest
        .fn()
        .mockResolvedValue({ _id: projectId })

      const result = await deleteProjectService(projectId)

      expect(
        profileService.getAllProfileIdsByProjectIdService
      ).toHaveBeenCalledWith(projectId)
      expect(profileService.deleteProfileService).toHaveBeenCalledTimes(
        profileIds.length
      )
      profileIds.forEach((profileId) => {
        expect(profileService.deleteProfileService).toHaveBeenCalledWith(
          profileId,
          projectId
        )
      })
      expect(Project.findByIdAndDelete).toHaveBeenCalledWith(projectId)
      expect(result).toEqual({ _id: projectId })
    })

    it('should throw an error if the project is not found', async () => {
      const projectId = '12345'

      profileService.getAllProfileIdsByProjectIdService.mockResolvedValue([])
      Project.findByIdAndDelete = jest.fn().mockResolvedValue(null)

      await expect(deleteProjectService(projectId)).rejects.toThrow(
        'Project not found'
      )

      expect(
        profileService.getAllProfileIdsByProjectIdService
      ).toHaveBeenCalledWith(projectId)
      expect(Project.findByIdAndDelete).toHaveBeenCalledWith(projectId)
    })

    it('should handle errors during the deletion process', async () => {
      const projectId = '12345'
      const errorMessage = 'Some error'

      profileService.getAllProfileIdsByProjectIdService.mockRejectedValue(
        new Error(errorMessage)
      )

      await expect(deleteProjectService(projectId)).rejects.toThrow(
        `Failed to delete project: ${errorMessage}`
      )

      expect(
        profileService.getAllProfileIdsByProjectIdService
      ).toHaveBeenCalledWith(projectId)
    })
  })
})
