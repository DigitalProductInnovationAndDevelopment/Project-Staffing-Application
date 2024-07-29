import express from 'express'
import { createNewSkillCategoryController, getSkillCategoriesController, updateSkillCategoryController, deleteSkillCategoryController } from '../controllers/skill.js'

const router = express.Router()

// CREATE
router.post('/', createNewSkillCategoryController)

// READ
router.get('/', getSkillCategoriesController)

// UPDATE
router.patch('/:skillId', updateSkillCategoryController)

// DELETE
router.delete('/:skillId', deleteSkillCategoryController)

export default router