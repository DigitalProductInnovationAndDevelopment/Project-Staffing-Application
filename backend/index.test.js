import request from 'supertest'
import { jest } from '@jest/globals'
import express from 'express' // Import express for route mocking

// Mock the server listening *before* importing the app
jest.mock('./index.js', () => {
  const originalModule = jest.requireActual('./index.js')
  return {
    ...originalModule,
    default: {
      ...originalModule.default,
      listen: jest.fn(() => {}), // Mock listen to do nothing
    },
  }
})

// Now import the app (after the mock)
import app from './index.js'

// Mock the route imports
jest.mock('./routes/auth.js', () => jest.fn(() => express.Router()))
jest.mock('./routes/user.js', () => jest.fn(() => express.Router()))
jest.mock('./routes/project.js', () => jest.fn(() => express.Router()))
jest.mock('./routes/skill.js', () => jest.fn(() => express.Router()))

// Mock mongoose to prevent actual database connections during testing
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  connection: {
    close: jest.fn(),
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

    // Check the structure of the first user object
    const user = response.body[0]
    expect(user).toHaveProperty('_id')
    expect(user).toHaveProperty('firstName')
    expect(user).toHaveProperty('lastName')
    expect(user).toHaveProperty('email')
    expect(user).toHaveProperty('canWorkRemote')
    expect(user).toHaveProperty('skills')
    expect(user.skills).toBeInstanceOf(Array)
  })

  // Test for GET /skill
  it('should respond to GET /skill', async () => {
    const response = await request(app).get('/skill')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty(
      'message',
      'Skill categories fetched successfully'
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

  // ... your other middleware tests
})
