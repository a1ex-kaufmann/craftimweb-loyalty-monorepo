import type { Abi, Address } from 'viem'

export type ContractName = 'mint' | 'ft' | 'royalties' | 'loyalty' | 'erc20' | 'loyaltyFactory' | 'tokenFactory'

export type ContractMap = {
  [key in number]: {
    address: Address
    abi: Abi
  }
}

export type ContractConfig = { address: Address; abi: Abi }
