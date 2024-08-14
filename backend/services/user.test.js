import { getUserByUserIdService } from '../services/user.js'
import User from '../models/User.js'
import * as userService from '../services/user.js'
const mockingoose = require('mockingoose')

jest.mock('../models/User.js')
jest.mock('../models/Contract.js')
jest.mock('../models/Leave.js')
jest.mock('../models/ProjectWorkingHours.js')

describe('User Service Tests', () => {
  afterEach(() => {
    jest.clearAllMocks()
    mockingoose.resetAll()
  })

  describe('UserService', () => {
    describe('getUserByUserIdService', () => {
      it('should throw an error if user is not found', async () => {
        const userId = 'userId1'
        mockingoose(User).toReturn(userId, 'findOne')
        await expect(getUserByUserIdService(userId)).rejects.toThrowError()
      })
    })

    describe('updateUserService', () => {
      it('should throw an error if the user is not found', async () => {
        const userId = 'user1'
        const updateData = {}
        mockingoose(User).toReturn(null, 'findOne')
        await expect(
          userService.updateUserService(userId, updateData)
        ).rejects.toThrow()
      })
      it('should throw an error if there is a database error', async () => {
        const userId = 'user1'
        const updateData = {}
        const errorMessage = 'Database error'
        mockingoose(User).toReturn(new Error(errorMessage), 'findOne')
        await expect(
          userService.updateUserService(userId, updateData)
        ).rejects.toThrow()
      })
    })

    describe('updateUserFieldsService', () => {
      it('should throw an error if the user fields could not be updated', async () => {
        const userId = 'user1'
        const updateData = { name: 'Updated Name' }
        const user = { _id: userId, name: 'Old Name' }
        mockingoose(User).toReturn(user, 'findOne')
        mockingoose(User).toReturn(
          new Error('Database error'),
          'findOneAndUpdate'
        )
        await expect(
          userService.updateUserFieldsService(userId, updateData)
        ).rejects.toThrow()
      })

      it('should throw an error if there is a database error', async () => {
        const userId = 'user1'
        const updateData = { name: 'Updated Name' }
        const errorMessage = 'Database error'
        mockingoose(User).toReturn(new Error(errorMessage), 'findOne')
        await expect(
          userService.updateUserFieldsService(userId, updateData)
        ).rejects.toThrow()
      })
    })

    describe('deleteUserService', () => {
      it('should throw an error if the user is not found', async () => {
        const userId = 'user1'
        mockingoose(User).toReturn(null, 'findOne')
        await expect(userService.deleteUserService(userId)).rejects.toThrow()
      })

      it('should throw an error if there is a database error', async () => {
        const userId = 'user1'
        const errorMessage = 'Database error'
        mockingoose(User).toReturn(new Error(errorMessage), 'findOne')
        await expect(userService.deleteUserService(userId)).rejects.toThrow()
      })
    })
  })
})
