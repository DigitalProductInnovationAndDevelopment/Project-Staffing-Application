import express from 'express';
import {
  createNewUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController
} from '../controllers/user.js';

const router = express.Router();

// CREATE
router.post('/', createNewUserController);

// READ
router.get('/', getAllUsersController);
router.get('/:userId', getUserByIdController);

// UPDATE
router.patch('/:userId', updateUserController);

// DELETE
router.delete('/:userId', deleteUserController);

export default router;
