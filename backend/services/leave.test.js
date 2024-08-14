import Leave from '../models/Leave.js'
import { updateLeaveService } from '../services/leave.js'

describe('updateLeaveService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should update a leave by leave ID and return the updated leave', async () => {
    const leaveId = 'leaveId123'
    const updateData = {
      startDate: '2022-01-01',
      endDate: '2022-01-05',
    }

    const updatedLeave = {
      _id: leaveId,
      startDate: updateData.startDate,
      endDate: updateData.endDate,
    }

    Leave.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedLeave)

    const result = await updateLeaveService(leaveId, updateData)

    expect(result).toEqual(updatedLeave)
    expect(Leave.findByIdAndUpdate).toHaveBeenCalledWith(leaveId, updateData, {
      new: true,
    })
  })

  it('should throw an error if leave is not found', async () => {
    const leaveId = 'leaveId123'
    const updateData = {
      startDate: '2022-01-01',
      endDate: '2022-01-05',
    }

    Leave.findByIdAndUpdate = jest.fn().mockResolvedValue(null)

    await expect(updateLeaveService(leaveId, updateData)).rejects.toThrowError(
      'Leave not found'
    )
  })

  it('should throw an error if failed to update leave', async () => {
    const leaveId = 'leaveId123'
    const updateData = {
      startDate: '2022-01-01',
      endDate: '2022-01-05',
    }

    Leave.findByIdAndUpdate = jest
      .fn()
      .mockRejectedValue(new Error('Some error'))

    await expect(updateLeaveService(leaveId, updateData)).rejects.toThrowError(
      `Failed to update leave: Some error`
    )
  })
})
