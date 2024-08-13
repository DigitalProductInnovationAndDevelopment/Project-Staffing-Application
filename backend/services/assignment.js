import {
  getAllProfileIdsByProjectIdService,
  getProfileByIdService,
} from './projectDemandProfile.js'
import { getAllUsersService, getUserByUserIdService } from './user.js'
import Assignment from '../models/Assignment.js'
import { removeDuplicateObjectIDs } from '../utils/helper.js'

// Function to get assignments by profile ID
export const getAssignmentByProfileIdService = async (profileId) => {
  const assignment = await Assignment.findOne({
    projectDemandProfileId: profileId,
  })
  if (!assignment) {
    throw new Error('Assignment by ProfileId not found')
  }
  return assignment
}

// Function to get all employees for given profile IDs (array)
export const getAllEmployeesByProfileIdsService = async (profileIds) => {
  try {
    const assignmentIds = []
    const allEmployeesIds = []
    const allEmployees = []

    //get assignments by profile ids
    for (let i = 0; i < profileIds.length; i++) {
      const assignment = await getAssignmentByProfileIdService(profileIds[i])
      assignmentIds.push(assignment)
    }

    //get userIds from assignment as single elements and push them to allEmployeesIds
    for (let i = 0; i < assignmentIds.length; i++) {
      allEmployeesIds.push(...assignmentIds[i].userId)
    }

    //no duplicates in allEmployeesIds -> for avatars maybe necessary
    // const uniqueAllEmployeesIds = removeDuplicateObjectIDs(allEmployeesIds)
    const uniqueAllEmployeesIds = allEmployeesIds

    //get user data by userIds
    for (let i = 0; i < uniqueAllEmployeesIds.length; i++) {
      const user = await getUserByUserIdService(uniqueAllEmployeesIds[i])
      allEmployees.push(user)
    }

    if (!allEmployees) {
      throw new Error('Employees not found')
    }

    return allEmployees
  } catch (err) {
    throw new Error(
      `Failed to get all employees by profile IDs: ${err.message}`
    )
  }
}

// Function to update an assignment by assignment ID and patch data
export const updateAssignmentService = async (assignmentId, updatedData) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      updatedData,
      { new: true }
    )
    if (!assignment) {
      throw new Error('Assignment could not be updated')
    }

    return assignment
  } catch (err) {
    throw new Error(`Failed to update assignment: ${err.message}`)
  }
}

// Function to create a new assignment
export const createNewAssignmentService = async (assignmentData) => {
  try {
    const newAssignment = new Assignment({
      projectDemandProfileId: assignmentData,
    })
    if (!newAssignment) {
      throw new Error('New assignment could not be created')
    }
    await newAssignment.save()

    return newAssignment
  } catch (err) {
    throw new Error(`Failed to create new assignment: ${err.message}`)
  }
}

// Function to delete an assignment by assignment ID
export const deleteAssignmentService = async (assignmentId) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(assignmentId)
    if (!assignment) {
      throw new Error('Assignment not found')
    }

    return assignment
  } catch (err) {
    throw new Error(`Failed to delete assignment: ${err.message}`)
  }
}

