import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import { HardhatUserConfig } from "hardhat/types";
import { task } from "hardhat/config";
import "@nomicfoundation/hardhat-verify";
import { config as dotEnvConfig } from "dotenv";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-gas-reporter";
import "hardhat-storage-layout";
import "hardhat-tracer";
import "hardhat-contract-sizer";
import "hardhat-abi-exporter";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";
import 'solidity-docgen';

// import "./scripts/tasks";

dotEnvConfig();

const NO_PRIVATE = "0x0000000000000000000000000000000000000000000000000000000000000000";

const ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || "";
const RINKEBY_TESTNET_RPC_URL = process.env.RINKEBY_TESTNET_RPC_URL || "";
const ROPSTEN_TESTNET_RPC_URL = process.env.ROPSTEN_TESTNET_RPC_URL || "";
const GOERLI_TESTNET_RPC_URL = process.env.GOERLI_TESTNET_RPC_URL || "";
const SEPOLIA_TESTNET_RPC_URL = process.env.SEPOLIA_TESTNET_RPC_URL || "";
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || "";
const POLYGON_TESTNET_RPC_URL = process.env.POLYGON_TESTNET_RPC_URL || "";
const BSC_RPC_URL = process.env.BSC_RPC_URL || "";
const BSC_TESTNET_RPC_URL = process.env.BSC_TESTNET_RPC_URL || "";
const AVALANCHE_RPC_URL = process.env.AVALANCHE_RPC_URL || "";
const AVALANCHE_TESTNET_RPC_URL = process.env.AVALANCHE_TESTNET_RPC_URL || "";
const GNOSIS_RPC_URL = process.env.GNOSIS_RPC_URL || "";
const GNOSIS_TESTNET_RPC_URL = process.env.GNOSIS_TESTNET_RPC_URL || "";
const OPTIMISM_RPC_URL = process.env.OPTIMISM_RPC_URL || "";
const OPTIMISM_TESTNET_RPC_URL = process.env.AVALANCHE_TESTNET_RPC_URL || "";
const ARBITRUM_RPC_URL = process.env.ARBITRUM_RPC_URL || "";
const ARBITRUM_TESTNET_RPC_URL = process.env.ARBITRUM_TESTNET_RPC_URL || "";
const AURORA_RPC_URL = process.env.AURORA_RPC_URL || "";
const AURORA_TESTNET_RPC_URL = process.env.AURORA_TESTNET_RPC_URL || "";
const FANTOM_RPC_URL = process.env.FANTOM_RPC_URL || "";
const FANTOM_TESTNET_RPC_URL = process.env.FANTOM_TESTNET_RPC_URL || "";
const CELO_RPC_URL = process.env.CELO_RPC_URL || "";
const CELO_TESTNET_RPC_URL = process.env.CELO_TESTNET_RPC_URL || "";
const POLYGON_ZKEVM_RPC_URL = process.env.POLYGON_ZKEVM_RPC_URL || "";
const POLYGON_ZKEVM_TESTNET_RPC_URL = process.env.POLYGON_ZKEVM_TESTNET_RPC_URL || "";
const BASE_RPC_URL = process.env.BASE_RPC_URL || "";
const BASE_TESTNET_RPC_URL = process.env.BASE_TESTNET_RPC_URL || "";
const SCROLL_RPC_URL = process.env.SCROLL_RPC_URL || "";
const SCROLL_TESTNET_RPC_URL = process.env.SCROLL_TESTNET_RPC_URL || "";
const MOONBEAM_RPC_URL = process.env.MOONBEAM_RPC_URL || "";
const MOONBEAM_TESTNET_RPC_URL = process.env.MOONBEAM_TESTNET_RPC_URL || "";
const MANTA_RPC_URL = process.env.MANTA_RPC_URL || "";
const MANTA_TESTNET_RPC_URL = process.env.MANTA_TESTNET_RPC_URL || "";
const ZETACHAIN_RPC_URL = process.env.ZETACHAIN_RPC_URL || "";
const ZETACHAIN_TESTNET_RPC_URL = process.env.MANTA_TESTNET_RPC_URL || "";
const SIBERIUM_RPC_URL = process.env.SIBERIUM_RPC_URL || "";
const SIBERIUM_TESTNET_RPC_URL = process.env.SIBERIUM_TESTNET_RPC_URL || "";

