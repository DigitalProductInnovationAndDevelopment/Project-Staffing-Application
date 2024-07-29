import { ObjectId } from 'mongodb'

export function removeDuplicateObjectIDs(objectIDs) {
  let uniqueIDs = new Set()
  for (let id of objectIDs) {
    uniqueIDs.add(id.toString())
  }
  
  return Array.from(uniqueIDs).map((id) => new ObjectId(id))
}

// export const getSkillsWithTargetPointsAndDelta = async (skills, targetSkills) => {
//   // console.log('skills:')
//   // console.log(skills)
//   // console.log('targetSkills:')
//   // console.log(targetSkills)

//   let updatedSkills = []
//   for (const skill of skills) {
//     for (const target of targetSkills) {
//       if (skill.skillCategory.name === target.skillCategory.name) {
//         const targetSkillPoints = target.skillPoints
//         // console.log('targetSkillPoints:')
//         // console.log(targetSkillPoints)
//         const delta = targetSkillPoints - skill.skillPoints
//         // console.log('delta:')
//         // console.log(delta)
//         const {skillCategory, maxSkillPoints, ...rest} = skill
//         const categoryName = skillCategory.name
//         updatedSkills.push({
//           ...rest,
//           skillCategory: categoryName,
//           maxSkillPoints: maxSkillPoints,
//           targetSkillPoints: targetSkillPoints,
//           delta: delta,
//         })
//       }
//     }
//   }
//   // console.log('updatedSkills:')
//   // console.log(updatedSkills)
//   return updatedSkills
// }

// export const getSkillsWithSkillCategory = async (skills) => {
//   let updatedSkills = []
//   for (const skill of skills) {
//     const {skillCategory, ...rest} = skill
//     const categoryName = skillCategory.name
//     updatedSkills.push({
//       ...rest,
//       skillCategory: categoryName,
//     })
//   }
//   // console.log('updatedSkills:')
//   // console.log(updatedSkills)
//   return updatedSkills
// }

// export const getSkillCategoriesForProfile = async (skills) => {
//   let updatedSkills = []
//   for (const skill of skills) {
//     const {skillCategory, ...rest} = skill
//     const categoryName = skillCategory.name
//     updatedSkills.push({
//       ...rest,
//       skillCategory: categoryName,
//     })
//   }
//   // console.log('updatedSkills:')
//   // console.log(updatedSkills)
//   return updatedSkills
// }
