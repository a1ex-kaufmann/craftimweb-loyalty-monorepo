import {
  arbitrum,
  avalanche,
  base,
  bsc,
  bscTestnet,
  celo,
  gnosis,
  manta,
  moonbeam,
  optimism,
  polygon,
  polygonZkEvm,
  scroll,
  zetachain,
} from 'viem/chains'
import {
  CONTRACT_FT_ADDRESS,
  // CONTRACT_FT_ADDRESS_TESTNET,
  CONTRACT_NFT_ADDRESS,
  // CONTRACT_NFT_ADDRESS_TESTNET,
  ROYALTIES_ADDRESS,
  // ROYALTIES_ADDRESS_TESTNET,
  ftAbi,
  nftAbi,
  royaltiesAbi,
  // royaltiesTestnetAbi,
} from '../../constants'
import { ContractName, ContractConfig, ContractMap } from '../../types'

import { siberium } from './chains'

const commonNftConfig: ContractConfig = {
  address: CONTRACT_NFT_ADDRESS,
  abi: nftAbi,
}

const commonFtConfig: ContractConfig = {
  address: CONTRACT_FT_ADDRESS,
  abi: ftAbi,
}

const tokenFactoryConfig: ContractConfig = {
  address: "0x3F4F76Fc8A9265a0aE32A1a16346dA03eF297cE3",
  abi: [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "newToken",
          "type": "address"
        }
      ],
      "name": "DeployERC20Bonuses",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name_",
          "type": "string"
        }
      ],
      "name": "deployERC20Bonuses",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "tokens",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "target",
          "type": "address"
        }
      ],
      "name": "getBalances",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "balances",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "cursor",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "howMany",
          "type": "uint256"
        }
      ],
      "name": "getTokens",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "values",
          "type": "address[]"
        },
        {
          "internalType": "string[]",
          "name": "names",
          "type": "string[]"
        },
        {
          "internalType": "uint256[]",
          "name": "totalSupply",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "newCursor",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "cursor",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "howMany",
          "type": "uint256"
        }
      ],
      "name": "getTokensByUser",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "values",
          "type": "address[]"
        },
        {
          "internalType": "string[]",
          "name": "names",
          "type": "string[]"
        },
        {
          "internalType": "uint256[]",
          "name": "totalSupply",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "newCursor",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalERC20Bonuses",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
}

const loyaltyFactoryConfig: ContractConfig = {
  address: "0x4BbD9e63eB8115aaa2DAf3c97767A2744B598cA0",
  abi: [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "newToken",
          "type": "address"
        }
      ],
      "name": "DeployBonusSystem",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name_",
          "type": "string"
        }
      ],
      "name": "deployBonusSystem",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "cursor",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "howMany",
          "type": "uint256"
        }
      ],
      "name": "getLoyalties",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "values",
          "type": "address[]"
        },
        {
          "internalType": "string[]",
          "name": "names",
          "type": "string[]"
        },
        {
          "internalType": "address[]",
          "name": "tokens",
          "type": "address[]"
        },
        {
          "internalType": "uint256",
          "name": "newCursor",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "cursor",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "howMany",
          "type": "uint256"
        }
      ],
      "name": "getLoyaltiesByUser",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "values",
          "type": "address[]"
        },
        {
          "internalType": "string[]",
          "name": "names",
          "type": "string[]"
        },
        {
          "internalType": "address[]",
          "name": "tokens",
          "type": "address[]"
        },
        {
          "internalType": "uint256",
          "name": "newCursor",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalBonusSystem",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
}

