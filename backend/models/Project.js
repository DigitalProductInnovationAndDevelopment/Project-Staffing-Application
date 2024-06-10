import mongoose from "mongoose";
import Priority from "./enums/Priority.js"

const ProjectSchema = new mongoose.Schema(
    {

        // TODO: do we need this userId or is it created automatically via mongo?
        projectId: { type: String, required: true },

        projectName: {
            type: String,
            required: true,
            max: 50,
        },
        kickoffDate: {
            type: Date,
            required: true,
        },
        deadlineDate: {
            type: Date,
        },
        projectLocation: {
            type: String,
            max: 100,
        },

        projectWorkingHours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectWorkingHours' }],
        demandProfiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProjectDemandProfile' }],

        priority: {
            type: String,
            enum: Object.values(Priority),
        }

    },
    {timestamps: true}
);

const Project = mongoose.model("Project", ProjectSchema);
export default Project;