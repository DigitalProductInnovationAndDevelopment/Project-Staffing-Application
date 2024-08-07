import {
  getAllUsersService,
  getUserByUserIdService,
  updateUserService,
  deleteUserService,
  createNewUserService,
} from '../services/user.js'

export const createNewUserController = async (req, res) => {
  try {
    const userData = req.body

    let newUser = await createNewUserService(userData)
    if (!newUser) {
      return res.status(500).json({
        message: 'User could not be created.',
      })
    }

    res.status(201).json({
      message: 'User created successfully.',
      data: newUser,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const getAllUsersController = async (_, res) => {
  try {
    const all_users = await getAllUsersService()
    if (!all_users) {
      return res.status(404).json({ message: 'Users not found.' })
    }

    res.status(200).json(all_users)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to get all users.', error: err.message })
  }
}

export const getUserByIdController = async (req, res, next) => {
  try {
    const { userId } = req.params

    const user = await getUserByUserIdService(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    res.status(200).json(user)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to get user by ID.', error: err.message })
  }
}

export const updateUserController = async (req, res) => {
  try {
    const { userId } = req.params
    const updateData = req.body

    const updatedUser = await updateUserService(userId, updateData)

    return res.status(200).json({
      message: 'User updated successfully.',
      data: updatedUser,
    })
  } catch (err) {
    if (err.message === 'User not found.') {
      return res.status(404).json({
        message: err.message,
      })
    }

    if (
      err.message ===
      'Invalid target skill points. Target skill points should be greater than or equal to skill points.'
    ) {
      return res.status(400).json({
        message: err.message,
      })
    }

    return res.status(500).json({
      message: err.message,
    })
  }
}

export const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.params

    const deletedUser = await deleteUserService(userId)

    return res.status(200).json({
      message: 'User deleted successfully.',
      data: deletedUser,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
