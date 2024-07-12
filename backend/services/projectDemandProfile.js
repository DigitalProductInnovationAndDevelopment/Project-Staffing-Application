import ProjectDemandProfile from '../models/ProjectDemandProfile.js'
import Project from '../models/Project.js'
import Demand from '../models/Demand.js'
import Skill from '../models/Skill.js'
import { getProjectByProjectIdService } from './project.js'
import { getAssignmentByProfileIdService, deleteAssignmentService } from './assignment.js'

export const getAllProfileIdsByProjectIdService = async (projectId) => {
  try {
    const project = await getProjectByProjectIdService(projectId)
    const profileIds = project.demandProfiles
    return profileIds
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to get profile IDs by project ID: ${error.message}`)
  }
}

export const getProfileByIdService = async (profileId) => {
  try {
    const profile = await ProjectDemandProfile.findById(profileId).populate([
      { path: "targetDemandId", select: "now" },
      { path: "targetSkills" }
    ])
    return profile
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to get profile by ID: ${error.message}`)
  }
}

export const createNewProfileService = async (profileData) => {
  try {
    // create a minimal demand object
    // const newMinimalDemand = new Demand(profileData.minimalDemand)
    // await newMinimalDemand.save()
    // const newMinimalDemandId = newMinimalDemand._id
    // create a target demand object
    const newTargetDemand = new Demand(profileData.targetDemandId)
    await newTargetDemand.save()
    const newTargetDemandId = newTargetDemand._id
    // create target skills objects
    // const newTargetSkillsIds = await Promise.all(
    //   profileData.targetSkills.map(async (skill) => {
    //     const newSkill = new Skill(skill) // no profileId yet
    //     await newSkill.save()
    //     return newSkill._id
    //   })
    // )
    const newProfile = new ProjectDemandProfile({
      name: profileData.name,
      // minimalDemandId: newMinimalDemandId,
      targetDemandId: newTargetDemandId,
      // targetSkills: newTargetSkillsIds,
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
    // Find the existing profile to get the current targetDemandId
    const existingProfile = await ProjectDemandProfile.findById(profileId);
    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    // Update the Demand object if targetDemandId is part of the update
    if (updatedData.targetDemandId && updatedData.targetDemandId.now !== undefined) {
      await Demand.findByIdAndUpdate(existingProfile.targetDemandId, {
        now: updatedData.targetDemandId.now
      }, { new: true });
    }

    // Remove targetDemandId from updatedData as it is already updated
    delete updatedData.targetDemandId;

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

export const deleteProfileService = async (profileId, projectId) => {
  try {
    // get the minimal demand, target demand, and skills
    const profile = await ProjectDemandProfile.findById(profileId)
    // const minimalDemandId = profile.minimalDemandId
    const targetDemandId = profile.targetDemandId
    const targetSkillsIds = profile.targetSkills

    // delete the minimal demand
    // await Demand.findByIdAndDelete(minimalDemandId)
    const deletedProfile = await ProjectDemandProfile.findByIdAndDelete(profileId)
    if (!deletedProfile) {
      throw new Error('Profile not found')
    }

    // delete the target demand
    await Demand.findByIdAndDelete(targetDemandId._id)
    // delete the target skills
    await Promise.all(
      targetSkillsIds.map(async (skillId) => {
        await Skill.findByIdAndDelete(skillId)
      })
    )
    try {
      await removeProfileIdFromProjectService(projectId, profileId)
    } catch (err) {
      throw new Error(`Failed to remove profile id from project: ${err.message}`)
    }
    // await deleteSkillsService(profile.targetSkills)
    const assignment = await getAssignmentByProfileIdService(profileId)
    await deleteAssignmentService(assignment._id)

    // delete demands adn skills
    return deletedProfile
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to delete the profile: ${error.message}`)
  }
}

export const addProfileIdToProjectService = async (projectId, profileId) => {
  try {
    await Project.findByIdAndUpdate(
      projectId,
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
    const project = await Project.findById(projectId)
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

export const getDemandByProfileIdsService = async (profileIds) => {
  try {
    let demand = 0
    for (const profileId of profileIds) {
      const profile = await getProfileByIdService(profileId)
      if (!profile) {
        throw new Error('Profile not found')
      }
      const d = await Demand.findById(profile.targetDemandId)
      demand += d.now
    }
    return demand
  } catch (error) {
    console.error(error)
    throw new Error(`Failed to get demands by profile IDs: ${error.message}`)
  }
}
