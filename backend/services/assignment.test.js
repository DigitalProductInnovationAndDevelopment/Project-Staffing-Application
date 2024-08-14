import Assignment from '../models/Assignment.js'
import * as assignmentService from '../services/assignment.js'
const mockingoose = require('mockingoose')
const mongoose = require('mongoose')

describe('Assignment Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockingoose.resetAll()
  })

  describe('getAssignmentByProfileIdService', () => {
    it('should return the assignment when found', async () => {
      const profileId = 'profileId'
      const expectedAssignment = { _id: 'assignmentId' }

      Assignment.findOne = jest.fn().mockResolvedValue(expectedAssignment)

      const result = await assignmentService.getAssignmentByProfileIdService(
        profileId
      )

      expect(result).toEqual(expectedAssignment)
      expect(Assignment.findOne).toHaveBeenCalledWith({
        projectDemandProfileId: profileId,
      })
    })

    it('should throw an error when assignment not found', async () => {
      const profileId = 'profileId'

      Assignment.findOne = jest.fn().mockResolvedValue(null)

      await expect(
        assignmentService.getAssignmentByProfileIdService(profileId)
      ).rejects.toThrow('Assignment by ProfileId not found')
      expect(Assignment.findOne).toHaveBeenCalledWith({
        projectDemandProfileId: profileId,
      })
    })
  })

  describe('getAllEmployeesByProfileIdsService', () => {
    it('should throw an error when employees not found', async () => {
      const profileIds = ['profileId1', 'profileId2']
      assignmentService.getAssignmentByProfileIdService = jest
        .fn()
        .mockResolvedValue(null)

      await expect(
        assignmentService.getAllEmployeesByProfileIdsService(profileIds)
      ).rejects.toThrow(
        'Failed to get all employees by profile IDs: Assignment by ProfileId not found'
      )
    })
  })

  describe('updateAssignmentService', () => {
    it('should update the assignment and return the updated assignment', async () => {
      const assignmentId = 'assignmentId'
      const updatedData = { field: 'value' }
      const updatedAssignment = { _id: assignmentId, ...updatedData }
      Assignment.findByIdAndUpdate = jest
        .fn()
        .mockResolvedValue(updatedAssignment)

      const result = await assignmentService.updateAssignmentService(
        assignmentId,
        updatedData
      )

      expect(result).toEqual(updatedAssignment)
      expect(Assignment.findByIdAndUpdate).toHaveBeenCalledWith(
        assignmentId,
        updatedData,
        { new: true }
      )
    })

    it('should throw an error when assignment could not be updated', async () => {
      const assignmentId = 'assignmentId'
      const updatedData = { field: 'value' }
      Assignment.findByIdAndUpdate = jest.fn().mockResolvedValue(null)

      await expect(
        assignmentService.updateAssignmentService(assignmentId, updatedData)
      ).rejects.toThrow('Assignment could not be updated')
      expect(Assignment.findByIdAndUpdate).toHaveBeenCalledWith(
        assignmentId,
        updatedData,
        { new: true }
      )
    })
  })

  describe('createNewAssignmentService', () => {
    it('should create a new assignment and return the created assignment', async () => {
      Assignment.schema.options.validateBeforeSave = false //only for this tests or else it will throw an error, id is passed from a mongooes model hence shoulod be valid
      const assignmentData = {
        projectDemandProfileId: 'profileId',
      }
      const newAssignment = { ...assignmentData }

      mockingoose(Assignment).toReturn(newAssignment, 'save')

      const result = await assignmentService.createNewAssignmentService(
        assignmentData
      )

      expect(result._id).not.toBeNull()
      Assignment.schema.options.validateBeforeSave = true //re-enable validation
    })

    it('should throw an error when new assignment could not be created (null)', async () => {
      Assignment.schema.options.validateBeforeSave = false
      const assignmentData = {
        projectDemandProfileId: 'profileId',
      }

      mockingoose(Assignment).toReturn(
        new Error('New assignment could not be created'),
        'save'
      )

      const result =
        assignmentService.createNewAssignmentService(assignmentData)

      await expect(result).rejects.toThrow(
        'New assignment could not be created'
      )
      Assignment.schema.options.validateBeforeSave = true
    })

    it('should throw an error when new assignment could not be created (Some error)', async () => {
      Assignment.schema.options.validateBeforeSave = false
      const assignmentData = { projectDemandProfileId: 'profileId' }

      mockingoose(Assignment).toReturn(new Error('Some error'), 'save')

      const result =
        assignmentService.createNewAssignmentService(assignmentData)

      await expect(result).rejects.toThrow('Some error')
      Assignment.schema.options.validateBeforeSave = true
    })
  })

  describe('deleteAssignmentService', () => {
    it('should delete the assignment and return the deleted assignment', async () => {
      const assignmentId = 'assignmentId'
      const deletedAssignment = { _id: assignmentId }
      Assignment.findByIdAndDelete = jest
        .fn()
        .mockResolvedValue(deletedAssignment)

      const result = await assignmentService.deleteAssignmentService(
        assignmentId
      )

      expect(result).toEqual(deletedAssignment)
      expect(Assignment.findByIdAndDelete).toHaveBeenCalledWith(assignmentId)
    })

    it('should throw an error when assignment not found', async () => {
      const assignmentId = 'assignmentId'
      Assignment.findByIdAndDelete = jest.fn().mockResolvedValue(null)

      await expect(
        assignmentService.deleteAssignmentService(assignmentId)
      ).rejects.toThrow('Assignment not found')
      expect(Assignment.findByIdAndDelete).toHaveBeenCalledWith(assignmentId)
    })
  })

  describe('updateAssignmentsService', () => {
    it('should throw an error when failed to update assignments', async () => {
      const profiles = [
        { profileId: 'profileId1', assignedEmployees: ['userId1', 'userId2'] },
        { profileId: 'profileId2', assignedEmployees: ['userId3', 'userId4'] },
      ]
      assignmentService.getAssignmentByProfileIdService = jest
        .fn()
        .mockResolvedValue(null)
      assignmentService.updateAssignmentService = jest
        .fn()
        .mockResolvedValue(null)

      const result = assignmentService.updateAssignmentsService(profiles)

      expect(result).rejects.toThrow('Failed to update assignments')
      expect(assignmentService.updateAssignmentService).not.toHaveBeenCalled()
    })
  })
})
