import express from 'express'
import {
  createNewUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
} from '../controllers/user.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// CREATE
router.post('/', createNewUserController)

// READ
router.get('/', verifyToken, getAllUsersController)
router.get('/:userId', verifyToken, getUserByIdController)

// UPDATE
router.patch('/:userId', updateUserController)

// DELETE
router.delete('/:userId', deleteUserController)

export default router
