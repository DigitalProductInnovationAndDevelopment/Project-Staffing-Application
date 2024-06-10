import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema(
    {
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },

        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    },
    {timestamps: true}
);

const Leave = mongoose.model("Leave", LeaveSchema);
export default Leave;