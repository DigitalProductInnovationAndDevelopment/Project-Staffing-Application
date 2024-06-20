import User from "../models/User.js";



export const getAllUsersService = async () => {
        const all_users = await User.find().select('-password'); //exclude password from query response
        return(all_users);
};

