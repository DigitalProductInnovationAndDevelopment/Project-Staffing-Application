import mongoose from "mongoose";
import OfficeLocation from "./enums/OfficeLocation.js"
import Role from "./enums/Role.js"

const UserSchema = new mongoose.Schema(
    {

        // TODO: do we need this userId or is it created automatically via mongo?
        userId: { type: String, required: true },

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
        workingLocation: {
            type: String,
            max: 100,
        },
        canWorkRemote: {
            type: Boolean,
            default: false,
        },

        contractId: { type: Schema.Types.ObjectId, ref: 'Contract' },
        leaveIds: [{ type: Schema.Types.ObjectId, ref: 'Leave' }],
        currentProfile: { type: Schema.Types.ObjectId, ref: 'EmployeeProfile' },

        projectWorkingHours: [{ type: Schema.Types.ObjectId, ref: 'ProjectWorkingHours' }],

        officeLocation: {
            type: String,
            enum: Object.values(OfficeLocation),
        },
        roles: [{
            type: String,
            enum: Object.values(Role),
        }],


    },
    {timestamps: true}
);

const User = mongoose.model("User", UserSchema);
export default User;