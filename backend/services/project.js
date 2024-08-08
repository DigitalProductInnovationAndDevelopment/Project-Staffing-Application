import Project from '../models/Project.js'
import { getAllEmployeesByProfileIdsService } from '../services/assignment.js'
import {
  getAllProfileIdsByProjectIdService,
  deleteProfileService,
  getDemandByProfileIdsService,
} from '../services/projectDemandProfile.js'

export const getAllProjectsWithProfilesEmployeesAndDemandService = async () => {
  const completeListOfProjects = []
  // get number of employees required for a project depending on all profiles demand
  // get the assigned employees to a profile
  // add allEmployees to every project
  const all_projects = await getAllProjectsService()
  if (!all_projects) {
    return res.status(404).json({ message: 'Projects not found' })
  }
  // get all profiles of a project
  for (let i = 0; i < all_projects.length; i++) {
    const allProfileIds = await getAllProfileIdsByProjectIdService(
      //TODO
      all_projects[i]._id
    )
    const allEmployees = await getAllEmployeesByProfileIdsService(allProfileIds) //TODO
    const demand = await getDemandByProfileIdsService(allProfileIds) //TODO
    completeListOfProjects.push({
      ...all_projects[i]._doc,
      assignedEmployees: allEmployees,
      numberOfDemandedEmployees: demand,
    })
  }
  return completeListOfProjects
}

export const getAllProjectsService = async () => {
  return Project.find()
}

export const getProjectByProjectIdService = async (projectId) => {
  return Project.findById(projectId)
}

export const createNewProjectService = async (projectData) => {
  try {
    // const existingProject = await getProjectByProjectIdService(
    //   projectData.projectId
    // )
    // if (existingProject) {
    //   throw new Error('Project already exists')
    // }
    // Why? We are not assigning the ids ourselves MongoDB does that for us
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
    // console.log('touched')
    return project
  } catch (error) {
    throw new Error(`Failed to update project: ${error.message}`)
  }
}

export const deleteProjectService = async (projectId) => {
  try {
    const allProfileIds = await getAllProfileIdsByProjectIdService(projectId)
    for (let i = 0; i < allProfileIds.length; i++) {
      const deletedProfile = await deleteProfileService(
        allProfileIds[i],
        project._id
      )
      if (!deletedProfile) {
        throw new Error("Couldn't delete profile.")
      }
    }

    const project = await Project.findByIdAndDelete(projectId)
    if (!project) {
      throw new Error('Project not found')
    }
    return project
  } catch (error) {
    throw new Error(`Failed to delete project: ${error.message}`)
  }
}
