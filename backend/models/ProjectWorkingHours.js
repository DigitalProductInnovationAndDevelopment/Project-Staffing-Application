import mongoose from "mongoose";

const ProjectWorkingHoursSchema = new mongoose.Schema(
    {
        date: { type: Date, required: true },
        numberOfRealWorkingHours: { type: Number, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }
    },
    {timestamps: true}
);

const ProjectWorkingHours = mongoose.model("ProjectWorkingHours", ProjectWorkingHoursSchema);
export default ProjectWorkingHours;