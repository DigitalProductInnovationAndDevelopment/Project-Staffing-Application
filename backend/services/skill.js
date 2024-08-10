import Skill from '../models/Skill.js'
import User from '../models/User.js'
import { getAllUsersService, updateUserService } from './user.js'
import ProjectDemandProfile from '../models/ProjectDemandProfile.js'
import SkillCategory from '../models/SkillCategory.js'
import {
  getAllProfilesService,
  updateProfileService,
} from './projectDemandProfile.js'

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
    const skillCategoriesNames = skillCategories.map(
      (category) => category.name
    )
    const categoriesToCreate = []
    const newSkills = []

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

    for (const category of skillCategoriesNames) {
      const data = {
        skillPoints: 0,
        skillCategory: await getIdOfCategory(category),
      }
      const skill = await createNewSkillService(data) //TODO
      newSkills.push(skill)
    }

    for (const data of categoriesToCreate) {
      const { skillPoints, skillCategory } = data
      const skill = await createNewSkillService({
        //TODO
        skillPoints,
        skillCategory: await getIdOfCategory(skillCategory),
      })
      newSkills.push(skill)
    }
    return newSkills
  } catch (error) {
    throw new Error(`Failed to create new skills: ${error.message}`)
  }
}

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
      transform: (doc) =>
        doc == null ? null : { name: doc.name, maxPoints: doc.maxPoints },
    })
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
    // get the skills
    const SkillsIds = existingIds.map((skill) => skill._id)
    const updateSkillsCategories = skillData.map((skill) => skill.skillCategory)

    for (const id of SkillsIds) {
      const skill = await getSkillBySkillIdService(id) //TODO
      if (updateSkillsCategories.includes(skill.skillCategory.name)) {
        const updatedSkillPoints = skillData.find(
          (updateSkill) =>
            updateSkill.skillCategory === skill.skillCategory.name
        ).skillPoints
        await updateSkillPointsBySkillIdService(id, {
          //TODO
          skillPoints: updatedSkillPoints,
        })
      }
    }
  } catch (error) {
    throw new Error(`Failed to update the skills: ${error.message}`)
  }
}

export const createNewSkillCategoryService = async (categoryData) => {
  try {
    const { name, maxPoints } = categoryData
    const skillCategory = new SkillCategory({ name, maxPoints })
    await skillCategory.save()
    // add to all employees in skills and targetSkills
    const allEmployees = (await getAllUsersService()).filter(
      (user) => user.firstName !== 'Admin'
    )
    for (const employee of allEmployees) {
      const skill = await createNewSkillService({
        skillPoints: 0,
        skillCategory: skillCategory._id,
      })
      const targetSkill = await createNewSkillService({
        skillPoints: 0,
        skillCategory: skillCategory._id,
      })
      await addSkillsToUserService(employee._id, skill._id, targetSkill._id)
    }

    const allProfiles = await getAllProfilesService()
    for (const profile of allProfiles) {
      const targetSkill = await createNewSkillService({
        skillPoints: 0,
        skillCategory: skillCategory._id,
      })
      await addSkillsToProfileService(profile._id, targetSkill._id)
    }

    // add to all profiles
    return skillCategory
  } catch (error) {
    throw new Error(`Failed to create a new skill category: ${error.message}`)
  }
}

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
  } catch (error) {
    throw new Error(`Failed to get max points for category: ${error.message}`)
  }
}

export const getIdOfCategory = async (categoryName) => {
  try {
    const category = await SkillCategory.findOne({ name: categoryName })
    return category._id
  } catch (error) {
    throw new Error(`Failed to get id of category: ${error.message}`)
  }
}

export const deleteSkillCategoryService = async (categoryId) => {
  try {
    const category = await SkillCategory.findByIdAndDelete(categoryId)
    if (!category) {
      throw new Error('Category not found')
    }

    const categoryName = await getSkillCategoryByIdService(categoryId).name

    // delete from all employees skills and targetSkills
    const allEmployees = (await getAllUsersService()).filter(
      (user) => user.firstName !== 'Admin'
    )
    for (const employee of allEmployees) {
      const deleteSkill = employee.skills.find(
        (skill) => skill.skillCategory === categoryName
      )
      const deleteTargetSkill = employee.targetSkills.find(
        (skill) => skill.skillCategory === categoryName
      )
      await deleteSkillsService([deleteSkill._id])
      await deleteSkillsService([deleteTargetSkill._id])
      await updateUserService(employee._id, {
        skills: employee.skills.filter(
          (skill) => skill.skillCategory !== categoryName
        ),
        targetSkills: employee.targetSkills.filter(
          (skill) => skill.skillCategory !== categoryName
        ),
      })
    }

    // delete from all profiles
    const allProfiles = await getAllProfilesService()
    for (const profile of allProfiles) {
      const deleteSkill = profile.targetSkills.find(
        (skill) => skill.skillCategory === categoryName
      )

      await deleteSkillsService([deleteSkill._id])

      await updateProfileService(profile._id, {
        targetSkills: profile.targetSkills.filter(
          (skill) => skill.skillCategory !== categoryName
        ),
      })
    }
  } catch (error) {
    throw new Error(`Failed to delete the category: ${error.message}`)
  }
}

export const updateSkillCategoryService = async (categoryId, categoryData) => {
  try {
    // if maxPoints changed -> scale all skills with this category
    if (categoryData.maxPoints) {
      const category = await getSkillCategoryByIdService(categoryId)
      const skillsToUpdate = await Skill.find({ skillCategory: categoryId })
      for (const skill of skillsToUpdate) {
        const scaledSkillPoints = Math.floor(
          (skill.skillPoints / category.maxPoints) * categoryData.maxPoints
        )
        await updateSkillPointsBySkillIdService(skill._id, {
          skillPoints: scaledSkillPoints,
        })
      }
    }

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
