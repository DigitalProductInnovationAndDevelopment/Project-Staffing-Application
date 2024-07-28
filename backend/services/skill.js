import { get } from 'mongoose'
import Skill from '../models/Skill.js'
import User from '../models/User.js'
import SkillCategory from '../models/enums/SkillCategory.js'
import maxSkillPointsArray from '../utils/maxSkillPoints.js'
import { deleteUserService } from './user.js'
import ProjectDemandProfile from '../models/ProjectDemandProfile.js'

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
    const skillCategories = Array.isArray(SkillCategory)
      ? SkillCategory.map((category) => category.value)
      : Object.values(SkillCategory)
    const categoriesToCreate = []
    const newSkills = []

    for (const data of skillData) {
      if (skillCategories.includes(data.skillCategory)) {
        categoriesToCreate.push(data)
        skillCategories.splice(skillCategories.indexOf(data.skillCategory), 1)
      } else {
        throw new Error(`Invalid skill category: ${data.skillCategory}`)
      }
    }

    for (const category of skillCategories) {
      const data = {
        skillPoints: 0,
        skillCategory: category,
        maxSkillPoints: maxSkillPointsArray[category],
      }
      const skill = await createNewSkillService(data) //TODO
      newSkills.push(skill)
    }

    for (const data of categoriesToCreate) {
      const { skillPoints, skillCategory } = data
      const skill = await createNewSkillService({ //TODO
        skillPoints,
        skillCategory,
        maxSkillPoints: maxSkillPointsArray[skillCategory],
      })
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
    const skill = await Skill.findById(skillId)
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
    const SkillsIds = existingIds
    const updateSkillsCategories = skillData.map((skill) => skill.skillCategory)

    for (const id of SkillsIds) {
      const skill = await getSkillBySkillIdService(id) //TODO
      if (updateSkillsCategories.includes(skill.skillCategory)) {
        const updatedSkillPoints = skillData.find(
          (updateSkill) => updateSkill.skillCategory === skill.skillCategory
        ).skillPoints
        // console.log(updatedSkillPoints)
        await updateSkillPointsBySkillIdService(skill._id, { //TODO
          skillPoints: updatedSkillPoints,
        })
      }
    }
  } catch (error) {
    throw new Error(`Failed to update the skills: ${error.message}`)
  }
}
