import { ContractName, TxParams } from '../../types'
import type { Address } from 'viem'

export type SendTransaction = (props: {
  contractName: ContractName
  args: unknown[]
  method: string
  contractAddress?: Address
  chainId: number
  data?: Address
  params?: TxParams
  /*
   * @TODO add type
   */
}) => Promise<{
  hash: Address
}>

export type UseSendTransaction = () => {
  sendTransaction: SendTransaction
}
