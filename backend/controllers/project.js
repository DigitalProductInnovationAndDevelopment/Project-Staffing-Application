import {
  getAllProjectsService,
  getProjectByProjectIdService,
  createNewProjectService,
  updateProjectService,
  deleteProjectService,
} from '../services/project.js'
import { getAllEmployeesByProfileIdsService } from '../services/assignment.js'
import { getAllProfileIdsByProjectIdService } from '../services/projectDemandProfile.js'
import { getDemandByProfileIdsService } from '../services/projectDemandProfile.js'

export const getAllProjectsController = async (req, res, next) => {
  try {
    const completeListOfProjects = []
    const all_projects = await getAllProjectsService()
    if (!all_projects) {
      return res.status(404).json({ message: 'Projects not found' })
    }
    // get all profiles of a project
    for (let i = 0; i < all_projects.length; i++) {
      const allProfileIds = await getAllProfileIdsByProjectIdService( //TODO
        all_projects[i]._id
      )
      const allEmployees =
        await getAllEmployeesByProfileIdsService(allProfileIds) //TODO
      // console.log(allEmployees)
      const demand = await getDemandByProfileIdsService(allProfileIds) //TODO
      completeListOfProjects.push({
        ...all_projects[i]._doc,
        assignedEmployees: allEmployees,
        numberOfDemandedEmployees: demand,
      })
    }
    // get number of employees required for a project depending on all profiles demand
    // get the assigned employees to a profile
    // add allEmployees to every project
    res.status(200).json({ projects: completeListOfProjects })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to get all projects', error: err.message })
  }
}

export const getProjectByIdController = async (req, res, next) => {
  try {
    const { projectId } = req.params
    const project = await getProjectByProjectIdService(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
    res.status(200).json(project)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to get project by ID', error: err.message })
  }
}

export const createNewProjectController = async (req, res, next) => {
  try {
    const { projectId } = req.body
    const existingProject = await getProjectByProjectIdService(projectId)
    if (existingProject) {
      return res
        .status(400)
        .json({ message: 'Project with this id already exists' }) //TODO why?
    }
    const project = await createNewProjectService(req.body)
    res
      .status(201)
      .json({ message: 'Project created successfully', data: project })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to create new project', error: err.message })
  }
}

export const updateProjectController = async (req, res, next) => {
  try {
    const { projectId } = req.params
    const project = await getProjectByProjectIdService(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
    const updatedProject = await updateProjectService(project._id, req.body)
    res
      .status(200)
      .json({ message: 'Project updated successfully', data: updatedProject })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to update project', error: err.message })
  }
}

export const deleteProjectController = async (req, res, next) => { //TODO: delete all associated
  try {
    const { projectId } = req.params
    const project = await getProjectByProjectIdService(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
    const deletedProject = await deleteProjectService(project._id)
    res
      .status(200)
      .json({ message: 'Project deleted successfully', data: deletedProject })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to delete project', error: err.message })
  }
}
