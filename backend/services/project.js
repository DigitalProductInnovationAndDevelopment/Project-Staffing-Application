import Project from '../models/Project.js'

export const getAllProjectsService = async () => {
  return Project.find()
}

export const getProjectByProjectIdService = async (projectId) => {
  return Project.findById(projectId)
}

export const createNewProjectService = async (projectData) => {
  try {
    const newProject = new Project(projectData)
    await newProject.save()
    return newProject
  } catch (error) {
    throw new Error('Failed to create new project: ${error.message}')
  }
}

export const updateProjectService = async (projectId, updateData) => {
  try {
    const project = await Project.findByIdAndUpdate(projectId, updateData, {
      new: true,
    })
    if (!project) {
      throw new Error('Project not found')
    }
    return project
  } catch (error) {
    throw new Error(`Failed to update project: ${error.message}`)
  }
}

export const deleteProjectService = async (projectId) => {
  try {
    const project = await Project.findByIdAndDelete(projectId)
    if (!project) {
      throw new Error('Project not found')
    }
    return project
  } catch (error) {
    throw new Error(`Failed to delete project: ${error.message}`)
  }
}
