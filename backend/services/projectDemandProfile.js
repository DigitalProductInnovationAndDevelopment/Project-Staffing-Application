import {
  addSkillsToProfileService,
  createNewSkillsService,
  updateSkillsService,
} from './skill.js'
import {
  createNewAssignmentService,
  deleteAssignmentService,
  getAssignmentByProfileIdService,
} from './assignment.js'
import Demand from '../models/Demand.js'
import Project from '../models/Project.js'
import ProjectDemandProfile from '../models/ProjectDemandProfile.js'
import Skill from '../models/Skill.js'
import { getProjectByProjectIdService } from './project.js'

// Service to get all profile IDs by project ID
export const getAllProfileIdsByProjectIdService = async (projectId) => {
  try {
    const project = await getProjectByProjectIdService(projectId)
    if (!project) {
      throw new Error('Project not found')
    }
    const profileIds = project.demandProfiles
    if (!profileIds) {
      throw new Error('Profile IDs not found')
    }

    return profileIds
  } catch (err) {
    throw new Error(`Failed to get profile IDs by project ID: ${err.message}`)
  }
}

// Service to get all profile information by profile Ids
export const getInformationForProfilesService = async (profileIds) => {
  try {
    const profiles = await Promise.all(
      profileIds.map(async (profileId) => {
        const profile = await getProfileByIdService(profileId)
        return profile
      })
    )

    return profiles
  } catch (err) {
    throw new Error(`Failed to get profile information: ${err.message}`)
  }
}

// Service to get all profiles
export const getAllProfilesService = async () => {
  try {
    // populate the target demand (only now) and target skills
    // transform the target skills to only include the skill points, skill category and max points (later ones if given)
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
    if (!profiles) {
      throw new Error('Profiles not found')
    }

    return profiles
  } catch (err) {
    throw new Error(`Failed to get all profiles: ${err.message}`)
  }
}

// Service to get all profiles by ID
export const getProfileByIdService = async (profileId) => {
  try {
    // populate the target demand (only now) and target skills
    // transform the target skills to only include the skill points, skill category and max points (later ones if given)
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
    if (!profile) {
      throw new Error('Profile not found')
    }

    return profile
  } catch (err) {
    throw new Error(`Failed to get profile by ID: ${err.message}`)
  }
}

// Service to create new profiles (multiple)
export const createNewProfilesService = async (projectId, profilesData) => {
  try {
    const profiles = []

    for (const p of profilesData) {
      const profile = await createNewProfileService(p)
      await addProfileIdToProjectService(projectId, profile._id)
      await createNewAssignmentService(profile._id)

      // create new skills and add them to the profile
      const newSkill = await createNewSkillsService(
        p.targetSkills ? p.targetSkills : []
      )
      const newSkillIds = newSkill.map((skill) => skill._id)
      const profileWithSkills = await addSkillsToProfileService(
        profile._id,
        newSkillIds
      )
      profiles.push(profileWithSkills)
    }
    return profiles
  } catch (err) {
    throw new Error(`Failed to create new profiles: ${err.message}`)
  }
}

// Service to create new profile
export const createNewProfileService = async (profileData) => {
  try {
    // create a target demand object
    const newTargetDemand = new Demand(profileData.targetDemandId)
    await newTargetDemand.save()
    const newTargetDemandId = newTargetDemand._id

    // create a new profile
    const newProfile = new ProjectDemandProfile({
      name: profileData.name,
      targetDemandId: newTargetDemandId,
    })
    if (!newProfile) {
      throw new Error('Failed to create a new profile')
    }
    await newProfile.save()

    return newProfile
  } catch (err) {
    throw new Error(`Failed to create a new profile: ${err.message}`)
  }
}

// Service to update profile
export const updateProfileService = async (profileId, updateData) => {
  try {
    // Find the existing profile
    const existingProfile = await getProfileByIdService(profileId)

    // Update the Demand object if targetDemandId is part of the update and now is defined
    if (
      updateData.targetDemandId &&
      updateData.targetDemandId.now !== undefined
    ) {
      const demand = await Demand.findByIdAndUpdate(
        existingProfile.targetDemandId,
        {
          now: updateData.targetDemandId.now,
        },
        { new: true }
      )
      if (!demand) {
        throw new Error('Demand not found')
      }
    }

    // Update the Skills objects if targetSkills is part of the update
    if (updateData.targetSkills) {
      await updateSkillsService(
        updateData.targetSkills,
        existingProfile.targetSkills
      )
    }

    // Remove targetDemandId from updatedData as it is already updated
    // Remove targetSkills from updatedData as it is already updated
    delete updateData.targetDemandId
    delete updateData.targetSkills

    // Update the profile with the remaining data
    const updatedProfile = await ProjectDemandProfile.findByIdAndUpdate(
      profileId,
      updateData,
      { new: true }
    )
    if (!updatedProfile) {
      throw new Error('Profile not found')
    }

    return updatedProfile
  } catch (err) {
    throw new Error(`Failed to update the profile: ${err.message}`)
  }
}

// Service to delete profile
export const deleteProfileService = async (profileId, projectId) => {
  try {
    // get the target demand and skills
    const profile = await ProjectDemandProfile.findById(profileId)
    const targetDemandId = profile.targetDemandId
    const targetSkillsIds = profile.targetSkills

    // delete the profile
    const deletedProfile =
      await ProjectDemandProfile.findByIdAndDelete(profileId)
    if (!deletedProfile) {
      throw new Error('Profile not found')
    }

    // delete the target demand
    const demand = await Demand.findByIdAndDelete(targetDemandId._id)
    if (!demand) {
      throw new Error('Demand not found')
    }

    // delete the target skills
    await Promise.all(
      targetSkillsIds.map(async (skillId) => {
        const skill = await Skill.findByIdAndDelete(skillId)
        if (!skill) {
          throw new Error('Skill not found')
        }
      })
    )

    // remove the profile ID from the project
    await removeProfileIdFromProjectService(projectId, profileId)

    // delete the assignment
    const assignment = await getAssignmentByProfileIdService(profileId)
    await deleteAssignmentService(assignment._id)

    return deletedProfile
  } catch (err) {
    throw new Error(`Failed to delete the profile: ${err.message}`)
  }
}

// Service to add profile ID to project
export const addProfileIdToProjectService = async (projectId, profileId) => {
  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $push: { demandProfiles: profileId } },
      { new: true, useFindAndModify: false }
    )
    if (!project) {
      throw new Error('Project not found')
    }

    return project
  } catch (err) {
    throw new Error(`Failed to add profile ID to project: ${err.message}`)
  }
}

// Service to remove profile ID from project
export const removeProfileIdFromProjectService = async (
  projectId,
  profileId
) => {
  try {
    // find the project
    const project = await Project.findById(projectId)
    if (!project) {
      throw new Error('Project not found')
    }

    // remove the profile ID from the project
    project.demandProfiles = project.demandProfiles.filter(
      (dP) => dP._id.toString() !== profileId
    )

    await project.save()

    return project
  } catch (err) {
    throw new Error(`Failed to remove profile ID from project: ${err.message}`)
  }
}

// Service to get demand by profile IDs
export const getDemandByProfileIdsService = async (profileIds) => {
  try {
    // default demand is 0
    let demand = 0

    // get the demand for each profile and sum them up
    for (const profileId of profileIds) {
      const profile = await getProfileByIdService(profileId)
      const d = await Demand.findById(profile.targetDemandId)
      demand += d.now
    }

    return demand
  } catch (err) {
    throw new Error(`Failed to get demands by profile IDs: ${err.message}`)
  }
}
