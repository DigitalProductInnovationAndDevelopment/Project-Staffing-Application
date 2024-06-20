import User from '../models/User.js';

export const getAllUsersService = async () => {
  const all_users = await User.find().select('-password'); //exclude password from query response
  return all_users;
};

export const getUserByUserIdService = async (userId) => {
  const user = await User.findOne({ userId: userId }).select('-password'); //exclude password from query response
  return user;
};

//mongoose will only update the specified fields within "updateData" and leave the other fields unchanged
export const updateUserService = async (_id, updateData) => {
  try {
    //find the user by ID and update the document with the new data
    const updatedUser = await User.findByIdAndUpdate(_id, updateData, {
      new: true,
    }); // { new: true } => return updated document
    if (!updatedUser) {
      throw new Error('User not found');
    }
    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

export const deleteUserService = async (_id) => {
  try {
    const deletedUser = await User.findOneAndDelete({ _id });
    if (!deletedUser) {
      throw new Error('User not found');
    }
    return deletedUser;
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};
