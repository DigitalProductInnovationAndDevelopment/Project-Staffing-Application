import express from 'express'
import {
  createNewProjectController,
  getAllProjectsController,
  getProjectByIdController,
  updateProjectController,
  deleteProjectController,
} from '../controllers/project.js'
import {
  createNewProfileController,
  getAllProfilesByProjectIdController,
  getProfileByIdController,
  updateProfileController,
  deleteProfileController,
  getAssignmentByProfileIdController,
  updateAssignmentController,
} from '../controllers/profile.js'

const router = express.Router()

// CREATE
router.post('/', createNewProjectController)

router.post('/:projectId', createNewProfileController)

// READ
router.get('/', getAllProjectsController)
router.get('/:projectId', getProjectByIdController)
router.get('/:projectId/:profileId/assign', getAssignmentByProfileIdController)

router.get('/:projectId/profiles', getAllProfilesByProjectIdController)
router.get('/:projectId/:profileId', getProfileByIdController)

// UPDATE
router.patch('/:projectId', updateProjectController)
router.patch('/:projectId/:profileId/assign', updateAssignmentController)

router.patch('/:projectId/:profileId', updateProfileController)

// DELETE
router.delete('/:projectId', deleteProjectController)
router.delete('/:projectId/:profileId', deleteProfileController)

export default router
