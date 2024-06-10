import mongoose from "mongoose";

const DemandSchema = new mongoose.Schema(
    {
        now: { type: Number },
        nextQuarter: { type: Number },
        nextNextQuarter: { type: Number },
        projectDemandProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProjectDemandProfile', required: true },
    },
    {timestamps: true}
);

const Demand = mongoose.model("Demand", DemandSchema);
export default Demand;
