import User from "../models/User.js";



export const getAllUsersService = async () => {
        const all_users = await User.find().select('-password'); //exclude password from query response
        return(all_users);
};

export const getUserByIdService = async (userId) => {
    const user = await User.findOne({ userId: userId }).select('-password'); //exclude password from query response
    return(user);
};

