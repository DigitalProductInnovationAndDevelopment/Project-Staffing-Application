import User from "../models/User.js";




export const getAllEmployeesController = async (req, res, next) => {
    try {
        const all_users = await User.find().select('-password'); //exclude password from query response
        res.status(200).json(all_users);

    } catch (err) {
        next(err);
    }
};


export const getEmployeeByIdController = async (req, res, next) => {
    try {
        const { employeeId } = req.params;
        const user = await User.findOne({ userId: employeeId }).select('-password'); //exclude password from query response
        res.status(200).json(user);

    } catch (err) {
        next(err);
    }
};


export const updateEmployeeController = async (req, res, next) => {
    try {
        // TODO
        res.send('updateEmployeeController');

    } catch (err) {
        next(err);
    }
};


export const createNewEmployeeController = async (req, res, next) => {
    try {
        // TODO
        res.send('createNewEmployeeController');

    } catch (err) {
        next(err);
    }
};
