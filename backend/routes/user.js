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
router.post('/', verifyToken, createNewUserController)

// READ
router.get('/', verifyToken, getAllUsersController)
router.get('/:userId', verifyToken, getUserByIdController)

// UPDATE
router.patch('/:userId', verifyToken, updateUserController)

// DELETE
router.delete('/:userId', verifyToken, deleteUserController)

export default router
