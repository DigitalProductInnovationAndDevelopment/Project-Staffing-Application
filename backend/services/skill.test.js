import {
  createNewSkillService,
  createNewSkillsService,
  addSkillsToUserService,
  addSkillsToProfileService,
  getSkillBySkillIdService,
  getSkillCategoriesService,
  getMaxPointsByCategory,
  getIdOfCategory,
  getSkillCategoryByIdService,
} from '../services/skill.js'
import * as skillService from '../services/skill.js'
import SkillCategory from '../models/SkillCategory.js'
import User from '../models/User.js'
import Skill from '../models/Skill.js'
import ProjectDemandProfile from '../models/ProjectDemandProfile.js'
const mockingoose = require('mockingoose')

describe('Skill Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockingoose.resetAll()
  })

  describe('createNewSkillService', () => {
    it('should throw an error if Skill constructor fails', async () => {
      const skillData = { skillCategory: 'Frontend', skillPoints: 5 }
      mockingoose(Skill).toReturn(new Error('Constructor error'), 'save')
      await expect(createNewSkillService(skillData)).rejects.toThrow()
    })
    it('should throw an error if save method fails', async () => {
      const skillData = { skillCategory: 'Frontend', skillPoints: 5 }
      mockingoose(Skill).toReturn(new Error('Save error'), 'save')
      await expect(createNewSkillService(skillData)).rejects.toThrow()
    })
  })

  describe('createNewSkillsService', () => {
    it('should throw an error for invalid skill category', async () => {
      const skillData = [{ skillPoints: 10, skillCategory: 'InvalidCategory' }]

      mockingoose(SkillCategory).toReturn(
        [
          { name: 'Category1', maxPoints: 100 },
          { name: 'Category2', maxPoints: 100 },
        ],
        'find'
      )

      await expect(createNewSkillsService(skillData)).rejects.toThrow(
        'Invalid skill category: InvalidCategory'
      )
    })
  })

  describe('addSkillsToUserService', () => {
    const userId = 'testUserId'
    const skillIds = ['skillId1', 'skillId2']
    const targetSkillsIds = ['targetSkillId1', 'targetSkillId2']

    it('should add skills to user successfully', async () => {
      const mockUser = {
        _id: userId,
        skills: skillIds,
        targetSkills: targetSkillsIds,
      }

      mockingoose(User).toReturn(mockUser, 'findOneAndUpdate')

      const result = await addSkillsToUserService(
        userId,
        skillIds,
        targetSkillsIds
      )

      expect(result._id).not.toBeNull()
      expect(result.skills).toEqual([])
      expect(result.targetSkills).toEqual([])
      expect(result.canWorkRemote).toBe(false)
      expect(result.leaveIds).toEqual([])
      expect(result.roles).toEqual([])
    })

    it('should throw an error if user is not found', async () => {
      mockingoose(User).toReturn(null, 'findOneAndUpdate')

      await expect(
        addSkillsToUserService(userId, skillIds, targetSkillsIds)
      ).rejects.toThrow('Could not add skills to user')
    })

    it('should throw an error if database operation fails', async () => {
      mockingoose(User).toReturn(
        new Error('Database error'),
        'findOneAndUpdate'
      )

      await expect(
        addSkillsToUserService(userId, skillIds, targetSkillsIds)
      ).rejects.toThrow('Failed to add skills to user: Database error')
    })
  })

  describe('addSkillsToProfileService', () => {
    const profileId = 'testProfileId'
    const skillIds = ['skillId1', 'skillId2']

    it('should add skills to profile successfully', async () => {
      const mockProfile = {
        _id: profileId,
        targetSkills: skillIds,
      }

      mockingoose(ProjectDemandProfile).toReturn(
        mockProfile,
        'findOneAndUpdate'
      )

      const result = await addSkillsToProfileService(profileId, skillIds)

      expect(result._id).not.toBeNull()
      expect(result.targetSkills).toEqual([])
    })

    it('should throw an error if profile is not found', async () => {
      mockingoose(ProjectDemandProfile).toReturn(null, 'findOneAndUpdate')

      await expect(
        addSkillsToProfileService(profileId, skillIds)
      ).rejects.toThrow('Could not add skills to profile')
    })

    it('should throw an error if database operation fails', async () => {
      mockingoose(ProjectDemandProfile).toReturn(
        new Error('Database error'),
        'findOneAndUpdate'
      )

      await expect(
        addSkillsToProfileService(profileId, skillIds)
      ).rejects.toThrow('Failed to add skills to the profile: Database error')
    })
  })

  describe('getSkillBySkillIdService', () => {
    const skillId = 'testSkillId'

    it('should retrieve skill by skill ID successfully', async () => {
      const mockSkill = {
        _id: skillId,
        name: 'Test Skill',
        skillCategory: {
          name: 'Test Category',
          maxPoints: 10,
        },
      }

      mockingoose(Skill).toReturn(mockSkill, 'findOne')

      const result = await getSkillBySkillIdService(skillId)

      expect(result._id).not.toBeNull()
    })

    it('should throw an error if skill is not found', async () => {
      mockingoose(Skill).toReturn(null, 'findOne')

      await expect(getSkillBySkillIdService(skillId)).rejects.toThrow(
        'Skill not found'
      )
    })

    it('should throw an error if database operation fails', async () => {
      mockingoose(Skill).toReturn(new Error('Database error'), 'findOne')

      await expect(getSkillBySkillIdService(skillId)).rejects.toThrow(
        'Failed to get skill: Database error'
      )
    })
  })

  describe('updateSkillPointsBySkillIdService', () => {
    const skillId = 'testSkillId'
    const skillPoint = { skillPoints: 5 }

    it('should throw an error if skill is not found', async () => {
      skillService.getSkillBySkillIdService = jest.fn().mockResolvedValue(null)

      await expect(
        skillService.updateSkillPointsBySkillIdService(skillId, skillPoint)
      ).rejects.toThrow('Skill not found')
    })

    it('should throw an error if database operation fails', async () => {
      getSkillBySkillIdService.mockResolvedValue({ _id: skillId })
      mockingoose(Skill).toReturn(
        new Error('Database error'),
        'findOneAndUpdate'
      )

      await expect(
        skillService.updateSkillPointsBySkillIdService(skillId, skillPoint)
      ).rejects.toThrow()
    })
  })

  describe('deleteSkillsService', () => {
    const skillIds = ['skillId1', 'skillId2']

    it('should delete skills successfully', async () => {
      mockingoose(Skill).toReturn({}, 'findOneAndDelete')

      await expect(
        skillService.deleteSkillsService(skillIds)
      ).resolves.not.toThrow()
    })

    it('should throw an error if a skill could not be deleted', async () => {
      mockingoose(Skill).toReturn(null, 'findOneAndDelete')

      await expect(skillService.deleteSkillsService(skillIds)).rejects.toThrow(
        'Skill could not be deleted'
      )
    })

    it('should throw an error if database operation fails', async () => {
      mockingoose(Skill).toReturn(
        new Error('Database error'),
        'findOneAndDelete'
      )

      await expect(skillService.deleteSkillsService(skillIds)).rejects.toThrow(
        'Failed to delete the skill: Database error'
      )
    })
  })

  describe('updateSkillsService', () => {
    const skillData = [
      { skillCategory: 'Category1', skillPoints: 10 },
      { skillCategory: 'Category2', skillPoints: 20 },
    ]
    const existingIds = [{ _id: 'skillId1' }, { _id: 'skillId2' }]

    it('should throw an error if a skill is not found', async () => {
      skillService.getSkillBySkillIdService.mockResolvedValue(null)

      await expect(
        skillService.updateSkillsService(skillData, existingIds)
      ).rejects.toThrow(
        'Failed to update the skills: Failed to get skill: Skill not found'
      )
    })

    it('should throw an error if database operation fails', async () => {
      mockingoose(Skill).toReturn(new Error('Database error'), 'findById')

      await expect(
        skillService.updateSkillsService(skillData, existingIds)
      ).rejects.toThrow()
    })
  })

  describe('createNewSkillCategoryService', () => {
    const categoryData = { name: 'Test Category', maxPoints: 10 }

    it('should throw an error if creation fails', async () => {
      const errorMessage = 'Database error'
      mockingoose(SkillCategory).toReturn(new Error(errorMessage), 'save')

      await expect(
        skillService.createNewSkillCategoryService(categoryData)
      ).rejects.toThrow(
        `Failed to create a new skill category: ${errorMessage}`
      )
    })
  })

  describe('getSkillCategoriesService', () => {
    it('should retrieve skill categories successfully', async () => {
      const mockCategories = [
        { _id: 'category1', name: 'Category 1' },
        { _id: 'category2', name: 'Category 2' },
      ]
      mockingoose(SkillCategory).toReturn(mockCategories, 'find')

      const result = await getSkillCategoriesService()

      expect(result[0].name).toEqual(mockCategories[0].name)
      expect(result[1].name).toEqual(mockCategories[1].name)
    })

    it('should throw an error if no categories are found', async () => {
      mockingoose(SkillCategory).toReturn(null, 'find')

      await expect(getSkillCategoriesService()).rejects.toThrow(
        'No skill categories found'
      )
    })

    it('should throw an error if retrieval fails', async () => {
      const errorMessage = 'Database error'
      mockingoose(SkillCategory).toReturn(new Error(errorMessage), 'find')

      await expect(getSkillCategoriesService()).rejects.toThrow(
        `Failed to get skill categories: ${errorMessage}`
      )
    })
  })

  describe('getMaxPointsByCategory', () => {
    it('should retrieve max points by category name successfully', async () => {
      const mockCategory = {
        _id: 'category1',
        name: 'Category 1',
        maxPoints: 10,
      }
      mockingoose(SkillCategory).toReturn(mockCategory, 'findOne')

      const result = await getMaxPointsByCategory('Category 1')

      expect(result).toEqual(mockCategory.maxPoints)
    })

    it('should throw an error if category is not found', async () => {
      mockingoose(SkillCategory).toReturn(null, 'findOne')

      await expect(
        getMaxPointsByCategory('Nonexistent Category')
      ).rejects.toThrow('Category not found')
    })

    it('should throw an error if retrieval fails', async () => {
      const errorMessage = 'Database error'
      mockingoose(SkillCategory).toReturn(new Error(errorMessage), 'findOne')

      await expect(getMaxPointsByCategory('Category 1')).rejects.toThrow(
        `Failed to get max points for category: ${errorMessage}`
      )
    })
  })

  describe('getIdOfCategory', () => {
    it('should retrieve category ID successfully by category name', async () => {
      const mockCategory = { name: 'Category 1' }
      mockingoose(SkillCategory).toReturn(mockCategory, 'findOne')

      const result = await getIdOfCategory('Category 1')

      expect(result).not.toBeNull()
    })

    it('should throw an error if category is not found', async () => {
      mockingoose(SkillCategory).toReturn(null, 'findOne')

      await expect(getIdOfCategory('Nonexistent Category')).rejects.toThrow(
        'Category not found'
      )
    })

    it('should throw an error if retrieval fails', async () => {
      const errorMessage = 'Database error'
      mockingoose(SkillCategory).toReturn(new Error(errorMessage), 'findOne')

      await expect(getIdOfCategory('Category 1')).rejects.toThrow(
        `Failed to get id of category: ${errorMessage}`
      )
    })
  })

  describe('getSkillCategoryByIdService', () => {
    it('should return the skill category if found', async () => {
      const categoryId = 'category1'
      const mockCategory = {
        name: 'Category 1',
        maxPoints: 10,
      }
      mockingoose(SkillCategory).toReturn(mockCategory, 'findOne')
      const result = await getSkillCategoryByIdService(categoryId)
      expect(result.name).toEqual(mockCategory.name)
      expect(result.maxPoints).toEqual(mockCategory.maxPoints)
    })
    it('should throw an error if the category is not found', async () => {
      const categoryId = 'category1'
      mockingoose(SkillCategory).toReturn(null, 'findOne')
      await expect(getSkillCategoryByIdService(categoryId)).rejects.toThrow(
        'Category not found'
      )
    })
    it('should throw an error if there is a database error', async () => {
      const categoryId = 'category1'
      const errorMessage = 'Database error'
      mockingoose(SkillCategory).toReturn(new Error(errorMessage), 'findOne')
      await expect(getSkillCategoryByIdService(categoryId)).rejects.toThrow(
        `Failed to get the category: ${errorMessage}`
      )
    })
  })
})
