import mongoose from "mongoose";

const SkillCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  maxPoints: { type: Number, required: true },
});


const SkillCategory = mongoose.model("SkillCategory", SkillCategorySchema);
export default SkillCategory;