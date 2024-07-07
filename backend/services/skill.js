import Skill from '../models/Skill.js';
import User from '../models/User.js';

// a function whihc ensure that every skillcategory exists only once for a user -> if it does not exist it will be created with default values (0) else an error will be given if the category exists more than once

export const createNewSkillService = async (skillData) => {
  try {
    const newSkill = new Skill(skillData);
    await newSkill.save();
    return newSkill;
  } catch (error) {
    throw new Error(`Failed to create a new skill: ${error.message}`);
  }
}

export const createNewSkillsService = async (skillData) => {
  try {
    const newSkills = [];
    for (const data of skillData) {
      const skill = await createNewSkillService(data);
      console.log(skill);
      newSkills.push(skill);
    }
    return newSkills;
  } catch (error) {
    throw new Error(`Failed to create new skills: ${error.message}`);
  }
}

export const addSkillsToUserService = async (userId, skillIds) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { skills: skillIds } },
      { new: true, useFindAndModify: false }
    )
    return user;
  } catch (error) {
    throw new Error(`Failed to add skills to the user: ${error.message}`);
  }
}

export const deleteSkillsService = async (skillId) => {
  try {
    for (const id of skillId) {
      await Skill.findByIdAndDelete(id);
    }
  } catch (error) {
    throw new Error(`Failed to delete the skill: ${error.message}`);
  }
}
  