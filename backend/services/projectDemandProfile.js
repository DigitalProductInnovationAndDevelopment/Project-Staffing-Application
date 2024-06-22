import ProjectDemandProfile from '../models/ProjectDemandProfile.js'
import Project from '../models/Project.js'
import Demand from '../models/Demand.js'
import Skill from '../models/Skill.js'
import { getProjectByProjectIdService } from './project.js'

export const getAllProfileIdsByProjectIdService = async (projectId) => {
  try {
    const project = await getProjectByProjectIdService({ projectId })
    const profileIds = project.demandProfiles
    return profileIds
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to get profile IDs by project ID: ${error.message}`)
  }
}

export const getProfileByIdService = async (profileId) => {
  try {
    const profile = await ProjectDemandProfile.findById(profileId)
    return profile
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to get profile by ID: ${error.message}`)
  }
}

export const createNewProfileService = async (profileData) => {
  try {
    // create a minimal demand object
    const newMinimalDemand = new Demand(profileData.minimalDemand)
    await newMinimalDemand.save()
    const newMinimalDemandId = newMinimalDemand._id
    // create a target demand object
    const newTargetDemand = new Demand(profileData.targetDemand)
    await newTargetDemand.save()
    const newTargetDemandId = newTargetDemand._id
    // create target skills objects
    const newTargetSkillsIds = await Promise.all(
      profileData.targetSkills.map(async (skill) => {
        const newSkill = new Skill(skill) // no profileId yet
        await newSkill.save()
        return newSkill._id
      })
    )
    const newProfile = new ProjectDemandProfile({
      name: profileData.name,
      minimalDemandId: newMinimalDemandId,
      targetDemandId: newTargetDemandId,
      targetSkills: newTargetSkillsIds,
    })
    await newProfile.save()
    return newProfile
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to create a new profile: ${error.message}`)
  }
}

export const updateProfileService = async (profileId, updatedData) => {
  try {
    const updatedProfile = await ProjectDemandProfile.findOneAndUpdate(
      profileId,
      updatedData,
      { new: true }
    )
    if (!updatedProfile) {
      throw new Error('Profile not found')
    }
    return updatedProfile
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to update the profile: ${error.message}`)
  }
}

export const deleteProfileService = async (profileId) => {
  try {
    // get the minimal demand, target demand, and skills
    const profile = await ProjectDemandProfile.findById(profileId)
    const minimalDemandId = profile.minimalDemandId
    const targetDemandId = profile.targetDemandId
    const targetSkillsIds = profile.targetSkills

    // delete the minimal demand
    await Demand.findByIdAndDelete(minimalDemandId)

    // delete the target demand
    await Demand.findByIdAndDelete(targetDemandId)

    // delete the target skills
    await Promise.all(
      targetSkillsIds.map(async (skillId) => {
        await Skill.findByIdAndDelete(skillId)
      })
    )

    const deletedProfile =
      await ProjectDemandProfile.findByIdAndDelete(profileId)
    if (!deletedProfile) {
      throw new Error('Profile not found')
    }
    // delete demands adn skills
    return deletedProfile
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to delete the profile: ${error.message}`)
  }
}

export const addProfileIdToProjectService = async (projectId, profileId) => {
  try {
    await Project.findOneAndUpdate(
      { projectId: projectId },
      { $push: { demandProfiles: profileId } },
      { new: true, useFindAndModify: false }
    )
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to add profile ID to project: ${error.message}`)
  }
}

export const removeProfileIdFromProjectService = async (
  projectId,
  profileId
) => {
  try {
    const project = await Project.findOne({ projectId })
    if (!project) {
      throw new Error('Project not found')
    }
    project.demandProfiles = project.demandProfiles.filter(
      (dP) => dP._id.toString() !== profileId
    )
    await project.save()
  } catch (error) {
    console.error(error)
    throw new Error(
      `Failed to remove profile ID from project: ${error.message}`
    )
  }
}
