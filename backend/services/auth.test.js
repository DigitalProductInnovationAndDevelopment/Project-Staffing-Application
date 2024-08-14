import User from '../models/User.js'
import { loginService } from '../services/auth.js'

describe('loginService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should log in a user with valid credentials', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123',
    }

    User.findOne = jest.fn().mockResolvedValue({
      email: loginData.email,
      password: loginData.password,
    })

    const user = await loginService(loginData)

    expect(user).toBeDefined()
    expect(user.email).toBe(loginData.email)
    expect(user.password).toBeUndefined()
  })

  it('should throw an error if user does not exist', async () => {
    const loginData = {
      email: 'nonexistent@example.com',
      password: 'password123',
    }

    User.findOne = jest.fn().mockResolvedValue(null)

    await expect(loginService(loginData)).rejects.toThrow('User does not exist')
  })

  it('should throw an error if password is incorrect', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'incorrectpassword',
    }

    User.findOne = jest.fn().mockResolvedValue({
      email: loginData.email,
      password: 'password123',
    })

    await expect(loginService(loginData)).rejects.toThrow('Invalid credentials')
  })
})
