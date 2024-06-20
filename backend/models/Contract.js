import mongoose from 'mongoose'

const ContractSchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    weeklyWorkingHours: {
      type: Number,
      required: true,
      min: 0,
      max: 40,
    },
  },
  { timestamps: true }
)

const Contract = mongoose.model('Contract', ContractSchema)
export default Contract
