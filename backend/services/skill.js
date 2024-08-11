import {
  getAllProfilesService,
  updateProfileService,
} from './projectDemandProfile.js'
import { getAllUsersService, updateUserService } from './user.js'
import ProjectDemandProfile from '../models/ProjectDemandProfile.js'
import Skill from '../models/Skill.js'
import SkillCategory from '../models/SkillCategory.js'
import User from '../models/User.js'

// =================================================================================================
// =================================================================================================
// Skill
// =================================================================================================
// =================================================================================================

// Function to create a new skill
export const createNewSkillService = async (skillData) => {
  try {
    const newSkill = new Skill(skillData)
    if (!newSkill) {
      throw new Error('Could not create a new skill')
    }
    await newSkill.save()

    return newSkill
  } catch (err) {
    throw new Error(`Failed to create a new skill: ${err.message}`)
  }
}

// Function to create a set of new skills
// (ensures every category is covered -> if not given default skill with skillPoints 0 is created)
export const createNewSkillsService = async (skillData) => {
  try {
    const categoriesToCreate = [] // categories that need to be created as dummies
    const newSkills = [] // all new skills

    // get all skill categories by name
    const skillCategories = await getSkillCategoriesService()
    const skillCategoriesNames = skillCategories.map(
      (category) => category.name
    )

    // get a list of categories that need to be created as dummies
    // and check if the given categories are valid
    for (const data of skillData) {
      if (skillCategoriesNames.includes(data.skillCategory)) {
        categoriesToCreate.push(data)
        skillCategoriesNames.splice(
          skillCategoriesNames.indexOf(data.skillCategory),
          1
        )
      } else {
        throw new Error(`Invalid skill category: ${data.skillCategory}`)
      }
    }

    // create default skills for the remaining categories
    for (const category of skillCategoriesNames) {
      const data = {
        skillPoints: 0,
        skillCategory: await getIdOfCategory(category),
      }
      const skill = await createNewSkillService(data)
      newSkills.push(skill)
    }

    // create skills from the given data
    for (const data of categoriesToCreate) {
      const { skillPoints, skillCategory } = data
      const skill = await createNewSkillService({
        skillPoints,
        skillCategory: await getIdOfCategory(skillCategory),
      })
      newSkills.push(skill)
    }

    return newSkills
  } catch (err) {
    throw new Error(`Failed to create new skills: ${err.message}`)
  }
}

// Function to add skills to a user
export const addSkillsToUserService = async (
  userId,
  skillIds,
  targetSkillsIds
) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { skills: skillIds, targetSkills: targetSkillsIds } },
      { new: true, useFindAndModify: false }
    )
    if (!user) {
      throw new Error('Could not add skills to user')
    }

    return user
  } catch (err) {
    throw new Error(`Failed to add skills to user: ${err.message}`)
  }
}

// Function to add skills to a project demand profile
export const addSkillsToProfileService = async (profileId, skillIds) => {
  try {
    const profile = await ProjectDemandProfile.findByIdAndUpdate(
      profileId,
      { $push: { targetSkills: skillIds } },
      { new: true, useFindAndModify: false }
    )
    if (!profile) {
      throw new Error('Could not add skills to profile')
    }

    return profile
  } catch (err) {
    throw new Error(`Failed to add skills to the profile: ${err.message}`)
  }
}

// Function to get skills by skill id
export const getSkillBySkillIdService = async (skillId) => {
  try {
    const skill = await Skill.findById(skillId).populate({
      path: 'skillCategory',
      select: 'name maxPoints',
      transform: (doc) =>
        doc == null ? null : { name: doc.name, maxPoints: doc.maxPoints },
      // format of the returned object does not need to include id but requires name and maxPoints data
    })
    if (!skill) {
      throw new Error('Skill not found')
    }

    return skill
  } catch (err) {
    throw new Error(`Failed to get skill: ${err.message}`)
  }
}

