import mongoose from "mongoose";

const EmployeeProfileSchema = new mongoose.Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    },
    {timestamps: true}
);

const EmployeeProfile = mongoose.model("EmployeeProfile", EmployeeProfileSchema);
export default EmployeeProfile;