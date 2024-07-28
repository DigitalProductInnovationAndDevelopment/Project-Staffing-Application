import {
  getAllProfileIdsByProjectIdService,
  getProfileByIdService,
  createNewProfileService,
  updateProfileService,
  deleteProfileService,
  addProfileIdToProjectService,
  removeProfileIdFromProjectService,
} from '../services/projectDemandProfile.js'
import { getProjectByIdController } from './project.js'
import {
  createNewAssignmentService,
  deleteAssignmentService,
  getAssignmentByProfileIdService,
  updateAssignmentService,
} from '../services/assignment.js'
import {
  deleteSkillsService,
  updateSkillsService,
  createNewSkillsService,
  addSkillsToProfileService,
} from '../services/skill.js'
import { getAllUsersService, getUserByUserIdService } from '../services/user.js'

export const getAllProfilesByProjectIdController = async (req, res, next) => {
  try {
    const allProfileIds = await getAllProfileIdsByProjectIdService(
      req.params.projectId
    )
    if (!allProfileIds) {
      return res.status(404).json({ message: 'Profile ids not found' })
    } else if (allProfileIds.length === 0) {
      return res
        .status(200)
        .json({ message: 'No profiles found for this project' })
    } //status code ???
    const allProfiles = await Promise.all(
      allProfileIds.map(async (profileId) => {
        const profile = await getProfileByIdService(profileId)
        return profile
      })
    )
    if (allProfiles.length !== allProfileIds.length) {
      return res
        .status(500)
        .json({ message: 'Failed to retrieve all profiles' })
    }
    res.status(200).json({ profiles: allProfiles })
  } catch (err) {
    res.status(500).json({
      message: 'Failed to get all profiles by project id',
      error: err.message,
    })
  }
}

export const getProfileByIdController = async (req, res) => {
  try {
    const { projectId, profileId } = req.params
    const profile = await getProfileByIdService(profileId)
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
    }
    res.status(200).json(profile)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to get profile by id', error: err.message })
  }
}

export const createNewProfilesController = async (req, res, next) => {
  try {
    const { projectId } = req.params
    const data = req.body

    const profiles = []

    for (const p of data) {
      // console.log(p)
      const profile = await createNewProfileService(p)
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' }) //TODO
      }
      addProfileIdToProjectService(projectId, profile._id) //TODO
      createNewAssignmentService(profile._id) //TODO
      try {
        const newSkill = await createNewSkillsService(
          p.targetSkills ? p.targetSkills : []
        )
        const newSkillIds = newSkill.map((skill) => skill._id)
        // console.log(newSkillIds)
        const profileWithSkills = await addSkillsToProfileService(
          profile._id,
          newSkillIds
        )
        // return res.status(201).json({
        //   message: 'User created successfully',
        //   profile: profileWithSkills,
        // })
        // console.log(profileWithSkills)
        profiles.push(profileWithSkills)
      } catch (error) {
        deleteProfileService(profile._id) // TODO: delete all profiles
        return res.status(500).json({
          message: error.message + ' skill could not be created',
        })
      }
    }

    return res.status(201).json({
      message: 'Profiles created successfully',
      profiles: profiles,
    })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to create new profiles', error: err.message })
  }
}

export const updateProfileController = async (req, res, next) => {
  try {
    const { projectId, profileId } = req.params
    const profile = await getProfileByIdService(profileId)
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' })
    }
    let updateData = req.body
    if (updateData.targetSkills) {
      await updateSkillsService(updateData.targetSkills, profile.targetSkills) //TODO
    }

    const { targetSkills, ...rest } = updateData

    const updatedProfile = await updateProfileService(profile._id, rest)
    res
      .status(200)
      .json({ message: 'Profile updated successfully', data: updatedProfile })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to update profile', error: err.message })
  }
}

export const deleteProfileController = async (req, res, next) => {
  try {
    const { projectId, profileId } = req.params
    const profile = await getProfileByIdService(profileId)
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' })
    }

    const deletedProfile = await deleteProfileService(profileId, projectId)
    res
      .status(200)
      .json({ message: 'Profile deleted successfully', data: deletedProfile })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to delete profile', error: err.message })
  }
}