// Function to update skill points given skill id and skill points
export const updateSkillPointsBySkillIdService = async (
  skillId,
  skillPoint
) => {
  try {
    // check if skill exists
    const toUpdateSkill = await getSkillBySkillIdService(skillId)
    if (!toUpdateSkill) {
      throw new Error('Skill not found')
    }

    // update skill points
    const updatedSkill = await Skill.findByIdAndUpdate(skillId, skillPoint, {
      new: true,
    })
    if (!updatedSkill) {
      throw new Error('Could not update skill points')
    }

    return updatedSkill
  } catch (err) {
    throw new Error(`Failed to update skill points: ${err.message}`)
  }
}

// Function to delete skills given skill ids
export const deleteSkillsService = async (skillIds) => {
  try {
    for (const id of skillIds) {
      const deletedSkill = await Skill.findByIdAndDelete(id)
      if (!deletedSkill) {
        throw new Error('Skill could not be deleted')
      }
    }
  } catch (err) {
    throw new Error(`Failed to delete the skill: ${err.message}`)
  }
}

// Function to update skills given skill data and existing skill ids
export const updateSkillsService = async (skillData, existingIds) => {
  try {
    // get the skill ids of the existing skills
    const SkillsIds = existingIds.map((skill) => skill._id)

    // get the skill categories of the to be updated skills
    const updateSkillsCategories = skillData.map((skill) => skill.skillCategory)

    // update the skills
    for (const id of SkillsIds) {
      const skill = await getSkillBySkillIdService(id)

      // update the skill points if the category is in the update data
      if (updateSkillsCategories.includes(skill.skillCategory.name)) {
        // get the updated skill points value
        const updatedSkillPoints = skillData.find(
          (updateSkill) =>
            updateSkill.skillCategory === skill.skillCategory.name
        ).skillPoints

        // update the skill points
        await updateSkillPointsBySkillIdService(id, {
          skillPoints: updatedSkillPoints,
        })
      }
    }
  } catch (err) {
    throw new Error(`Failed to update the skills: ${err.message}`)
  }
}

// =================================================================================================
// =================================================================================================
// Skill Category (route: /skill)
// =================================================================================================
// =================================================================================================

// Function to create a new skill category
// requirement: to avoid holes in the data, all employees (skills and targetSkills) and profiles (targetSkills) need to have a default skill of the new category
export const createNewSkillCategoryService = async (categoryData) => {
  try {
    const { name, maxPoints } = categoryData

    // create a new skill category
    const skillCategory = new SkillCategory({ name, maxPoints })
    await skillCategory.save()

    // add to all employees in skills and targetSkills
    // exclude admin since he has no skills
    const allEmployees = (await getAllUsersService()).filter(
      (user) => user.firstName !== 'Admin'
    )

    // create a default skill and targetSkill for each employee
    for (const employee of allEmployees) {
      const skill = await createNewSkillService({
        skillPoints: 0,
        skillCategory: skillCategory._id,
      })
      const targetSkill = await createNewSkillService({
        skillPoints: 0,
        skillCategory: skillCategory._id,
      })
      // add the skills to the employee
      await addSkillsToUserService(employee._id, skill._id, targetSkill._id)
    }

    // add to all profiles targetSkills new default skill of the category
    const allProfiles = await getAllProfilesService()
    for (const profile of allProfiles) {
      const targetSkill = await createNewSkillService({
        skillPoints: 0,
        skillCategory: skillCategory._id,
      })

      // add the targetSkill to the profile
      await addSkillsToProfileService(profile._id, targetSkill._id)
    }

    return skillCategory
  } catch (err) {
    throw new Error(`Failed to create a new skill category: ${err.message}`)
  }
}

// Function to get all skill categories
export const getSkillCategoriesService = async () => {
  try {
    const categories = await SkillCategory.find()
    if (!categories) {
      throw new Error('No skill categories found')
    }

    return categories
  } catch (err) {
    throw new Error(`Failed to get skill categories: ${err.message}`)
  }
}

// Function to get max points by category name
export const getMaxPointsByCategory = async (categoryName) => {
  try {
    const category = await SkillCategory.findOne({ name: categoryName })
    if (!category) {
      throw new Error('Category not found')
    }

    return category.maxPoints
  } catch (err) {
    throw new Error(`Failed to get max points for category: ${err.message}`)
  }
}

