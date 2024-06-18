import { ContractName } from '../../types'
import type { WalletClient } from 'viem'

export type GetContractInstanceArgs = {
  name: ContractName
  chainId: number
  walletClient: WalletClient
}
