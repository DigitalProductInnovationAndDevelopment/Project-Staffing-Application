import mongoose from 'mongoose'

const SkillSchema = new mongoose.Schema(
  {
    skillPoints: { type: Number, required: true },
    skillCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkillCategory',
      required: true,
    },
  },
  { timestamps: true }
)

const Skill = mongoose.model('Skill', SkillSchema)
export default Skill
