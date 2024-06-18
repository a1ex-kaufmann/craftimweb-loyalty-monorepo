import { injected, walletConnect as walletConnectConfig } from 'wagmi/connectors'

export const metamask = injected({ target: 'metaMask' })
// export const walletConnect = walletConnectConfig({
//   projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || '',
// })
// export const rabby = injected({ target: 'rabby' })

export const connectors = [
  {
    icon: '/img/metamask-connector.svg',
    name: 'MetaMask',
    connector: metamask,
    type: 'injected',
    id: 'io.metamask',
  },
  // {
  //   icon: '/img/walletconnect-connector.svg',
  //   name: 'WalletConnect',
  //   connector: walletConnect,
  //   type: 'walletConnect',
  //   id: 'walletConnect',
  // },
]
