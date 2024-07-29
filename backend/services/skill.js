import { get } from 'mongoose'
import Skill from '../models/Skill.js'
import User from '../models/User.js'
import { deleteUserService } from './user.js'
import ProjectDemandProfile from '../models/ProjectDemandProfile.js'
import SkillCategory from '../models/SkillCategory.js'

export const createNewSkillService = async (skillData) => {
  try {
    const newSkill = new Skill(skillData)
    await newSkill.save()
    return newSkill
  } catch (error) {
    throw new Error(`Failed to create a new skill: ${error.message}`)
  }
}

export const createNewSkillsService = async (skillData) => {
  try {

    const skillCategories = await getSkillCategoriesService()
    // console.log(skillCategories)
    const skillCategoriesNames = skillCategories.map((category) => category.name)
    // console.log(skillCategoriesNames)
    const categoriesToCreate = []
    const newSkills = []

    // console.log("After call:")
    // console.log(skillData) // skillCategory undefined, skillPoints 0
    for (const data of skillData) {
      // console.log("Data:")
      // console.log(data)
      if (skillCategoriesNames.includes(data.skillCategory)) {
        categoriesToCreate.push(data)
        skillCategoriesNames.splice(skillCategoriesNames.indexOf(data.skillCategory), 1);
      } else {
        throw new Error(`Invalid skill category: ${data.skillCategory}`)
      }
    }

    for (const category of skillCategoriesNames) {
      // console.log("Category:")
      // console.log(category)
      const data = {
        skillPoints: 0,
        skillCategory: await getIdOfCategory(category),
        maxSkillPoints: await getMaxPointsByCategory(category),
      }
      const skill = await createNewSkillService(data) //TODO
      newSkills.push(skill)
    }

    for (const data of categoriesToCreate) {
      // console.log("Data:")
      // console.log(data)
      const { skillPoints, skillCategory } = data
      // console.log("Skill category:")
      // console.log(skillCategory)
      // console.log("Skill points:")
      // console.log(skillPoints)
      // console.log(getIdOfCategory(skillCategory))
      // console.log("Max points:")
      // console.log(await getMaxPointsByCategory(skillCategory))
      const skill = await createNewSkillService({ //TODO
        skillPoints,
        skillCategory: await getIdOfCategory(skillCategory),
        maxSkillPoints: await getMaxPointsByCategory(skillCategory),
      })
      // console.log("Skill:")
      // console.log(skill)
      newSkills.push(skill)
    }
    return newSkills
  } catch (error) {
    throw new Error(`Failed to create new skills: ${error.message}`)
  }
}

export const addSkillsToUserService = async (userId, skillIds, targetSkillsIds) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { skills: skillIds, targetSkills: targetSkillsIds } },
      { new: true, useFindAndModify: false }
    )
    return user
  } catch (error) {
    throw new Error(`Failed to add skills to the user: ${error.message}`)
  }
}

export const addSkillsToProfileService = async (profileId, skillIds) => {
  try {
    const profile = await ProjectDemandProfile.findByIdAndUpdate(
      profileId,
      { $push: { targetSkills: skillIds } },
      { new: true, useFindAndModify: false }
    )
    // console.log(profile)
    return profile
  } catch (error) {
    throw new Error(`Failed to add skills to the profile: ${error.message}`)
  }
}

export const getSkillBySkillIdService = async (skillId) => {
  try {
    const skill = await Skill.findById(skillId).populate({
      path: 'skillCategory',
      select: 'name maxPoints',
      transform: doc => doc == null ? null : { name: doc.name, maxPoints: doc.maxPoints },
    }
  )
    return skill
  } catch (error) {
    throw new Error(`Failed to get skill: ${error.message}`)
  }
}

export const updateSkillPointsBySkillIdService = async (
  skillId,
  skillPoint
) => {
  try {
    const updatedSkill = await getSkillBySkillIdService(skillId)
    if (!updatedSkill) {
      throw new Error('Skill not found')
    }

    const update = await Skill.findByIdAndUpdate(skillId, skillPoint, {
      new: true,
    })

    return update
  } catch (error) {
    throw new Error(`Failed to update skill points: ${error.message}`)
  }
}

