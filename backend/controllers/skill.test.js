/* eslint-disable no-import-assign */
import * as skill from '../services/skill.js'
import {
  createNewSkillCategoryController,
  deleteSkillCategoryController,
  getSkillCategoriesController,
  updateSkillCategoryController,
} from '../controllers/skill.js'

describe('Skill Controller Tests', () => {
  // Test createNewSkillCategoryController
  describe('createNewSkillCategoryController', () => {
    it('should return 201 with the created skill category data', async () => {
      const req = {
        body: {
          // Provide skill category data here
          name: 'Test Skill Category',
          maxPoints: 100,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock createNewSkillCategoryService
      skill.createNewSkillCategoryService = jest.fn().mockResolvedValue({
        _id: '123',
        name: 'Test Skill Category',
        maxPoints: 100,
      })

      await createNewSkillCategoryController(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Skill category created successfully.',
        data: { _id: '123', name: 'Test Skill Category', maxPoints: 100 },
      })
    })

    it('should return 500 if an error occurs', async () => {
      const req = {
        body: {
          // Provide skill category data here
          name: 'Test Skill Category',
          maxPoints: 100,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock createNewSkillCategoryService to throw an error
      skill.createNewSkillCategoryService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await createNewSkillCategoryController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error creating skill category.',
        error: 'Some error.',
      })
    })
  })

  // Test getSkillCategoriesController
  describe('getSkillCategoriesController', () => {
    it('should return 200 with the fetched skill categories', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock getSkillCategoriesService
      skill.getSkillCategoriesService = jest.fn().mockResolvedValue([
        { _id: '123', name: 'Test Skill Category', maxPoints: 100 },
        { _id: '456', name: 'Another Skill Category', maxPoints: 200 },
      ])

      await getSkillCategoriesController({}, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Skill categories fetched successfully.',
        data: [
          { _id: '123', name: 'Test Skill Category', maxPoints: 100 },
          { _id: '456', name: 'Another Skill Category', maxPoints: 200 },
        ],
      })
    })

    it('should return 500 if an error occurs', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock getSkillCategoriesService to throw an error
      skill.getSkillCategoriesService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await getSkillCategoriesController({}, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching skill categories.',
        error: 'Some error.',
      })
    })
  })

  // Test updateSkillCategoryController
  describe('updateSkillCategoryController', () => {
    it('should return 200 with the updated skill category data', async () => {
      const req = {
        params: {
          skillId: '123',
        },
        body: {
          // Provide updated skill category data here
          name: 'Updated Skill Category',
          maxPoints: 150,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock updateSkillCategoryService
      skill.updateSkillCategoryService = jest.fn().mockResolvedValue({
        _id: '123',
        name: 'Updated Skill Category',
        maxPoints: 150,
      })

      await updateSkillCategoryController(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Skill category updated successfully.',
        data: { _id: '123', name: 'Updated Skill Category', maxPoints: 150 },
      })
    })

    it('should return 500 if an error occurs', async () => {
      const req = {
        params: {
          skillId: '123',
        },
        body: {
          // Provide updated skill category data here
          name: 'Updated Skill Category',
          maxPoints: 150,
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock updateSkillCategoryService to throw an error
      skill.updateSkillCategoryService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await updateSkillCategoryController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error updating skill category.',
        error: 'Some error.',
      })
    })
  })

  // Test deleteSkillCategoryController
  describe('deleteSkillCategoryController', () => {
    it('should return 200 with the deleted skill category data', async () => {
      const req = {
        params: {
          skillId: '123',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock deleteSkillCategoryService
      skill.deleteSkillCategoryService = jest.fn().mockResolvedValue({
        _id: '123',
        name: 'Test Skill Category',
        maxPoints: 100,
      })

      await deleteSkillCategoryController(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Skill category deleted successfully.',
        data: { _id: '123', name: 'Test Skill Category', maxPoints: 100 },
      })
    })

    it('should return 500 if an error occurs', async () => {
      const req = {
        params: {
          skillId: '123',
        },
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      }

      // Mock deleteSkillCategoryService to throw an error
      skill.deleteSkillCategoryService = jest
        .fn()
        .mockRejectedValue(new Error('Some error.'))

      await deleteSkillCategoryController(req, res)

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error deleting skill category.',
        error: 'Some error.',
      })
    })
  })
})
