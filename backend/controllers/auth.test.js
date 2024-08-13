/* eslint-disable no-import-assign */
import * as auth from '../services/auth.js'
import { loginController, logoutController } from '../controllers/auth.js'
import jwt from 'jsonwebtoken'

describe('Auth Controller Tests', () => {
  // Test loginController
  describe('loginController', () => {
    it('should return 400 if user does not exist', async () => {
      const req = {
        body: {
          // Provide invalid user data here
          email: 'test@auth.com',
          password: '0000',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }
      auth.loginService = jest.fn().mockResolvedValue(null)

      await loginController(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: 'User does not exist.' })
    })

    it('should return 200 with token and user data if login is successful', async () => {
      const req = {
        body: {
          // Provide valid user data here
          email: 'test@auth.com',
          password: '0000',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn(),
      }

      auth.loginService = jest.fn().mockResolvedValue({
        _id: '123',
        firstName: 'Test',
        lastName: 'One',
        email: 'test@one.com',
        password: '0000',
      })
      jwt.sign = jest.fn().mockReturnValue('token')

      await loginController(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        token: expect.any(String),
        user: expect.any(Object),
      })
      expect(res.cookie).toHaveBeenCalledWith('jwt_token', expect.any(String), {
        httpOnly: true,
      })
    })

    it('should return 400 if loginService throws "User does not exist" error', async () => {
      const req = {
        body: {
          // Provide valid user data here
          email: 'test@auth.com',
          password: 'password',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock loginService to throw "User does not exist." error
      auth.loginService = jest
        .fn()
        .mockRejectedValue(new Error('User does not exist'))

      await loginController(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'User does not exist' })
    })

    it('should return 400 if loginService throws "Invalid credentials" error', async () => {
      const req = {
        body: {
          // Provide valid user data here
          email: 'test@auth.com',
          password: 'password',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock loginService to throw "Invalid credentials." error
      auth.loginService = jest
        .fn()
        .mockRejectedValue(new Error('Invalid credentials'))

      await loginController(req, res)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' })
    })

    it('should return 500 if any other error occurs', async () => {
      const req = {
        body: {
          // Provide valid user data here
          email: 'test@auth.com',
          password: 'password',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock loginService to throw any other error
      auth.loginService = jest
        .fn()
        .mockRejectedValue(new Error('Some other error.'))

      await loginController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to log user in.',
        error: 'Some other error.',
      })
    })

    it('should return 500 if loginService throws any other error', async () => {
      const req = {
        body: {
          // Provide valid user data here
          email: 'test@one.com',
          password: 'password',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock loginService to throw any other error
      auth.loginService = jest
        .fn()
        .mockRejectedValue(new Error('Some other error.'))

      await loginController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to log user in.',
        error: 'Some other error.',
      })
    })
  })

  // Test logoutController
  describe('logoutController', () => {
    it('should clear jwt_token cookie and return 200', async () => {
      const res = {
        clearCookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await logoutController({}, res)

      expect(res.clearCookie).toHaveBeenCalledWith('jwt_token')
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ message: 'User logged out.' })
    })

    it('should return 500 if any error occurs', async () => {
      const res = {
        clearCookie: jest.fn().mockImplementation(() => {
          throw new Error('Some error.')
        }),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      await logoutController({}, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to log user out.',
        error: 'Some error.',
      })
    })
  })
})
