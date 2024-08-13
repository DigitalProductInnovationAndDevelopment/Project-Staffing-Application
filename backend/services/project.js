import {
  deleteProfileService,
  getAllProfileIdsByProjectIdService,
  getDemandByProfileIdsService,
} from '../services/projectDemandProfile.js'
import Project from '../models/Project.js'
import { getAllEmployeesByProfileIdsService } from '../services/assignment.js'

// Function to get all projects with profiles, employees and demand information
export const getAllProjectsWithProfilesEmployeesAndDemandService = async () => {
  try {
    const completeListOfProjects = []

    // get number of employees required for a project depending on all profiles demand
    // get the assigned employees to a profile
    // add allEmployees to every project

    // get all projects
    const all_projects = await getAllProjectsService()

    // get all profiles of a project
    for (let i = 0; i < all_projects.length; i++) {
      const allProfileIds = await getAllProfileIdsByProjectIdService(
        all_projects[i]._id
      )

      // get all employees of a project
      const allEmployees =
        await getAllEmployeesByProfileIdsService(allProfileIds)

      // get demand of profiles
      const demand = await getDemandByProfileIdsService(allProfileIds)

      completeListOfProjects.push({
        ...all_projects[i]._doc,
        assignedEmployees: allEmployees,
        numberOfDemandedEmployees: demand,
      })
    }

    return completeListOfProjects
  } catch (err) {
    throw new Error(
      `Failed to get all projects with profiles, employees and demand information: ${err.message}`
    )
  }
}

// Function to get all projects
export const getAllProjectsService = async () => {
  const projects = await Project.find()
  if (!projects) {
    throw new Error('Projects not found')
  }

  return projects
}

// Function to get a project by project ID
export const getProjectByProjectIdService = async (projectId) => {
  const project = await Project.findById(projectId)
  if (!project) {
    throw new Error('Project not found')
  }

  return project
}

export const createNewProjectService = async (projectData) => {
  try {
    // no need to check if project already exists, as the project ids are unique and created by MongoDB
    const newProject = new Project(projectData)
    if (!newProject) {
      throw new Error('New project could not be created')
    }
    await newProject.save()

    return newProject
  } catch (err) {
    throw new Error(`Failed to create new project: ${err.message}`)
  }
}

// Function to update a project given project ID and patch data
export const updateProjectService = async (projectId, updateData) => {
  try {
    const project = await Project.findByIdAndUpdate(projectId, updateData, {
      new: true,
    })
    if (!project) {
      throw new Error('Project could not be updated')
    }

    return project
  } catch (err) {
    throw new Error(`Failed to update project: ${err.message}`)
  }
}

// Function to delete a project by project ID
export const deleteProjectService = async (projectId) => {
  try {
    //requirement: delete all profiles and associated demand and skills of a profile

    // get all profile ids of a project
    const allProfileIds = await getAllProfileIdsByProjectIdService(projectId)

    // delete all profiles of a project
    for (let i = 0; i < allProfileIds.length; i++) {
      await deleteProfileService(allProfileIds[i], projectId)
    }

    // delete the project
    const project = await Project.findByIdAndDelete(projectId)
    if (!project) {
      throw new Error('Project not found')
    }

    return project
  } catch (err) {
    throw new Error(`Failed to delete project: ${err.message}`)
  }
}
