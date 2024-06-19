import mongoose from "mongoose";

const DemandSchema = new mongoose.Schema(
    {
        now: { type: Number },
        nextQuarter: { type: Number },
        nextNextQuarter: { type: Number },
    },
    {timestamps: true}
);

const Demand = mongoose.model("Demand", DemandSchema);
export default Demand;