export const getProfilesWithAssignedEmployeesAndSuitableEmployeesService =
  async (projectId) => {
    try {
      let payload = []

      // get all profile ids by project id
      const profileIds = await getAllProfileIdsByProjectIdService(projectId)

      // for each profile, get the profile data, assigned employees data, and suitable employees data
      for (const profileId of profileIds) {
        // get profile data
        const profile = await getProfileByIdService(profileId)
        const assignment = await getAssignmentByProfileIdService(profileId)

        // get assigned employees data
        const assignedEmployees = assignment.userId
        const assignedEmployeesData = await Promise.all(
          assignedEmployees.map(async (userId) => {
            const user = await getUserByUserIdService(userId)
            return user
          })
        )

        // get suitable employees data
        const suitableEmployees = await getAllUsersService()

        // filter out assigned employees from suitable employees
        const suitableEmployeesFilteredByAssigned = suitableEmployees.filter(
          (user) => !assignedEmployees.includes(user._id)
        )

        // SORT SUITABLE EMPLOYEES (<=> augmented matching)
        // 1st sorting criteria: highest color score
        // 2nd sorting criteria (tiebreaker): highest total numerical score
        // 3rd sorting criteria (tiebreaker): highest number of skillCategories in which employee wants to improve

        // sort suitable employees according to 3 sorting criteria
        const suitableEmployeesSorted =
          suitableEmployeesFilteredByAssigned.sort((a, b) => {
            const scoreA = calculateSkillDifferenceScore(a, profile)
            const scoreB = calculateSkillDifferenceScore(b, profile)

            // (1st sorting criteria) sort by highest color score
            if (scoreA.colorScore !== scoreB.colorScore) {
              return scoreB.colorScore - scoreA.colorScore
            }
            
            // (2nd sorting criteria) If color scores are tied, use the numerical difference
            if (scoreA.numericalScore !== scoreB.numericalScore) {
              return scoreB.numericalScore - scoreA.numericalScore
            }

            // (3rd sorting criteria) If numericalScore is also tied, use the number of skill categories to improve
            return scoreB.skillCategoriesToImprove - scoreA.skillCategoriesToImprove
          })

        function calculateSkillDifferenceScore(user, profile) {
          let colorScore = 0
          let numericalScore = 0
          let skillCategoriesToImprove = 0

          // for each target skill in the profile, calculate the difference between the user's skill points and the target skill points
          for (const targetSkill of profile.targetSkills) {
            
            // find the user's skill that matches the target skill category
            const userSkill = user.skills.find(
              (skill) => skill.skillCategory === targetSkill.skillCategory
            )

            // if the user has the skill, calculate the difference
            if (userSkill) {
              const color = userSkill.skillPoints / targetSkill.skillPoints
              if (color < 0.6) {
                colorScore -= 1
              } else if (color >= 0.6 && color < 1) {
                colorScore += 1
              } else {
                colorScore += 2
              }

              // calculate numerical difference for tiebreaker
              const difference = userSkill.skillPoints - targetSkill.skillPoints
              numericalScore += difference
            } else {
              // if the user doesn't have the skill, consider it as a negative difference
              colorScore -= 1
              numericalScore -= targetSkill.skillPoints
            }

            const userTargetSkill = user.targetSkills.find(
              (skill) => skill.skillCategory === targetSkill.skillCategory
            )

            if (userTargetSkill && userSkill) {

              if (userTargetSkill.skillPoints > userSkill.skillPoints) {
                skillCategoriesToImprove += 1
              }

            }

          }

          return { colorScore, numericalScore, skillCategoriesToImprove }
        }

        // push profile data, assigned employees data, and suitable employees data to the iteratively constructed payload
        payload.push({
          profile: profile,
          assignedEmployees: assignedEmployeesData,
          suitableEmployees: suitableEmployeesSorted,
        })
      }

      return payload
    } catch (error) {
      console.error('Error in getProfilesWithAssignedEmployeesAndSuitableEmployeesService:', error)
      throw error
    }
  }

// Function to update assignments for all profiles
export const updateAssignmentsService = async (profiles) => {
  try {
    // check if profiles is an array or an object
    const profilesArray = Array.isArray(profiles)
      ? profiles
      : Object.values(profiles)

    // update assignments for all profiles
    const updatePromises = profilesArray.map(async (profile) => {
      const { profileId, assignedEmployees } = profile

      // get the assignment by profile ID
      const assignment = await getAssignmentByProfileIdService(profileId)

      // update the assignment with the new assigned employees
      const updatedAssignment = await updateAssignmentService(assignment._id, {
        userId: assignedEmployees,
      })

      return { profileId, data: updatedAssignment }
    })

    // wait for all updates to complete
    const updatedAssignments = await Promise.all(updatePromises)

    return updatedAssignments
  } catch (err) {
    throw new Error(`Failed to update assignments: ${err.message}`)
  }
}
