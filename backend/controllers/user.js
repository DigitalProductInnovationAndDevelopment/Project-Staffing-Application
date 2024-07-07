import {
  getAllUsersService,
  getUserByUserIdService,
  updateUserService,
  deleteUserService,
  createNewUserService,
} from '../services/user.js'

export const createNewUserController = async (req, res) => {
  //TODO: use data from frontend
  //const userData = req.body;
  const userData = {
    // userId: '001',
    firstName: 'new',
    lastName: 'user',
    email: 'new@user.com',
    password: '0000',
    //"canWorkRemote": true,
    officeLocation: 'MUNICH',
    roles: ['ADMIN'],
  }
  try {
    const newUser = await createNewUserService(userData)
    return res.status(201).json({
      message: 'User created successfully',
      data: newUser,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const getAllUsersController = async (req, res, next) => {
  try {
    const all_users = await getAllUsersService()
    if (!all_users) {
      next(new AppError('Users not found.', 400))
    }
    res.status(200).json(all_users)
  } catch (err) {
    next(err)
  }
}

export const getUserByIdController = async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await getUserByUserIdService(userId)
    if (!user) {
      next(new AppError('User not found.', 400))
    }
    res.status(200).json(user)
  } catch (err) {
    next(err)
  }
}

export const updateUserController = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await getUserByUserIdService(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const updatedUser = await updateUserService(user._id, req.body)
    res
      .status(200)
      .json({ message: 'User updated successfully', data: updatedUser })
  } catch (err) {
    return res.status(500).json({ message:'Failed to update user', error: err.message})
  }

}

export const deleteUserController = async (req, res) => {
  const { userId } = req.params
  const user = await getUserByUserIdService(userId)
  const _id = user._id
  try {
    const deletedUser = await deleteUserService(_id)
    return res.status(200).json({
      message: 'User deleted successfully',
      data: deletedUser,
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
