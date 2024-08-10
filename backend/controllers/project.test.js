import {
  getAllProjectsWithProfilesEmployeesAndDemandService,
  getProjectByProjectIdService,
  createNewProjectService,
  updateProjectService,
  deleteProjectService,
} from '../services/project.js'
import {
  getAllProjectsController,
  getProjectByIdController,
  createNewProjectController,
  updateProjectController,
  deleteProjectController,
} from '../controllers/project.js'
import * as projectService from '../services/project.js'

describe('Project Controller Tests', () => {
  // Test getAllProjectsController
  describe('getAllProjectsController', () => {
    it('should return all projects with profiles, employees, and demand', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const projects = [
        { id: 1, projectName: 'Project 1', kickOffDate: '2021-01-01' },
        { id: 2, projectName: 'Project 2', kickOffDate: '2021-02-01' },
      ]

      // Mock getAllProjectsWithProfilesEmployeesAndDemandService to return some projects
      projectService.getAllProjectsWithProfilesEmployeesAndDemandService = jest
        .fn()
        .mockResolvedValue(projects)

      await getAllProjectsController({}, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ projects })
    })

    it('should return 404 if no projects are found', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock getAllProjectsWithProfilesEmployeesAndDemandService to return null
      projectService.getAllProjectsWithProfilesEmployeesAndDemandService = jest
        .fn()
        .mockResolvedValue(null)

      await getAllProjectsController({}, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Projects not found.' })
    })

    it('should return 500 if failed to get all projects', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock getAllProjectsWithProfilesEmployeesAndDemandService to throw an error
      projectService.getAllProjectsWithProfilesEmployeesAndDemandService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await getAllProjectsController({}, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to get all projects.',
        error: 'Some error.',
      })
    })
  })

  // Test getProjectByIdController
  describe('getProjectByIdController', () => {
    it('should return the project with the given ID', async () => {
      const req = {
        params: {
          projectId: 1,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const project = {
        id: 1,
        projectName: 'Project 1',
        kickOffDate: '2021-01-01',
      }

      // Mock getProjectByProjectIdService to return a project
      projectService.getProjectByProjectIdService = jest
        .fn()
        .mockResolvedValue(project)

      await getProjectByIdController(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(project)
    })

    it('should return 404 if project with the given ID does not exist', async () => {
      const req = {
        params: {
          projectId: 1,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock getProjectByProjectIdService to return null
      projectService.getProjectByProjectIdService = jest
        .fn()
        .mockResolvedValue(null)

      await getProjectByIdController(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Project not found.' })
    })

    it('should return 500 if failed to get project by ID', async () => {
      const req = {
        params: {
          projectId: 1,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock getProjectByProjectIdService to throw an error
      projectService.getProjectByProjectIdService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await getProjectByIdController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to get project by ID.',
        error: 'Some error.',
      })
    })
  })

  // Test createNewProjectController
  describe('createNewProjectController', () => {
    it('should create a new project', async () => {
      const req = {
        body: {
          projectName: 'New Project',
          kickOffDate: '2021-01-01',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const project = {
        id: 1,
        projectName: 'New Project',
        kickOffDate: '2021-01-01',
      }

      // Mock createNewProjectService to return the created project
      projectService.createNewProjectService = jest
        .fn()
        .mockResolvedValue(project)

      await createNewProjectController(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Project created successfully.',
        data: project,
      })
    })

    it('should return 500 if createNewProjectService returns null', async () => {
      const req = {
        body: {
          projectName: 'New Project',
          kickOffDate: '2021-01-01',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock createNewProjectService to throw an error
      projectService.createNewProjectService = jest.fn().mockResolvedValue(null)

      await createNewProjectController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Project could not be created.',
      })
    })

    it('should return 500 if failed to create new project', async () => {
      const req = {
        body: {
          projectName: 'New Project',
          kickOffDate: '2021-01-01',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock createNewProjectService to throw an error
      projectService.createNewProjectService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await createNewProjectController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to create new project.',
        error: 'Some error.',
      })
    })
  })

  // Test updateProjectController
  describe('updateProjectController', () => {
    it('should update the project with the given ID', async () => {
      const req = {
        params: {
          projectId: 1,
        },
        body: {
          projectName: 'Updated Project',
          kickOffDate: '2021-01-01',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const project = {
        id: 1,
        projectName: 'Project 1',
        kickOffDate: '2021-01-01',
      }

      // Mock getProjectByProjectIdService to return a project
      projectService.getProjectByProjectIdService = jest
        .fn()
        .mockResolvedValue(project)

      // Mock updateProjectService to return the updated project
      projectService.updateProjectService = jest.fn().mockResolvedValue(project)

      await updateProjectController(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Project updated successfully.',
        data: project,
      })
    })

    it('should return 404 if project with the given ID does not exist', async () => {
      const req = {
        params: {
          projectId: 1,
        },
        body: {
          projectName: 'Updated Project',
          kickOffDate: '2021-01-01',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock getProjectByProjectIdService to return null
      projectService.getProjectByProjectIdService = jest
        .fn()
        .mockResolvedValue(null)

      await updateProjectController(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Project not found.' })
    })

    it('should return 500 if failed to update project', async () => {
      const req = {
        params: {
          projectId: 1,
        },
        body: {
          projectName: 'Updated Project',
          kickOffDate: '2021-01-01',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const project = {
        id: 1,
        projectName: 'Project 1',
        kickOffDate: '2021-01-01',
      }

      // Mock getProjectByProjectIdService to return a project
      projectService.getProjectByProjectIdService = jest
        .fn()
        .mockResolvedValue(project)

      // Mock updateProjectService to throw an error
      projectService.updateProjectService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await updateProjectController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to update project.',
        error: 'Some error.',
      })
    })
  })

  // Test deleteProjectController
  describe('deleteProjectController', () => {
    it('should delete the project with the given ID', async () => {
      const req = {
        params: {
          projectId: 1,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const project = {
        id: 1,
        projectName: 'Project 1',
        kickOffDate: '2021-01-01',
      }

      // Mock getProjectByProjectIdService to return a project
      projectService.getProjectByProjectIdService = jest
        .fn()
        .mockResolvedValue(project)

      // Mock deleteProjectService to return the deleted project
      projectService.deleteProjectService = jest.fn().mockResolvedValue(project)

      await deleteProjectController(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Project deleted successfully.',
        data: project,
      })
    })

    it('should return 404 if project with the given ID does not exist', async () => {
      const req = {
        params: {
          projectId: 1,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock getProjectByProjectIdService to return null
      projectService.getProjectByProjectIdService = jest
        .fn()
        .mockResolvedValue(null)

      await deleteProjectController(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Project not found.' })
    })

    it('should return 500 if failed to delete project', async () => {
      const req = {
        params: {
          projectId: 1,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const project = {
        id: 1,
        projectName: 'Project 1',
        kickOffDate: '2021-01-01',
      }

      // Mock getProjectByProjectIdService to return a project
      projectService.getProjectByProjectIdService = jest
        .fn()
        .mockResolvedValue(project)

      // Mock deleteProjectService to return null
      projectService.deleteProjectService = jest.fn().mockResolvedValue(null)

      await deleteProjectController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to delete project (NULL).',
      })
    })

    it('should return 500 if failed to delete project', async () => {
      const req = {
        params: {
          projectId: 1,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      const project = {
        id: 1,
        projectName: 'Project 1',
        kickOffDate: '2021-01-01',
      }

      // Mock getProjectByProjectIdService to return a project
      projectService.getProjectByProjectIdService = jest
        .fn()
        .mockResolvedValue(project)

      // Mock deleteProjectService to throw an error
      projectService.deleteProjectService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await deleteProjectController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to delete project.',
        error: 'Some error.',
      })
    })
  })
})
