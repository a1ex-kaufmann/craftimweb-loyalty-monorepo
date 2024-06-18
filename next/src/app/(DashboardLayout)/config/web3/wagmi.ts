import { createClient } from 'viem'
import { http, createConfig } from 'wagmi'

import { chains } from './chains'
import { metamask } from './connectors'

export const wagmiConfig = createConfig({
  chains,
  connectors: [metamask],
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
  ssr: true,
})
