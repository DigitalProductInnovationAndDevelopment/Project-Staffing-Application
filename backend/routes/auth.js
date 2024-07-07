import express from 'express'
import {
  loginController,
  logoutController,
} from '../controllers/auth.js'

const router = express.Router()

// CREATE
router.post('/login', loginController)
router.post('/logout', logoutController)

// READ
// UPDATE
// DELETE

export default router
