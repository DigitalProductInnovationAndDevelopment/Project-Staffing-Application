import mongoose from "mongoose";

const EmployeeProfileSchema = new mongoose.Schema(
    {
        currentSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    },
    {timestamps: true}
);

const EmployeeProfile = mongoose.model("EmployeeProfile", EmployeeProfileSchema);
export default EmployeeProfile;