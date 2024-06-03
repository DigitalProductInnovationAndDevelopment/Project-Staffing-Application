import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
    {
        skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }]
    },
    {timestamps: true}
);

const Profile = mongoose.model("Profile", ProfileSchema);
export default Profile;