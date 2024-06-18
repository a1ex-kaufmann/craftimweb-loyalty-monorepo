// import { chains, contracts } from '../../config/web3'
// import {
//   CONNECT_WALLET_MESSAGE,
//   HYPER_LANE_EXPLORER_LINK,
//   SOMETHING_WENT_WRONG_ERROR_MESSAGE,
// } from '../../constants'
// import { useNotificationContext } from '../../context/Notification'
// import { useSendTransaction } from '../../hooks/useSendTransaction'
// // import { UseBridgeArgs } from './Hft.types'
// import { useEffect, useState } from 'react'
// import { getProviderByChain, getPublicClientByChainId } from '../../utils/publicClient'
// import { formatEther, parseEther } from 'viem'
// import { useAccount, useSwitchChain } from 'wagmi'

// export const useTokens = (chainId: number) => {
//   const [tokens, setTokens] = useState('0')
//   const publicClient = getPublicClientByChainId(chainId)
//   const { address } = useAccount()
//   const contract = contracts.tokenFactory[chainId]

//   const getTokens = async () => {
//     try {
//       if (!contract?.address) {
//         return
//       }

//       setTokens('')

//       const tokenList = (await publicClient?.readContract({
//         ...contract,
//         functionName: 'getTokens',
//         args: [0, 100],
//       }))

//       console.log(tokenList)

//       // if (!+amount.toString()) {
//       //   return
//       // }

//       // setTokens(formatEther(amount)?.toString())
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   useEffect(() => {
//     if (chainId && address) {
//       void getTokens()
//     }
//   }, [chainId, address])

//   return { tokens, refetch: getTokens }
// }

// // export const useMint = (selectedChainId?: number) => {
// //   const { addNotification } = useNotificationContext()
// //   const { chainId, connector, address } = useAccount()
// //   const { switchChainAsync } = useSwitchChain()
// //   const [isMinting, setIsMinting] = useState(false)
// //   const { sendTransaction } = useSendTransaction()

// //   const mintHandler = async (amount: string) => {
// //     try {
// //       if (!address) {
// //         addNotification({ title: CONNECT_WALLET_MESSAGE })

// //         return
// //       }

// //       if (!amount || +amount <= 0) {
// //         addNotification({ title: 'Enter amount tokens to mint' })

// //         return
// //       }

// //       if (!chainId || !selectedChainId) {
// //         addNotification({ title: 'Choose network' })

// //         return
// //       }

// //       if (selectedChainId !== chainId) {
// //         await switchChainAsync({ chainId: selectedChainId, connector })

// //         return
// //       }

// //       const publicClient = getPublicClientByChainId(selectedChainId)
// //       const contract = contracts.ft[selectedChainId]
// //       setIsMinting(true)

// //       const amountToMint = parseEther(amount)
// //       // console.log(contract)
// //       const fee = (await publicClient?.readContract({
// //         ...contract,
// //         functionName: 'calculateMintFee',
// //         args: [amountToMint],
// //       })) as bigint

// //       // console.log('fee', fee)
// //       // const value = BigNumber(fee.toString()).multipliedBy(1.1)?.toFixed()

// //       const { hash } = await sendTransaction({
// //         contractName: 'ft',
// //         chainId: selectedChainId,
// //         method: 'mint',
// //         args: [address, amountToMint],
// //         params: {
// //           value: fee,
// //         },
// //       })
// //       const provider = getProviderByChain(selectedChainId)
// //       const mint = await provider?.waitForTransaction(hash)

// //       setIsMinting(false)

// //       if (mint?.status === 1) {
// //         addNotification({ title: 'Mint success' })

// //         return
// //       }

// //       addNotification({ title: SOMETHING_WENT_WRONG_ERROR_MESSAGE })
// //     } catch (error: any) {
// //       setIsMinting(false)
// //       console.log(error)

// //       addNotification({ title: 'Mint error', details: error?.details || error?.message })
// //     }
// //   }

// //   return { mintHandler, isMinting }
// // }

// // export const useBridge = () => {
// //   const { addNotification } = useNotificationContext()
// //   const { chainId, connector, address } = useAccount()
// //   const { switchChainAsync } = useSwitchChain()
// //   const { sendTransaction } = useSendTransaction()
// //   const [isBridging, setIsBridging] = useState(false)

// //   const bridgeHandler = async ({ chainFromId, chainToId, amount }: UseBridgeArgs) => {
// //     try {
// //       if (!address) {
// //         addNotification({ title: CONNECT_WALLET_MESSAGE })

// //         return
// //       }

// //       if (!chainFromId) {
// //         addNotification({ title: 'Select current network' })

// //         return
// //       }

// //       if (!chainToId) {
// //         addNotification({ title: 'Select destination network' })

// //         return
// //       }

// //       if (!amount || +amount <= 0) {
// //         addNotification({ title: 'Enter amount tokens to bridge' })

// //         return
// //       }

// //       if (chainFromId !== chainId) {
// //         await switchChainAsync({ chainId: chainFromId, connector })
// //       }

// //       setIsBridging(true)

// //       const publicClient = getPublicClientByChainId(chainFromId)
// //       const contract = contracts.ft[chainFromId]

// //       const provider = getProviderByChain(chainFromId)
// //       const amountToBridge = parseEther(amount)

// //       const fee = (await publicClient?.readContract({
// //         ...contract,
// //         functionName: 'calculateBridgeFee',
// //         args: [amountToBridge, chainToId],
// //       })) as bigint

// //       const { hash } = await sendTransaction({
// //         contractName: 'ft',
// //         chainId: chainFromId,
// //         method: 'bridge',
// //         args: [amountToBridge, chainToId],
// //         params: {
// //           value: fee,
// //         },
// //       })

// //       const bridge = await provider?.waitForTransaction(hash)

// //       setIsBridging(false)

// //       const chainFrom = chains.find(chain => chain.id === chainFromId)?.name
// //       const chainTi = chains.find(chain => chain.id === chainToId)?.name

// //       if (bridge?.status === 1) {
// //         addNotification({
// //           title: `From ${chainFrom} to ${chainTi} success`,
// //           text: 'Status tx on',
// //           link: { url: `${HYPER_LANE_EXPLORER_LINK}${hash}`, text: 'Hyperlane' },
// //         })

// //         return
// //       }

// //       addNotification({ title: SOMETHING_WENT_WRONG_ERROR_MESSAGE })
// //     } catch (error: any) {
// //       setIsBridging(false)
// //       console.log(error)

// //       addNotification({
// //         title: 'Bridge error',
// //         details: error?.details,
// //       })
// //     }
// //   }

// //   return { bridgeHandler, isBridging }
// // }