// Function to get id of category by category name
export const getIdOfCategory = async (categoryName) => {
  try {
    const category = await SkillCategory.findOne({ name: categoryName })
    if (!category) {
      throw new Error('Category not found')
    }

    return category._id
  } catch (err) {
    throw new Error(`Failed to get id of category: ${err.message}`)
  }
}

// Function to delete a skill category
// requirement: to avoid holes in the data, all employees (skills and targetSkills) and profiles (targetSkills) need to have the skills of the category deleted
export const deleteSkillCategoryService = async (categoryId) => {
  try {
    const category = await getSkillCategoryByIdService(categoryId)
    const categoryName = category.name

    // delete from all employees skills and targetSkills
    // exclude admin since he has no skills
    const allEmployees = (await getAllUsersService()).filter(
      (user) => user.firstName !== 'Admin'
    )

    // delete the skills and targetSkills of the category for each employee
    for (const employee of allEmployees) {
      // find the skills and targetSkills of the category
      const deleteSkill = employee.skills.find(
        (skill) => skill.skillCategory === categoryName
      )
      // find the targetSkills of the category
      const deleteTargetSkill = employee.targetSkills.find(
        (skill) => skill.skillCategory === categoryName
      )
      // delete the skills and targetSkills of the category from the employee
      await deleteSkillsService([deleteSkill._id, deleteTargetSkill._id])
      const user = await User.findByIdAndUpdate(
        employee._id,
        {$pull: {skills: deleteSkill._id, targetSkills: deleteTargetSkill._id}},
        {new: true, useFindAndModify: false}
      )
      if (!user) {
        throw new Error('Skills of skill category could not be deleted from user')
      }
    }

    // delete from all profiles
    const allProfiles = await getAllProfilesService()
    for (const profile of allProfiles) {
      // find the targetSkills of the category
      const deleteSkill = profile.targetSkills.find(
        (skill) => skill.skillCategory === categoryName
      )
      // delete the targetSkills of the category
      await deleteSkillsService([deleteSkill._id])
      //delete the targetSkills of the category from the profile
      const modifiedProfile = await ProjectDemandProfile.findByIdAndUpdate(
        profile._id,
        {$pull: {targetSkills: deleteSkill._id}},
        {new: true, useFindAndModify: false}
      )
      if (!modifiedProfile) {
        throw new Error('Skills of skill category could not be deleted from profile')
      }
    }
    
    // delete the category
    const deletedCategory = await SkillCategory.findByIdAndDelete(categoryId)
    if (!category) {
      throw new Error('Category not found')
    }

    return deletedCategory
  } catch (error) {
    throw new Error(`Failed to delete the category: ${error.message}`)
  }
}

// Function to update a skill category
// requirement: if maxPoints changed -> scale all skills with this category
export const updateSkillCategoryService = async (categoryId, categoryData) => {
  try {
    // if maxPoints changed -> scale all skills with this category
    if (categoryData.maxPoints) {
      // get the category by id
      const category = await getSkillCategoryByIdService(categoryId)

      // update all skills with this category by scaling the skill points
      const skillsToUpdate = await Skill.find({
        skillCategory: categoryId,
      })
      for (const skill of skillsToUpdate) {
        // scale the skill points by dividing the current skill points by the old maxPoints and multiplying by the new maxPoints
        const scaledSkillPoints = Math.floor(
          (skill.skillPoints / category.maxPoints) * categoryData.maxPoints
        )
        await updateSkillPointsBySkillIdService(skill._id, {
          skillPoints: scaledSkillPoints,
        })
      }
    }

    // update the category
    const updatedCategory = await SkillCategory.findByIdAndUpdate(
      categoryId,
      categoryData,
      {
        new: true,
      }
    )
    if (!updatedCategory) {
      throw new Error('Category not found')
    }

    return updatedCategory
  } catch (err) {
    throw new Error(`Failed to update the category: ${err.message}`)
  }
}

// Function to get a skill category by id
export const getSkillCategoryByIdService = async (categoryId) => {
  try {
    const category = await SkillCategory.findById(categoryId)
    if (!category) {
      throw new Error('Category not found')
    }

    return category
  } catch (err) {
    throw new Error(`Failed to get the category: ${err.message}`)
  }
}
