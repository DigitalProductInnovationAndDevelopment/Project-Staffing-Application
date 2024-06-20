import express from 'express'
import {
  createNewProjectController,
  getAllProjectsController,
  getProjectByIdController,
  getProjectAssignmentByProjectIdController,
  updateProjectController,
  updateProjectAssignmentController,
  deleteProjectController,
} from '../controllers/project.js'
import {
  createNewProfileController,
  getAllProfilesByProjectIdController,
  getProfileByIdController,
  updateProfileController,
  deleteProfileController,
} from '../controllers/profile.js'

const router = express.Router()

// CREATE
router.post('/', createNewProjectController)

router.post('/:projectId', createNewProfileController)

// READ
router.get('/', getAllProjectsController)
router.get('/:projectId', getProjectByIdController)
router.get('/:projectId/assign', getProjectAssignmentByProjectIdController)

router.get('/:projectId/profiles', getAllProfilesByProjectIdController)
router.get('/:projectId/:profileId', getProfileByIdController)

// UPDATE
router.patch('/:projectId', updateProjectController)
router.patch('/:projectId/assign', updateProjectAssignmentController)

router.patch('/:projectId/:profileId', updateProfileController)

// DELETE
router.delete('/:projectId', deleteProjectController)
router.delete('/:projectId/:profileId', deleteProfileController)

export default router
