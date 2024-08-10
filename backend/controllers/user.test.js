import {
  createNewUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from '../controllers/user.js'
import SkillCategory from '../models/SkillCategory.js'
import * as user from '../services/user.js'

describe('User Controller Tests', () => {
  // Test createNewUserController
  describe('createNewUserController', () => {
    it('should return 201 with success message and user data if user is created successfully', async () => {
      const req = {
        body: {
          // Provide user data here
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.com',
          password: 'password',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock createNewUserService to return a new user
      user.createNewUserService = jest
        .fn()
        .mockResolvedValue({
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.com',
        })

      await createNewUserController(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: 'User created successfully.',
        data: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.com',
        },
      })
    })

    it('should return 500 with error message if user could not be created by createNewUserService ', async () => {
      const req = {
        body: {
          // Provide user data here
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.com',
          password: 'password',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock createNewUserService to return null
      user.createNewUserService = jest.fn().mockResolvedValue(null)

      await createNewUserController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'User could not be created.',
      })
    })

    it('should return 500 with error message if an error occurs', async () => {
      const req = {
        body: {
          // Provide user data here
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.com',
          password: 'password',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock createNewUserService to throw an error
      user.createNewUserService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await createNewUserController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to create new user.',
        error: 'Some error.',
      })
    })
  })

  // Test getAllUsersController
  describe('getAllUsersController', () => {
    it('should return 200 with all users', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock getAllUsersService to return all users
      user.getAllUsersService = jest.fn().mockResolvedValue([
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@doe.com' },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@smith.com',
        },
      ])

      await getAllUsersController({}, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@doe.com' },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@smith.com',
        },
      ])
    })

    it('should return 404 if no users are found', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock getAllUsersService to return null
      user.getAllUsersService = jest.fn().mockResolvedValue(null)

      await getAllUsersController({}, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Users not found.' })
    })

    it('should return 500 with error message if an error occurs', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      user.getAllUsersService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await getAllUsersController({}, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to get all users.',
        error: 'Some error.',
      })
    })
  })

  // Test getUserByIdController
  describe('getUserByIdController', () => {
    it('should return 200 with user data if user is found', async () => {
      const req = {
        params: {
          userId: 1,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock getUserByUserIdService to return a user
      user.getUserByUserIdService = jest
        .fn()
        .mockResolvedValue({
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.com',
        })

      await getUserByIdController(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
      })
    })

    it('should return 404 if user is not found', async () => {
      const req = {
        params: {
          userId: 1,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock getUserByUserIdService to return null
      user.getUserByUserIdService = jest.fn().mockResolvedValue(null)

      await getUserByIdController(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found.' })
    })

    it('should return 500 with error message if an error occurs', async () => {
      const req = {
        params: {
          userId: 1,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock getUserByUserIdService to throw an error
      user.getUserByUserIdService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await getUserByIdController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to get user by ID.',
        error: 'Some error.',
      })
    })
  })

  // Test updateUserController
  describe('updateUserController', () => {
    it('should return 200 with success message and updated user data if user is updated successfully', async () => {
      const req = {
        params: {
          userId: 1,
        },
        body: {
          // Provide update data here
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.com',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock updateUserService to return updated user
      user.updateUserService = jest
        .fn()
        .mockResolvedValue({
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.com',
        })

      await updateUserController(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'User updated successfully.',
        data: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.com',
        },
      })
    })

    it('should return 404 if updateUserService returns "User not found" error', async () => {
      const req = {
        params: {
          userId: 1,
        },
        body: {
          // Provide update data here
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.com',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock updateUserService to throw "User not found." error
      user.updateUserService = jest
        .fn()
        .mockRejectedValue(new Error('User not found.'))

      await updateUserController(req, res)

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found.',
        error: 'User not found.',
      })
    })

    it('should return 400 if updateUserService returns "Invalid target skill points. Target..." error', async () => {
      const req = {
        params: {
          userId: 1,
        },
        body: {
          // Provide update data here
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.com',
          skills: [
            {
              id: 1,
              skillPoints: 5,
              SkillCategory: 'Frontend',
            },
          ],
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock updateUserService to throw "Invalid target skill points." error
      user.updateUserService = jest
        .fn()
        .mockRejectedValue(
          new Error(
            'Invalid target skill points. Target skill points should be greater than or equal to skill points.'
          )
        )

      await updateUserController(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid target skill points.',
        error:
          'Invalid target skill points. Target skill points should be greater than or equal to skill points.',
      })
    })

    it('should return 500 with error message if an error occurs', async () => {
      const req = {
        params: {
          userId: 1,
        },
        body: {
          // Provide update data here
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.com',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock updateUserService to throw an error
      user.updateUserService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await updateUserController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to update user.',
        error: 'Some error.',
      })
    })
  })

  // Test deleteUserController
  describe('deleteUserController', () => {
    it('should return 200 with success message and deleted user data if user is deleted successfully', async () => {
      const req = {
        params: {
          userId: 1,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock deleteUserService to return deleted user
      user.deleteUserService = jest
        .fn()
        .mockResolvedValue({
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.com',
        })

      await deleteUserController(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'User deleted successfully.',
        data: {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.com',
        },
      })
    })

    it('should return 500 with error message if an error occurs', async () => {
      const req = {
        params: {
          userId: 1,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock deleteUserService to throw an error
      user.deleteUserService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await deleteUserController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to delete user.',
        error: 'Some error.',
      })
    })
  })
})
