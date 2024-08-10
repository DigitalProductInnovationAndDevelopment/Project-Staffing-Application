import {
  createNewSkillCategoryService,
  getSkillCategoriesService,
  deleteSkillCategoryService,
  updateSkillCategoryService,
} from '../services/skill.js'

export const createNewSkillCategoryController = async (req, res) => {
  try {
    const skillCategoryData = req.body
    const newSkillCategory =
      await createNewSkillCategoryService(skillCategoryData)

    res.status(201).json({
      message: 'Skill category created successfully.',
      data: newSkillCategory,
    })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error creating skill category.', error: err.message })
  }
}

export const getSkillCategoriesController = async (_, res) => {
  try {
    const skillCategories = await getSkillCategoriesService()

    res.status(200).json({
      message: 'Skill categories fetched successfully.',
      data: skillCategories,
    })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error fetching skill categories.', error: err.message })
  }
}

export const updateSkillCategoryController = async (req, res) => {
  try {
    const { skillId } = req.params
    const skillCategoryData = req.body

    const updatedSkillCategory = await updateSkillCategoryService(
      skillId,
      skillCategoryData
    )

    res.status(200).json({
      message: 'Skill category updated successfully.',
      data: updatedSkillCategory,
    })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error updating skill category.', error: err.message })
  }
}

export const deleteSkillCategoryController = async (req, res) => {
  try {
    const { skillId } = req.params

    const deletedSkillCategory = await deleteSkillCategoryService(skillId)

    res.status(200).json({
      message: 'Skill category deleted successfully.',
      data: deletedSkillCategory,
    })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error deleting skill category.', error: err.message })
  }
}
