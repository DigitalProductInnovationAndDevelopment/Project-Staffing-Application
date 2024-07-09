import Assignment from '../models/Assignment.js'
import { getUserByUserIdService } from './user.js'

// Function to get assignments by profile ID
export const getAssignmentByProfileIdService = async (profileId) => {
  return Assignment.findOne({projectDemandProfileId: profileId})
}

export const getAllEmployeesByProfileIdsService = async (profileIds) => {
  const assignmentIds = []
  for (let i = 0; i < profileIds.length; i++) {
    assignmentIds.push(await getAssignmentByProfileIdService(profileIds[i]))
  }
  console.log(assignmentIds)
  //get people from assignment
  const allEmployeesIds = []
  for (let i = 0; i < assignmentIds.length; i++) {
    allEmployeesIds.push(assignmentIds[i].userId)
  }
  console.log(allEmployeesIds)
  // tranform ids to objects or there like
  const allEmployees = []
  for (let i = 0; i < allEmployeesIds.length; i++) {
    allEmployees.push(await getUserByUserIdService(allEmployeesIds[i]))
  }
  console.log(allEmployees)
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
    const newAssignment = new Assignment({ userId: assignmentData })
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
