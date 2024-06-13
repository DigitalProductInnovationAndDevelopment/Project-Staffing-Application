import Project from "../models/Project.js";




export const getAllProjectsController = async (req, res, next) => {
    try {
        const all_projects = await Project.find();
        res.status(200).json(all_projects);

    } catch (err) {
        next(err);
    }
};


export const getProjectByIdController = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findOne({ projectId: projectId });
        res.status(200).json(project);

    } catch (err) {
        next(err);
    }
};


export const createNewProjectController = async (req, res, next) => {
    try {
        // TODO
        res.send('createNewProjectController');

    } catch (err) {
        next(err);
    }
};


export const updateProjectController = async (req, res, next) => {
    try {
        // TODO
        res.send('updateProjectController');

    } catch (err) {
        next(err);
    }
};


export const getProjectAssignmentByProjectIdController = async (req, res, next) => {
    try {
        // TODO
        res.send('getProjectAssignmentByProjectIdController');

    } catch (err) {
        next(err);
    }
};


export const updateProjectAssignmentController = async (req, res, next) => {
    try {
        // TODO
        res.send('updateProjectAssignmentController');

    } catch (err) {
        next(err);
    }
};
