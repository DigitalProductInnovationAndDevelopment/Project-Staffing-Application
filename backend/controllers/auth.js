import jwt from 'jsonwebtoken'
import { loginService } from '../services/auth.js'

export const loginController = async (req, res) => {
  try {
    const user = await loginService(req.body)
    if (!user) {
      res.status(400).json({ message: 'User does not exist.' })
    }

    // create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    // set response cookie
    res.cookie('jwt_token', token, {
      httpOnly: true,
    })

    // send response
    res.status(200).json({ token, user })
  } catch (err) {
    if (
      err.message === 'User does not exist.' ||
      err.message === 'Invalid credentials.'
    ) {
      res.status(400).json({ error: err.message })
    }

    res
      .status(500)
      .json({ message: 'Failed to log user in.', error: err.message })
  }
}

export const logoutController = async (_, res) => {
  try {
    res.clearCookie('jwt_token')

    res.status(200).json({ message: 'User logged out.' })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to log user out.', error: err.message })
  }
}
