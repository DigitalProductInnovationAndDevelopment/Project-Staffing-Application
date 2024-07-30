import { createNewSkillCategoryService, getSkillCategoriesService, deleteSkillCategoryService, updateSkillCategoryService } from '../services/skill.js';

export const createNewSkillCategoryController = async (req, res, next) => { 
  try {
    const newSkillCategory = await createNewSkillCategoryService(req.body)

    res.status(201).json({ message: 'Skill category created successfully', data: newSkillCategory })
  } catch (err) {
    throw new Error('Error creating skill category: ' + err.message);
  }
}

export const getSkillCategoriesController = async (req, res, next) => {
  try {
    const skillCategories = await getSkillCategoriesService()
    res.status(200).json({message: 'Skill categories fetched successfully', data: skillCategories})
  } catch (err) {
    throw new Error('Error fetching skill categories: ' + err.message);
  }
}

export const updateSkillCategoryController = async (req, res, next) => {
  try {
    const { skillId } = req.params;
    // console.log(skillId)
    // console.log(req.body)
    const updatedSkillCategory = await updateSkillCategoryService(skillId, req.body);
    res.status(200).json({ message: 'Skill category updated successfully', data: updatedSkillCategory });
  } catch (err) {
    throw new Error('Error updating skill category: ' + err.message);
  }
}

export const deleteSkillCategoryController = async (req, res, next) => {
  try {
    const { skillId } = req.params;
    const deletedSkillCategory = await deleteSkillCategoryService(skillId);
    res.status(200).json({ message: 'Skill category deleted successfully', data: deletedSkillCategory });
  } catch (err) {
    throw new Error('Error deleting skill category: ' + err.message);
  }
}