export const getAssignmentsByProjectIdController = async (req, res, next) => {
  try {
    const { projectId } = req.params

    let payload = []

    const profileIds = await getAllProfileIdsByProjectIdService(projectId)
    if (!profileIds) {
      return res.status(404).json({ message: 'Profile ids not found' })
    }

    for (const profileId of profileIds) {
      const profile = await getProfileByIdService(profileId) //TODO
      const assignment = await getAssignmentByProfileIdService(profileId)
      if (!assignment) {
        return res.status(404).json({ message: 'Assignment not found' })
      }
      const assignedEmployees = assignment.userId
      const assignedEmployeesData = await Promise.all(
        assignedEmployees.map(async (userId) => {
          const user = await getUserByUserIdService(userId) //TODO
          return user
        })
      )
      const suitableEmployees = await getAllUsersService()
      const suitableEmployeesFilteredByAssigned = suitableEmployees.filter(
        (user) => !assignedEmployees.includes(user._id)
      )

      // SORT SUITABLE EMPLOYEES (<=> augmented matching)
      // 1st in the list = employee with lowest total difference between their currentSkillPoints and the targetSkillPoints of the profile
      
      // sort suitable employees by total difference between their skillPoints and the profile target skillPoints
      const suitableEmployeesSorted = suitableEmployeesFilteredByAssigned.sort((a, b) => {
        const scoreA = calculateSkillDifferenceScore(a, profile);
        const scoreB = calculateSkillDifferenceScore(b, profile);
        return scoreB - scoreA; // sort in descending order (highest difference first)
      });

      function calculateSkillDifferenceScore(user, profile) {
        let totalDifference = 0;
        
        // for each target skill in the profile, calculate the difference between the user's skill points and the target skill points
        for (const targetSkill of profile.targetSkills) {
    
          // find the user's skill that matches the target skill category
          const userSkill = user.skills.find(skill => skill.skillCategory === targetSkill.skillCategory);

          if (userSkill) {
            const difference = userSkill.skillPoints - targetSkill.skillPoints;
            totalDifference += difference;
          } else {
            // if the user doesn't have the skill, consider it as a negative difference
            totalDifference -= targetSkill.skillPoints;
          }
        }
        return totalDifference;
      }

      // console.log("profile:", profile.name);

      // // debug log: before sorting
      // console.log("Suitable employees before sorting:", suitableEmployeesFilteredByAssigned.map(user => ({
      //   name: user.firstName + ' ' + user.lastName,
      //   skills: user.skills
      // })));

      // debug log: after sorting
      console.log("Suitable employees after sorting:", suitableEmployeesSorted.map(user => ({
        name: user.firstName + ' ' + user.lastName,
        score: calculateSkillDifferenceScore(user, profile)
      })));

      payload.push({
        profile: profile,
        assignedEmployees: assignedEmployeesData,
        suitableEmployees: suitableEmployeesSorted,
      })
    }

    res.status(200).json({
      message: 'Assignment by profile id successfully retrieved',
      data: payload,
    })
  } catch (err) {
    res.status(500).json({
      message: 'Failed to get project assignment by profile id',
      error: err.message,
      stack: err.stack,
    })
  }
}

export const updateAssignmentController = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const profiles = req.body;

    const profilesArray = Array.isArray(profiles) ? profiles : Object.values(profiles);

    const updatePromises = profilesArray.map(async (profile) => {
      const { profileId, assignedEmployees } = profile;

      const assignment = await getAssignmentByProfileIdService(profileId);
      if (!assignment) {
        return { profileId, status: 'not_found' }; //TODO
      }

      const updatedAssignment = await updateAssignmentService(assignment._id, {
        userId: assignedEmployees,
      });

      return { profileId, status: 'success', data: updatedAssignment }; //TODO
    });

    const updateResults = await Promise.all(updatePromises);

    res.status(200).json({
      message: 'Assignments successfully updated',
      data: updateResults,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Failed to update assignments by profile',
      error: err.message,
    });
  }
}
