import {
  createNewUserController,
  deleteUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
} from '../controllers/user.js'
import express from 'express'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// CREATE
router.post('/', verifyToken, createNewUserController)

// READ
router.get('/', getAllUsersController)
router.get('/:userId', getUserByIdController)

// UPDATE
router.patch('/:userId', verifyToken, updateUserController)

// DELETE
router.delete('/:userId', verifyToken, deleteUserController)

export default router
