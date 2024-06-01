import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
    {
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

    },
    {timestamps: true}
);

const Project = mongoose.model("Project", ProjectSchema);
export default Project;