const ETHEREUM_EXPLORER_API_KEY = process.env.ETHEREUM_EXPLORER_API_KEY || "";
const POLYGON_EXPLORER_API_KEY = process.env.POLYGON_EXPLORER_API_KEY || "";
const BSC_EXPLORER_API_KEY = process.env.BSC_EXPLORER_API_KEY || "";
const AVALANCHE_EXPLORER_API_KEY = process.env.AVALANCHE_EXPLORER_API_KEY || "";
const GNOSIS_EXPLORER_API_KEY = process.env.GNOSIS_EXPLORER_API_KEY || "";
const OPTIMISM_EXPLORER_API_KEY = process.env.OPTIMISM_EXPLORER_API_KEY || "";
const ARBITRUM_EXPLORER_API_KEY = process.env.ARBITRUM_EXPLORER_API_KEY || "";
const AURORA_EXPLORER_API_KEY = process.env.AURORA_EXPLORER_API_KEY || "";
const FANTOM_EXPLORER_API_KEY = process.env.FANTOM_EXPLORER_API_KEY || "";
const CELO_EXPLORER_API_KEY = process.env.CELO_EXPLORER_API_KEY || "";
const POLYGON_ZKEVM_EXPLORER_API_KEY = process.env.POLYGON_ZKEVM_EXPLORER_API_KEY || "";
const BASE_EXPLORER_API_KEY = process.env.BASE_EXPLORER_API_KEY || "";
const SCROLL_EXPLORER_API_KEY = process.env.SCROLL_EXPLORER_API_KEY || "";
const MOONBEAM_EXPLORER_API_KEY = process.env.MOONBEAM_EXPLORER_API_KEY || "";
const MANTA_EXPLORER_API_KEY = process.env.MANTA_EXPLORER_API_KEY || "";
const ZETACHAIN_EXPLORER_API_KEY = process.env.ZETACHAIN_EXPLORER_API_KEY || "";
const SIBERIUM_EXPLORER_API_KEY = process.env.SIBERIUM_EXPLORER_API_KEY || "";

const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY || NO_PRIVATE;

