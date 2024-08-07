import {
  getProjectByProjectIdService,
  createNewProjectService,
  updateProjectService,
  deleteProjectService,
  getAllProjectsWithProfilesEmployeesAndDemandService,
} from '../services/project.js'

export const getAllProjectsController = async (_, res) => {
  try {
    const all_projects =
      await getAllProjectsWithProfilesEmployeesAndDemandService()

    res.status(200).json({ projects: all_projects })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to get all projects.', error: err.message })
  }
}

export const getProjectByIdController = async (req, res) => {
  try {
    const { projectId } = req.params

    const project = await getProjectByProjectIdService(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' })
    }
    res.status(200).json(project)
    // res.status(200).json({message: 'Project fetched successfully', data: project})
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to get project by ID.', error: err.message })
  }
}

export const createNewProjectController = async (req, res) => {
  try {
    const projectData = req.body

    const project = await createNewProjectService(projectData)

    res
      .status(201)
      .json({ message: 'Project created successfully.', data: project })
  } catch (err) {
    // if (err.message === 'Project already exists') {
    //   return res.status(400).json({ message: 'Project already exists.' })
    // }
    res
      .status(500)
      .json({ message: 'Failed to create new project.', error: err.message })
  }
}

export const updateProjectController = async (req, res) => {
  try {
    const { projectId } = req.params

    const project = await getProjectByProjectIdService(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' })
    }

    const updatedProject = await updateProjectService(project._id, req.body)

    res
      .status(200)
      .json({ message: 'Project updated successfully.', data: updatedProject })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to update project.', error: err.message })
  }
}

export const deleteProjectController = async (req, res) => {
  try {
    const { projectId } = req.params

    const project = await getProjectByProjectIdService(projectId)
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' })
    }

    const deletedProject = await deleteProjectService(project._id)
    if (!deletedProject) {
      return res.status(500).json({ message: 'Failed to delete project.' })
    }

    res
      .status(200)
      .json({ message: 'Project deleted successfully.', data: deletedProject })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to delete project.', error: err.message })
  }
}
