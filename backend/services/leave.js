import Leave from '../models/Leave.js'

export const updateLeaveService = async (leaveId, updateData) => {
  try {
    const leave = await Leave.findByIdAndUpdate(leaveId, updateData, {
      new: true,
    })
    if (!leave) {
      throw new Error('Leave not found')
    }
    return leave
  } catch (error) {
    throw new Error(`Failed to update leave: ${error.message}`)
  }
}
