import Contract from '../models/Contract.js'

// Function to update a contract by contract ID and patch data
export const updateContractService = async (contractId, updateData) => {
  try {
    const contract = await Contract.findByIdAndUpdate(contractId, updateData, {
      new: true,
    })
    if (!contract) {
      throw new Error('Contract not found')
    }

    return contract
  } catch (err) {
    throw new Error(`Failed to update contract: ${err.message}`)
  }
}
