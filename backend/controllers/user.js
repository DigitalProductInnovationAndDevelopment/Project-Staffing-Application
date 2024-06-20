import User from "../models/User.js";
import { getAllUsersService } from "../services/user.js";


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
        const user = await User.findOne({ userId: userId }).select('-password'); //exclude password from query response
        res.status(200).json(user);

    } catch (err) {
        next(err);
    }
};


export const updateUserController = async (req, res, next) => {
    try {
        // TODO
        res.send('updateUserController');

    } catch (err) {
        next(err);
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
