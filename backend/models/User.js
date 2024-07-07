import mongoose from 'mongoose'
import OfficeLocation from './enums/OfficeLocation.js'
import Role from './enums/Role.js'

const UserSchema = new mongoose.Schema(
  {

    firstName: {
      type: String,
      required: true,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    canWorkRemote: {
      type: Boolean,
      default: false,
    },

    contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' },
    leaveIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Leave' }],
    skills: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
    }],

    projectWorkingHours: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProjectWorkingHours',
      },
    ],

    officeLocation: {
      type: String,
      enum: Object.values(OfficeLocation),
    },
    roles: [
      {
        type: String,
        enum: Object.values(Role),
      },
    ],
  },
  { timestamps: true }
)

const User = mongoose.model('User', UserSchema)
export default User
