import request from 'supertest'
import { jest } from '@jest/globals'
import { app, startServer } from './index.js'

let server

beforeAll(async () => {
  server = await startServer(0) // Use port 0 to let the OS assign a free port
})

afterAll((done) => {
  server.close(done)
})

// Mock the route imports
jest.mock('./routes/auth.js', () => {
  const express = require('express')
  return jest.fn(() => {
    const router = express.Router()
    router.post('/login', (req, res) => res.json({ token: 'mock-token' }))
    return router
  })
})

jest.mock('./routes/user.js', () => {
  const express = require('express')
  return jest.fn(() => {
    const router = express.Router()
    router.get('/', (req, res) =>
      res.json([
        {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          canWorkRemote: true,
          skills: [
            {
              _id: '101',
              skillPoints: 5,
              skillCategory: 'TECHNOLOGY',
              maxSkillPoints: 10,
            },
          ],
          leaveIds: [],
          officeLocation: 'New York',
          roles: ['developer'],
          contractId: {
            _id: '201',
            weeklyWorkingHours: 40,
          },
          targetSkills: [
            {
              _id: '301',
              skillPoints: 7,
              skillCategory: 'TECHNOLOGY',
              maxSkillPoints: 10,
            },
          ],
          numberOfProjectsLast3Months: 2,
          projectWorkingHourDistributionInHours: { 'Project A': 80 },
          projectWorkingHourDistributionInPercentage: { 'Project A': 100 },
        },
      ])
    )
    return router
  })
})

jest.mock('./routes/project.js', () => {
  const express = require('express')
  return jest.fn(() => express.Router())
})

jest.mock('./routes/skill.js', () => {
  const express = require('express')
  return jest.fn(() => {
    const router = express.Router()
    router.get('/', (req, res) =>
      res.json({
        message: 'Skill categories fetched successfully.',
        data: [
          {
            _id: '1',
            name: 'JavaScript',
            maxPoints: 10,
          },
        ],
      })
    )
    return router
  })
})

// Mock mongoose to prevent actual database connections during testing
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(),
  connection: {
    client: {
      db: jest.fn().mockReturnValue({
        listCollections: jest.fn().mockResolvedValue([]),
      }),
    },
  },
}))

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn(),
}))

describe('Express App', () => {
  it('should respond to GET /', async () => {
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
    expect(response.text).toBe('Hello World! This is the GREAT STAFF server!')
  })

  it('should handle unknown routes', async () => {
    const response = await request(app).get('/unknown-route')
    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Route /unknown-route not found')
  })

  // Test for GET /user
  it('should respond to GET /user', async () => {
    const response = await request(app).get('/user')
    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBeGreaterThan(0)

    // Check the structure of each user object
    response.body.forEach((user) => {
      expect(user).toHaveProperty('_id')
      expect(user).toHaveProperty('firstName')
      expect(user).toHaveProperty('lastName')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('canWorkRemote')
      expect(user).toHaveProperty('skills')
      expect(user.skills).toBeInstanceOf(Array)
      user.skills.forEach((skill) => {
        expect(skill).toHaveProperty('_id')
        expect(skill).toHaveProperty('skillPoints')
        expect(skill).toHaveProperty('skillCategory')
        expect(skill).toHaveProperty('maxSkillPoints')
      })

      expect(user).toHaveProperty('leaveIds')
      expect(user.leaveIds).toBeInstanceOf(Array)

      expect(user).toHaveProperty('officeLocation')
      expect(user).toHaveProperty('roles')
      expect(user.roles).toBeInstanceOf(Array)

      if (user.contractId) {
        expect(user.contractId).toHaveProperty('_id')
        expect(user.contractId).toHaveProperty('weeklyWorkingHours')
      }

      expect(user).toHaveProperty('targetSkills')
      expect(user.targetSkills).toBeInstanceOf(Array)
      user.targetSkills.forEach((targetSkill) => {
        expect(targetSkill).toHaveProperty('_id')
        expect(targetSkill).toHaveProperty('skillPoints')
        expect(targetSkill).toHaveProperty('skillCategory')
        expect(targetSkill).toHaveProperty('maxSkillPoints')
      })

      expect(user).toHaveProperty('numberOfProjectsLast3Months')

      expect(user).toHaveProperty('projectWorkingHourDistributionInHours')
      expect(user.projectWorkingHourDistributionInHours).toBeInstanceOf(Object)

      expect(user).toHaveProperty('projectWorkingHourDistributionInPercentage')
      expect(user.projectWorkingHourDistributionInPercentage).toBeInstanceOf(
        Object
      )
    })
  })

  // Test for GET /skill
  it('should respond to GET /skill', async () => {
    const response = await request(app).get('/skill')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty(
      'message',
      'Skill categories fetched successfully.'
    )
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toBeInstanceOf(Array)
    expect(response.body.data.length).toBeGreaterThan(0)

    // Check the structure of the first skill object
    const skill = response.body.data[0]
    expect(skill).toHaveProperty('_id')
    expect(skill).toHaveProperty('name')
    expect(skill).toHaveProperty('maxPoints')
  })
})

describe('Middleware', () => {
  it('should use JSON middleware', async () => {
    const response = await request(app).post('/').send({ test: 'data' })
    expect(response.status).not.toBe(400)
  })

  // You can add more middleware tests here
})
