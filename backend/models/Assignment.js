import mongoose from 'mongoose'

const assignmentSchema = new mongoose.Schema({
  userId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  projectDemandProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DemandProfile',
  },
})

const Assignment = mongoose.model('Assignment', assignmentSchema)
export default Assignment
