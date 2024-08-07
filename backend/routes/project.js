import express from 'express'
import {
  createNewProjectController,
  getAllProjectsController,
  getProjectByIdController,
  updateProjectController,
  deleteProjectController,
} from '../controllers/project.js'
import {
  createNewProfilesController,
  getAllProfilesByProjectIdController,
  getProfileByIdController,
  updateProfileController,
  deleteProfileController,
  getAssignmentsByProjectIdController,
  updateAssignmentController,
} from '../controllers/profile.js'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// CREATE
router.post('/', verifyToken, createNewProjectController)

router.post('/:projectId', verifyToken, createNewProfilesController)

// READ
router.get('/', verifyToken, getAllProjectsController)
router.get('/:projectId', verifyToken, getProjectByIdController)
router.get(
  '/:projectId/assign',
  verifyToken,
  getAssignmentsByProjectIdController
)

router.get(
  '/:projectId/profiles',
  verifyToken,
  getAllProfilesByProjectIdController
)
router.get('/:projectId/:profileId', verifyToken, getProfileByIdController)

// UPDATE
router.patch('/:projectId', verifyToken, updateProjectController)
router.patch('/:projectId/assign', verifyToken, updateAssignmentController)

router.patch('/:projectId/:profileId', verifyToken, updateProfileController)

// DELETE
router.delete('/:projectId', verifyToken, deleteProjectController)
router.delete('/:projectId/:profileId', verifyToken, deleteProfileController)

export default router
