import {
  createNewSkillCategoryController,
  deleteSkillCategoryController,
  getSkillCategoriesController,
  updateSkillCategoryController,
} from '../controllers/skill.js'
import express from 'express'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// CREATE
router.post('/', verifyToken, createNewSkillCategoryController)

// READ
router.get('/', verifyToken, getSkillCategoriesController)

// UPDATE
router.patch('/:skillId', verifyToken, updateSkillCategoryController)

// DELETE
router.delete('/:skillId', verifyToken, deleteSkillCategoryController)

export default router
