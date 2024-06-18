import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import type { SendTransaction, UseSendTransaction } from './types'
import { getContractInstance } from '../../utils'
import { encodeFunctionData } from 'viem'

export const useSendTransaction: UseSendTransaction = () => {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { address } = useAccount()

  const sendTransaction: SendTransaction = async ({
    contractName,
    method,
    chainId,
    args,
    params = {},
    contractAddress,
  }) => {
    const contract = getContractInstance({
      chainId,
      name: contractName,
      contractAddress,
      // @ts-ignore works well
      walletClient,
    })

    if (!contract) {
      throw new Error('Contract not found')
    }

    const data = encodeFunctionData({
      abi: contract.abi,
      args,
      functionName: method,
    })

    await publicClient?.call?.({
      blockTag: 'pending',
      account: address,
      data,
      to: contractAddress || contract.address,
      value: params.value ? BigInt(params.value) : undefined,
    })

    const hash = await contract.write[method](args, params)

    return { hash }
  }

  return { sendTransaction }
}
