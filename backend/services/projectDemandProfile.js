import ProjectDemandProfile from '../models/ProjectDemandProfile.js'
import Project from '../models/Project.js'
import Demand from '../models/Demand.js'
import Skill from '../models/Skill.js'
import { getProjectByProjectIdService } from './project.js'
import {
  getAssignmentByProfileIdService,
  deleteAssignmentService,
  createNewAssignmentService,
} from './assignment.js'
import {
  createNewSkillsService,
  updateSkillsService,
  addSkillsToProfileService,
} from './skill.js'

export const getAllProfileIdsByProjectIdService = async (projectId) => {
  try {
    const project = await getProjectByProjectIdService(projectId)
    const profileIds = project.demandProfiles
    return profileIds
  } catch (error) {
    throw new Error(`Failed to get profile IDs by project ID: ${error.message}`)
  }
}

export const getInformationForProfilesService = async (profileIds) => {
  try {
    const profiles = await Promise.all(
      profileIds.map(async (profileId) => {
        const profile = await getProfileByIdService(profileId)
        return profile
      })
    )
    return profiles
  } catch (error) {
    throw new Error(`Failed to get profile information: ${error.message}`)
  }
}

export const getAllProfilesService = async () => {
  try {
    const profiles = await ProjectDemandProfile.find().populate([
      { path: 'targetDemandId', select: 'now' },
      {
        path: 'targetSkills',
        populate: {
          path: 'skillCategory',
          select: 'name maxPoints',
          transform: (doc) =>
            doc == null
              ? null
              : { skillCategory: doc.name, maxPoints: doc.maxPoints },
        },
        transform: (doc) =>
          doc == null
            ? null
            : {
                _id: doc._id,
                skillPoints: doc.skillPoints,
                skillCategory: doc.skillCategory?.skillCategory,
                maxSkillPoints: doc.skillCategory?.maxPoints,
              },
      },
    ])
    return profiles
  } catch (error) {
    throw new Error(`Failed to get all profiles: ${error.message}`)
  }
}

export const getProfileByIdService = async (profileId) => {
  try {
    let profile = await ProjectDemandProfile.findById(profileId).populate([
      { path: 'targetDemandId', select: 'now' },
      {
        path: 'targetSkills',
        populate: {
          path: 'skillCategory',
          select: 'name maxPoints',
          transform: (doc) =>
            doc == null
              ? null
              : { skillCategory: doc.name, maxPoints: doc.maxPoints },
        },
        transform: (doc) =>
          doc == null
            ? null
            : {
                _id: doc._id,
                skillPoints: doc.skillPoints,
                skillCategory: doc.skillCategory?.skillCategory,
                maxSkillPoints: doc.skillCategory?.maxPoints,
              },
      },
    ])

    return profile
  } catch (error) {
    throw new Error(`Failed to get profile by ID: ${error.message}`)
  }
}

export const createNewProfilesService = async (projectId, profilesData) => {
  try {
    const profiles = []

    for (const p of profilesData) {
      const profile = await createNewProfileService(p)
      if (!profile) {
        throw new Error('Profile could not be created')
      }
      await addProfileIdToProjectService(projectId, profile._id) //TODO
      await createNewAssignmentService(profile._id) //TODO
      try {
        const newSkill = await createNewSkillsService(
          p.targetSkills ? p.targetSkills : []
        )
        const newSkillIds = newSkill.map((skill) => skill._id)
        const profileWithSkills = await addSkillsToProfileService(
          profile._id,
          newSkillIds
        )
        profiles.push(profileWithSkills)
      } catch (error) {
        deleteProfileService(profile._id) // TODO: delete all profiles
        throw new Error(`Failed to create new skills: ${error.message}`)
      }
    }
    return profiles
  } catch (error) {
    throw new Error(`Failed to create new profiles: ${error.message}`)
  }
}

export const createNewProfileService = async (profileData) => {
  try {
    // create a target demand object
    const newTargetDemand = new Demand(profileData.targetDemandId)
    await newTargetDemand.save()
    const newTargetDemandId = newTargetDemand._id
    const newProfile = new ProjectDemandProfile({
      name: profileData.name,
      targetDemandId: newTargetDemandId,
    })
    await newProfile.save()
    return newProfile
  } catch (error) {
    throw new Error(`Failed to create a new profile: ${error.message}`)
  }
}

export const updateProfileService = async (profileId, updateData) => {
  // console.log('updateData', updateData)
  try {
    // Find the existing profile to get the current targetDemandId
    const existingProfile = await getProfileByIdService(profileId)
    if (!existingProfile) {
      throw new Error('Profile not found')
    }

    // Update the Demand object if targetDemandId is part of the update
    if (
      updateData.targetDemandId &&
      updateData.targetDemandId.now !== undefined
    ) {
      await Demand.findByIdAndUpdate(
        existingProfile.targetDemandId,
        {
          now: updateData.targetDemandId.now,
        },
        { new: true }
      )
    }

    if (updateData.targetSkills) {
      await updateSkillsService(
        updateData.targetSkills,
        existingProfile.targetSkills
      ) //TODO
    }

    // Remove targetDemandId from updatedData as it is already updated
    delete updateData.targetDemandId
    delete updateData.targetSkills

    const updatedProfile = await ProjectDemandProfile.findByIdAndUpdate(
      profileId,
      updateData,
      { new: true }
    )
    if (!updatedProfile) {
      throw new Error('Profile not found')
    }

    return updatedProfile
  } catch (error) {
    throw new Error(`Failed to update the profile: ${error.message}`)
  }
}

export const deleteProfileService = async (profileId, projectId) => {
  try {
    // get the minimal demand, target demand, and skills
    const profile = await ProjectDemandProfile.findById(profileId)
    const targetDemandId = profile.targetDemandId
    const targetSkillsIds = profile.targetSkills

    const deletedProfile =
      await ProjectDemandProfile.findByIdAndDelete(profileId)
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
      throw new Error(
        `Failed to remove profile id from project: ${err.message}`
      )
    }
    const assignment = await getAssignmentByProfileIdService(profileId)
    await deleteAssignmentService(assignment._id)

    // delete demands and skills
    return deletedProfile
  } catch (error) {
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
    throw new Error(`Failed to get demands by profile IDs: ${error.message}`)
  }
}
