import mongoose from "mongoose";

const ProjectDemandProfileSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
        minimalDemandId: { type: Schema.Types.ObjectId, ref: 'Demand', required: true },
        targetDemandId: { type: Schema.Types.ObjectId, ref: 'Demand', required: true }
    },
    {timestamps: true}
);

const ProjectDemandProfile = mongoose.model("ProjectDemandProfile", ProjectDemandProfileSchema);
export default ProjectDemandProfile;