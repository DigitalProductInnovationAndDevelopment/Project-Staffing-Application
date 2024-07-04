import mongoose from 'mongoose'

const assignmentSchema = new mongoose.Schema({
  employeeId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DemandProfile',
    required: true,
  },
})

const Assignment = mongoose.model('Assignment', assignmentSchema)
export default Assignment
