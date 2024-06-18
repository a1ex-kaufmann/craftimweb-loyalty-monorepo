import { getContract } from 'viem'
import { GetContractInstanceArgs } from './type'
import { contracts } from '../../config/web3'

export const getContractInstance = ({
  name,
  chainId,
  walletClient,
}: GetContractInstanceArgs): any => {
  if (!chainId || !name) {
    return null
  }

  const { address, abi } = contracts[name][chainId]

  return getContract({
    address,
    abi,
    client: walletClient,
  })
}
