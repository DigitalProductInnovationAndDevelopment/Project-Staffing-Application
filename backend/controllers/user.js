import {
  getAllUsersService,
  getUserByUserIdService,
  updateUserService,
} from '../services/user.js';

export const getAllUsersController = async (req, res, next) => {
  try {
    const all_users = await getAllUsersService();
    if (!all_users) {
      next(new AppError('Users not found.', 400));
    }
    res.status(200).json(all_users);
  } catch (err) {
    next(err);
  }
};

export const getUserByIdController = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await getUserByUserIdService(userId);
    if (!user) {
      next(new AppError('User not found.', 400));
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await getUserByUserIdService(userId);
    const _id = user._id;

    //TODO: use data from frontend
    //const updateData = req.body;
    const updateData = {
      canWorkRemote: false,
    };

    const updatedUser = await updateUserService(_id, updateData);
    return res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const createNewUserController = async (req, res, next) => {
  try {
    // TODO
    res.send('createNewUserController');
  } catch (err) {
    next(err);
  }
};
