import Contract from '../models/Contract.js'
import { updateContractService } from '../services/contract.js'

describe('updateContractService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should update a contract with valid contract ID and patch data', async () => {
    const contractId = 'contractId123'
    const updateData = {
      startDate: '2022-01-01',
      weeklyWorkingHours: 40,
    }

    Contract.findByIdAndUpdate = jest.fn().mockResolvedValue(updateData)

    const updatedContract = await updateContractService(contractId, updateData)

    expect(updatedContract).toEqual(updateData)
  })

  it('should throw an error if contract is not found', async () => {
    const contractId = 'nonexistentContractId'
    const updateData = {
      startDate: '2022-01-01',
      weeklyWorkingHours: 40,
    }

    Contract.findByIdAndUpdate = jest.fn().mockResolvedValue(null)

    await expect(updateContractService(contractId, updateData)).rejects.toThrow(
      'Contract not found'
    )
  })

  it('should throw an error if failed to update contract', async () => {
    const contractId = 'contractId123'
    const updateData = {
      startDate: '2022-01-01',
      weeklyWorkingHours: 40,
    }

    Contract.findByIdAndUpdate = jest
      .fn()
      .mockRejectedValue(new Error('Some error'))

    await expect(updateContractService(contractId, updateData)).rejects.toThrow(
      'Failed to update contract: Some error'
    )
  })
})