export const deleteSkillsService = async (skillId) => {
  try {
    for (const id of skillId) {
      await Skill.findByIdAndDelete(id)
    }
  } catch (error) {
    throw new Error(`Failed to delete the skill: ${error.message}`)
  }
}

export const updateSkillsService = async (skillData, existingIds) => {
  try {
    // console.log('Updating skills')
    // console.log(skillData)
    // get the skills
    const SkillsIds = existingIds.map((skill) => skill._id)
    // console.log('Existing skills')
    // console.log(SkillsIds)
    const updateSkillsCategories = skillData.map((skill) => skill.skillCategory)
    // console.log("Update skills categories")
    // console.log(updateSkillsCategories)

    for (const id of SkillsIds) {
      const skill = await getSkillBySkillIdService(id) //TODO
      // console.log('Skill')
      // console.log(skill)
      if (updateSkillsCategories.includes(skill.skillCategory.name)) {
        const updatedSkillPoints = skillData.find(
          (updateSkill) => updateSkill.skillCategory === skill.skillCategory.name
        ).skillPoints
        // console.log('Updated skill points')
        // console.log(updatedSkillPoints)
        await updateSkillPointsBySkillIdService(id, { //TODO
          skillPoints: updatedSkillPoints,
        })
        // console.log('Updated skill points')
        // console.log(updatedSkillPoints)
      }
    }
  } catch (error) {
    throw new Error(`Failed to update the skills: ${error.message}`)
  }
}

export const createNewSkillCategoryService = async (categoryData) => {
  try {
    const { name, maxPoints } = categoryData;
    const skillCategory = new SkillCategory({ name, maxPoints });
    await skillCategory.save();
    return skillCategory;
  } catch (error) {
    throw new Error(`Failed to create a new skill category: ${error.message}`);
  }
};

export const getSkillCategoriesService = async () => {
  try {
    const categories = await SkillCategory.find()
    return categories
  } catch (error) {
    throw new Error(`Failed to get skill categories: ${error.message}`)
  }
}

export const getMaxPointsByCategory = async (categoryName) => {
  try {
    const category = await SkillCategory.findOne({ name: categoryName })
    return category.maxPoints
  } 
  catch (error) {
    throw new Error(`Failed to get max points for category: ${error.message}`)
  }
}

export const getIdOfCategory = async (categoryName) => {
  try {
    const category = await SkillCategory.findOne({ name: categoryName })
    return category._id
  } 
  catch (error) {
    throw new Error(`Failed to get id of category: ${error.message}`)
  }
}

export const deleteSkillCategoryService = async (categoryId) => {
  try {
    const category = await SkillCategory.findByIdAndDelete(categoryId)
    if (!category) {
      throw new Error('Category not found')
    }
  } catch (error) {
    throw new Error(`Failed to delete the category: ${error.message}`)
  }
}

export const updateSkillCategoryService = async (categoryId, categoryData) => {
  try {
    const updatedCategory = await SkillCategory.findByIdAndUpdate(categoryId, categoryData, {
      new: true,
    })
    if (!updatedCategory) {
      throw new Error('Category not found')
    }
    return updatedCategory
  } catch (error) {
    throw new Error(`Failed to update the category: ${error.message}`)
  }
}

export const getSkillCategoryByIdService = async (categoryId) => {
  try {
    const category = await SkillCategory.findById(categoryId)
    return category
  } catch (error) {
    throw new Error(`Failed to get the category: ${error.message}`)
  } 
}

// export const getTargetSkillPointsBySkillId = (targetSkills, skillId) => {
//   try{for (const targetSkill of targetSkills) {
//     if (targetSkill.skillId === skillId) {
//       return targetSkill.skillPoints
//     }
//   } }catch (error) {
//     throw new Error(`Failed to get target skill: ${error.message}`)
//   }
// }