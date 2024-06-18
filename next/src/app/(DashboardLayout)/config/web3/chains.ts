import {
  arbitrum,
  avalanche,
  base,
  bsc,
  celo,
  gnosis,
  moonbeam,
  optimism,
  polygon,
  scroll,
  polygonZkEvm,
  bscTestnet,
  manta,
  zetachain,
} from 'viem/chains'
import { TChain } from '../../types'

export const chains: [TChain, ...TChain[]] = [
  { ...celo, icon: '/img/celo.svg' }, //42220
  { ...optimism, icon: '/img/optimism.svg' }, //10
  { ...avalanche, icon: '/img/avalanche.svg' }, //43114
  { ...polygonZkEvm, icon: '/img/polygon-zkevm.svg' }, //1101
  { ...moonbeam, icon: '/img/moonbeam.svg' }, //1284
  { ...bsc, icon: '/img/bsc.svg' }, //56
  { ...gnosis, icon: '/img/gnosis.svg' }, //100
  { ...arbitrum, icon: '/img/arbitrum.svg' }, //42161
  { ...base, icon: '/img/base.svg' }, //8453
  { ...scroll, icon: '/img/scroll.svg' }, //534352
  { ...polygon, icon: '/img/polygon.svg' }, //137
  { ...manta, icon: '/img/manta.jpeg' }, //169
  { ...zetachain, icon: '/img/zetachain.png' }, //170`
  { ...bscTestnet, icon: '/img/bscTestnet.png' }, //170`
]

// const testnetChains: [TChain, ...TChain[]] = [{ ...bscTestnet, icon: '/img/bsc.svg' }]

// export const chains = testnetChains
