import Assignment from '../models/Assignment.js'

// Function to get assignments by profile ID
export const getAssignmentByProfileIdService = async (userId) => {
  return Assignment.findOne({ userId })
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