task("accounts", "Prints accounts", async (_, { ethers }) => {
  await ethers.getSigners().then((signers) => {
    const accounts = signers.map((elem) => {
      return elem.address;
    });
    console.log(accounts);
  });
});

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      // accounts: [{
      //   privateKey: SIGNER_PRIVATE_KEY,
      //   balance: "10000000000000000000000",
      // }],
    },
    eth: {
      url: ETHEREUM_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    rinkeby: {
      url: RINKEBY_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    ropsten: {
      url: ROPSTEN_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    goerli: {
      url: GOERLI_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    sepolia: {
      url: SEPOLIA_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    polygon: {
      url: POLYGON_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    polygonTestnet: {
      url: POLYGON_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    bsc: {
      url: BSC_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    bscTestnet: {
      url: BSC_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    avax: {
      url: AVALANCHE_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    avaxTestnet: {
      url: AVALANCHE_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    gnosis: {
      url: GNOSIS_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    gnosisTestnet: {
      url: GNOSIS_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    optimism: {
      url: OPTIMISM_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    optimismTestnet: {
      url: OPTIMISM_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    arbitrum: {
      url: ARBITRUM_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    arbitrumTestnet: {
      url: ARBITRUM_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    aurora: {
      url: AURORA_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    auroraTestnet: {
      url: AURORA_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    fantom: {
      url: FANTOM_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    fantomTestnet: {
      url: FANTOM_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    celo: {
      url: CELO_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    celoTestnet: {
      url: CELO_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    polygonZkevm: {
      url: POLYGON_ZKEVM_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    polygonZkevmTestnet: {
      url: POLYGON_ZKEVM_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    base: {
      url: BASE_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    baseTestnet: {
      url: BASE_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    scroll: {
      url: SCROLL_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    scrollTestnet: {
      url: SCROLL_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    moonbeam: {
      url: MOONBEAM_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    moonbeamTestnet: {
      url: MOONBEAM_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    manta: {
      url: MANTA_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    mantaTestnet: {
      url: MANTA_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    zetachain: {
      url: ZETACHAIN_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    zetachainTestnet: {
      url: ZETACHAIN_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    siberium: {
      url: SIBERIUM_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
    siberiumTestnet: {
      url: SIBERIUM_TESTNET_RPC_URL,
      accounts: [SIGNER_PRIVATE_KEY],
    },
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: {
      mainnet: ETHEREUM_EXPLORER_API_KEY,
      polygon: POLYGON_EXPLORER_API_KEY,
      bsc: BSC_EXPLORER_API_KEY,
      bscTestnet: BSC_EXPLORER_API_KEY,
      avalanche: AVALANCHE_EXPLORER_API_KEY,
      avalancheFujiTestnet: AVALANCHE_EXPLORER_API_KEY,
      arbitrumOne: ARBITRUM_EXPLORER_API_KEY,
      arbitrumSepolia: ARBITRUM_EXPLORER_API_KEY,
      aurora: AURORA_EXPLORER_API_KEY,
      opera: FANTOM_EXPLORER_API_KEY,
      celo: CELO_EXPLORER_API_KEY,
      gnosis2: GNOSIS_EXPLORER_API_KEY,
      xdai: GNOSIS_EXPLORER_API_KEY,
      optimisticEthereum: OPTIMISM_EXPLORER_API_KEY,
      polygonZkEVM: POLYGON_ZKEVM_EXPLORER_API_KEY,
      base: BASE_EXPLORER_API_KEY,
      scroll: SCROLL_EXPLORER_API_KEY,
      moonbeam: MOONBEAM_EXPLORER_API_KEY,
      manta: MANTA_EXPLORER_API_KEY,
      mantaTestnet: MANTA_EXPLORER_API_KEY,
      zetachain: ZETACHAIN_EXPLORER_API_KEY,
      zetachainTestnet: ZETACHAIN_EXPLORER_API_KEY,
      siberiumTestnet: SIBERIUM_EXPLORER_API_KEY,
      siberium: SIBERIUM_EXPLORER_API_KEY,
    },
    customChains: [
      {
        network: "celo",
        chainId: 42220,
        urls: {
          apiURL: "https://api.celoscan.io/api",
          browserURL: "https://celoscan.io/",
        },
      },
      {
        network: "scroll",
        chainId: 534352,
        urls: {
          apiURL: "https://api.scrollscan.com/api",
          browserURL: "https://scrollscan.com",
        },
      },
      {
        network: "manta",
        chainId: 169,
        urls: {
          apiURL: "https://pacific-explorer.manta.network/api/",
          browserURL: "https://pacific-explorer.manta.network/",
        },
      },
      {
        network: "zetachain",
        chainId: 7000,
        urls: {
          apiURL: "https://explorer.zetachain.com/api",
          browserURL: "https://explorer.zetachain.com/",
        },
      },
      {
        network: "siberiumTestnet",
        chainId: 111000,
        urls: {
          apiURL: "https://explorer.test.siberium.net/api",
          browserURL: "https://explorer.test.siberium.net/",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
  typechain: {
    target: "ethers-v6",
  },
  abiExporter: {
    path: "./out/abi",
    // runOnCompile: true,
    // clear: true,
    // flat: true,
    // only: [':ERC20$'],
    // spacing: 2,
    // pretty: true,
    // format: "minimal",
  },
  docgen: {
    outputDir: 'docgen/generated/',
    pages: 'files',
    templates: 'docgen/templates/',
    exclude: ['mock', 'interface', 'lib']
  }
};

export default config;