const loyaltyConfig: ContractConfig = {
  address: "0x0000000000000000000000000000000000000000",
  abi: [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name_",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "purchaseId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "CancelPurchase",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "accrueBonuses",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "user_abi_in",
          "type": "bytes"
        }
      ],
      "name": "createUser",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "user_abi_out",
          "type": "bytes"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currencyCode",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "currencyDecimals",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "accrualPercent",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "minAccrualThreshold",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "writeoffRate",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "maxWriteoffPercent",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isSimultaneous",
              "type": "bool"
            }
          ],
          "internalType": "struct BonusSystem.Settings",
          "name": "settings",
          "type": "tuple"
        }
      ],
      "name": "editSettings",
      "outputs": [
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "erc1155tokens",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "erc20tokens",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "erc721tokens",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ftToken",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isInitialized",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        }
      ],
      "name": "isUserExist",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "purchase_abi_in",
          "type": "bytes"
        }
      ],
      "name": "makePurchase",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "purchase_abi_out",
          "type": "bytes"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "metadataURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "properties",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "properties_abi",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "purchaseId",
          "type": "uint256"
        }
      ],
      "name": "purchase",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "status",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "target",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "purchase_abi_in",
              "type": "bytes"
            },
            {
              "internalType": "bytes",
              "name": "purchase_abi_out",
              "type": "bytes"
            }
          ],
          "internalType": "struct BonusSystem.Purchase",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "settings",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "settings_abi",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalUsers",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "foreignCard",
          "type": "string"
        }
      ],
      "name": "userByForeignCard",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "target",
          "type": "address"
        }
      ],
      "name": "userDetails",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "user_abi_out",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "version",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
}

const erc20Config: ContractConfig = {
  address: "0x0000000000000000000000000000000000000000",
  abi: [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "burnFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
}

const contractsMainnet: Record<ContractName, ContractMap> = {
  mint: {
    [celo.id]: commonNftConfig,
    [optimism.id]: commonNftConfig,
    [polygonZkEvm.id]: commonNftConfig,
    [moonbeam.id]: commonNftConfig,
    [bsc.id]: commonNftConfig,
    [gnosis.id]: commonNftConfig,
    [arbitrum.id]: commonNftConfig,
    [base.id]: commonNftConfig,
    [scroll.id]: commonNftConfig,
    [polygon.id]: commonNftConfig,
    [avalanche.id]: commonNftConfig,
    [manta.id]: commonNftConfig,
    [zetachain.id]: commonNftConfig,
  },
  ft: {
    [optimism.id]: commonFtConfig,
    [celo.id]: commonFtConfig,
    [polygonZkEvm.id]: commonFtConfig,
    [bsc.id]: commonFtConfig,
    [moonbeam.id]: commonFtConfig,
    [arbitrum.id]: commonFtConfig,
    [polygon.id]: commonFtConfig,
    [base.id]: commonFtConfig,
    [scroll.id]: commonFtConfig,
    [avalanche.id]: commonFtConfig,
    [gnosis.id]: commonFtConfig,
    [manta.id]: commonFtConfig,
    [zetachain.id]: commonFtConfig,
  },
  loyalty: {
    [siberium.id]: loyaltyConfig,
  },
  loyaltyFactory: {
    [siberium.id]: loyaltyFactoryConfig,
  },
  erc20: {
    [siberium.id]: erc20Config,
  },
  tokenFactory: {
    [siberium.id]: tokenFactoryConfig,
  },
  royalties: {
    [scroll.id]: {
      address: ROYALTIES_ADDRESS,
      abi: royaltiesAbi,
    },
  },
  
}

// const contractsTestnet: Record<ContractName, ContractMap> = {
//   mint: {
//     [bscTestnet.id]: {
//       address: CONTRACT_NFT_ADDRESS_TESTNET,
//       abi: nftAbi,
//     },
//   },
//   ft: {
//     [bscTestnet.id]: {
//       address: CONTRACT_FT_ADDRESS_TESTNET,
//       abi: ftAbi,
//     },
//   },
//   royalties: {
//     [bscTestnet.id]: {
//       address: ROYALTIES_ADDRESS_TESTNET,
//       abi: royaltiesTestnetAbi,
//     },
//   },
// }


export const contracts = contractsMainnet
//contractsTestnet
