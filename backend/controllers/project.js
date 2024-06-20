// import Project from "../models/Project.js";
import {
  getAllProjectsService,
  getProjectByProjectIdService,
  createNewProjectService,
  updateProjectService,
  deleteProjectService,
} from '../services/project.js'

export const getAllProjectsController = async (req, res, next) => {
  try {
    const all_projects = await getAllProjectsService()
    if (!all_projects) {
      return res.status(404).json({ message: 'Projects not found' })
    }
    res.status(200).json({ projects: all_projects })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to get all projects', error: err.message })
  }
}

export const getProjectByIdController = async (req, res, next) => {
  try {
    const { projectId } = req.params
    const project = await getProjectByProjectIdService({ projectId })
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
    const existingProject = await getProjectByProjectIdService({ projectId })
    if (existingProject) {
      return res
        .status(400)
        .json({ message: 'Project with this id already exists' })
    }
    const project = await createNewProjectService(req.body)
    res.status(201).json({ message: 'Project created successfully', project })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to create new project', error: err.message })
  }
}

export const updateProjectController = async (req, res, next) => {
  try {
    const { projectId } = req.params
    const project = await getProjectByProjectIdService({ projectId })
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
    const updatedProject = await updateProjectService(project._id, req.body)
    res.status(200).json(updatedProject)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to update project', error: err.message })
  }
}

export const deleteProjectController = async (req, res, next) => {
  try {
    const { projectId } = req.params
    const project = await getProjectByProjectIdService({ projectId })
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

export const getProjectAssignmentByProjectIdController = async (
  req,
  res,
  next
) => {
  try {
    // TODO
    res.send('getProjectAssignmentByProjectIdController')
  } catch (err) {
    next(err)
  }
}

export const updateProjectAssignmentController = async (req, res, next) => {
  try {
    // TODO
    res.send('updateProjectAssignmentController')
  } catch (err) {
    next(err)
  }
}
