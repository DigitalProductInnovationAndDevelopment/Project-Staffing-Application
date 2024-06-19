import mongoose from 'mongoose';
import SkillCategory from './enums/SkillCategory.js';

const SkillSchema = new mongoose.Schema(
  {
    skillPoints: { type: Number, required: true },
    maxSkillPoints: { type: Number, required: true },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
    },
    skillCategory: {
      type: String,
      enum: Object.values(SkillCategory),
    },
  },
  { timestamps: true }
);

const Skill = mongoose.model('Skill', SkillSchema);
export default Skill;
