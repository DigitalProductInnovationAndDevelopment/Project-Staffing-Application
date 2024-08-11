import Leave from '../models/Leave.js'

// Function to update a leave by leave ID and patch data
export const updateLeaveService = async (leaveId, updateData) => {
  try {
    const leave = await Leave.findByIdAndUpdate(leaveId, updateData, {
      new: true,
    })
    if (!leave) {
      throw new Error('Leave not found')
    }

    return leave
  } catch (err) {
    throw new Error(`Failed to update leave: ${err.message}`)
  }
}
