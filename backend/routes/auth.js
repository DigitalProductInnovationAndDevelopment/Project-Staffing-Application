import { loginController, logoutController } from '../controllers/auth.js'
import express from 'express'
import { verifyToken } from '../middleware/auth.js'

const router = express.Router()

// CREATE
router.post('/login', loginController)
router.post('/logout', verifyToken, logoutController)

// READ
// UPDATE
// DELETE

export default router
