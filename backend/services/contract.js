import Contract from '../models/Contract.js'

export const updateContractService = async (contractId, updateData) => {
  try {
    const contract = await Contract.findByIdAndUpdate(contractId, updateData, {
      new: true,
    })
    if (!contract) {
      throw new Error('Contract not found')
    }
    return contract
  }
  catch (error) {
    throw new Error(`Failed to update contract: ${error.message}`)
  }
}