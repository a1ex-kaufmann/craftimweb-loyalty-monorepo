import { chains } from '../config/web3'
import { ethers } from 'ethers'
import { createPublicClient, http } from 'viem'

export const getPublicClientByChainId = (chainId: number) => {
  const chain = chains.find(chain => chain.id === chainId)

  if (!chain) {
    return
  }

  return createPublicClient({
    chain,
    transport: http(),
  })
}

export function getProviderByChain(chainId: number) {
  const chain = chains.find(chain => chain.id === chainId)

  if (!chain) {
    return
  }

  return new ethers.providers.JsonRpcProvider(chain.rpcUrls.default.http[0])
}
