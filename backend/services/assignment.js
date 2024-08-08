import Assignment from '../models/Assignment.js'
import { removeDuplicateObjectIDs } from '../utils/helper.js'
import { getUserByUserIdService, getAllUsersService } from './user.js'
import {
  getAllProfileIdsByProjectIdService,
  getProfileByIdService,
} from './projectDemandProfile.js'

// Function to get assignments by profile ID
export const getAssignmentByProfileIdService = async (profileId) => {
  return Assignment.findOne({ projectDemandProfileId: profileId }) //TODO
}

export const getAllEmployeesByProfileIdsService = async (profileIds) => {
  const assignmentIds = []
  for (let i = 0; i < profileIds.length; i++) {
    const assignment = await getAssignmentByProfileIdService(profileIds[i])
    if (!assignment) {
      throw new Error('Assignment not found')
    }
    assignmentIds.push(assignment)
  }
  //get people from assignment
  const allEmployeesIds = []
  for (let i = 0; i < assignmentIds.length; i++) {
    allEmployeesIds.push(...assignmentIds[i].userId) //TODO
  }
  // tranform ids to objects or there like

  //no duplicates in allemployeeids
  const uniqueAllEmployeesIds = await removeDuplicateObjectIDs(allEmployeesIds) //TODO

  const allEmployees = []
  for (let i = 0; i < uniqueAllEmployeesIds.length; i++) {
    const user = await getUserByUserIdService(uniqueAllEmployeesIds[i])
    if (!user) {
      throw new Error('User not found')
    }
    allEmployees.push(user)
  }

  return allEmployees
}

// Function to update an assignment service
export const updateAssignmentService = async (assignmentId, updatedData) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      updatedData,
      { new: true }
    )
    if (!assignment) {
      throw new Error('Assignment not found')
    }
    return assignment
  } catch (error) {
    throw new Error(`Failed to update assignment: ${error.message}`)
  }
}

//TODO profile id
export const createNewAssignmentService = async (assignmentData) => {
  try {
    const newAssignment = new Assignment({
      projectDemandProfileId: assignmentData,
    })
    await newAssignment.save()
    return newAssignment
  } catch (error) {
    throw new Error(`Failed to create new assignment: ${error.message}`)
  }
}

export const deleteAssignmentService = async (assignmentId) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(assignmentId)
    if (!assignment) {
      throw new Error('Assignment not found')
    }
  } catch (error) {
    throw new Error(`Failed to delete assignment: ${error.message}`)
  }
}

export const getProfilesWithAssignedEmployeesAndSuitableEmployeesService =
  async (projectId) => {
    try {
      let payload = []

      const profileIds = await getAllProfileIdsByProjectIdService(projectId)
      if (!profileIds) {
        throw new Error('Profile ids not found')
      }

      for (const profileId of profileIds) {
        const profile = await getProfileByIdService(profileId) //TODO
        const assignment = await getAssignmentByProfileIdService(profileId)
        if (!assignment) {
          throw new Error('Assignment not found')
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
        const suitableEmployeesSorted =
          suitableEmployeesFilteredByAssigned.sort((a, b) => {
            const scoreA = calculateSkillDifferenceScore(a, profile)
            const scoreB = calculateSkillDifferenceScore(b, profile)
            return scoreB - scoreA // sort in descending order (highest difference first)
          })

        function calculateSkillDifferenceScore(user, profile) {
          let totalDifference = 0

          // for each target skill in the profile, calculate the difference between the user's skill points and the target skill points
          for (const targetSkill of profile.targetSkills) {
            // find the user's skill that matches the target skill category
            const userSkill = user.skills.find(
              (skill) => skill.skillCategory === targetSkill.skillCategory
            )

            if (userSkill) {
              const difference = userSkill.skillPoints - targetSkill.skillPoints
              totalDifference += difference
            } else {
              // if the user doesn't have the skill, consider it as a negative difference
              totalDifference -= targetSkill.skillPoints
            }
          }
          return totalDifference
        }

        // // debug log: before sorting
        // console.log("Suitable employees before sorting:", suitableEmployeesFilteredByAssigned.map(user => ({
        //   name: user.firstName + ' ' + user.lastName,
        //   skills: user.skills
        // })));

        // debug log: after sorting
        // console.log(
        //   'Suitable employees after sorting:',
        //   suitableEmployeesSorted.map((user) => ({
        //     name: user.firstName + ' ' + user.lastName,
        //     score: calculateSkillDifferenceScore(user, profile),
        //   }))
        // )

        payload.push({
          profile: profile,
          assignedEmployees: assignedEmployeesData,
          suitableEmployees: suitableEmployeesSorted,
        })
      }
      return payload
    } catch (error) {
      throw new Error(
        `Failed to get profiles with assigned and suitable employees: ${error.message}`
      )
    }
  }

export const updateAssignmentsService = async (profiles) => {
  try {
    const profilesArray = Array.isArray(profiles)
      ? profiles
      : Object.values(profiles)

    const updatePromises = profilesArray.map(async (profile) => {
      const { profileId, assignedEmployees } = profile
      const assignment = await getAssignmentByProfileIdService(profileId)
      if (!assignment) {
        throw new Error('Assignment not found')
      }
      const updatedAssignment = await updateAssignmentService(assignment._id, {
        userId: assignedEmployees,
      })
      return { profileId, data: updatedAssignment }
    })

    const updatedAssignments = await Promise.all(updatePromises)
    return updatedAssignments
  } catch (error) {
    throw new Error(`Failed to update assignments: ${error.message}`)
  }
}
