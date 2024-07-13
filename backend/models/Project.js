import mongoose from 'mongoose'
import Priority from './enums/Priority.js'

const ProjectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      max: 50,
    },
    kickoffDate: {
      type: Date,
      required: true,
    },
    deadlineDate: {
      type: Date,
    },
    projectLocation: {
      type: String,
      max: 100,
    },

    demandProfiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectDemandProfile',
      },
    ],

    priority: {
      type: String,
      enum: Object.values(Priority),
    },
  },
  { timestamps: true }
)

const Project = mongoose.model('Project', ProjectSchema)
export default Project
