import User from '../models/User.js';
import ProjectWorkingHours from '../models/ProjectWorkingHours.js';
import { getProjectWorkingHourDistributionByUserId } from '../utils/projectWorkingHoursHelper.js';

export const createNewUserService = async (userData) => {
  try {
    const newUser = new User(userData);
    await newUser.save();
    return newUser;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

// enriches each user with the number of projects they have been working on within last 3 months <-> based on ProjectWorkingHours
export const getAllUsersService = async () => {

  // get all users
  const all_users = await User.find().select('-password').populate('skills'); //exclude password from query response

  // get all projectWorkingHours
  const all_projectWorkingHours = await ProjectWorkingHours.find();

  // iterate through all users and calculate the number of projects within the last 3 months
  for (let i = 0; i < all_users.length; i++) {
    const user = all_users[i].toObject(); // convert Mongoose document to a plain JavaScript object
    const userId = user._id;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    const endDate = new Date();
    const workingHourDistribution = getProjectWorkingHourDistributionByUserId(
      all_projectWorkingHours,
      userId,
      startDate,
      endDate
    );
    user.numberOfProjectsLast3Months = workingHourDistribution.numberOfProjects;
    all_users[i] = user;
  }
  console.log('all_users');
  console.log(all_users);
  return all_users;
};

export const getUserByUserIdService = async (userId) => {
  const user = await User.findById(userId)
    .select('-password')
    .populate('skills'); //exclude password from query response
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
