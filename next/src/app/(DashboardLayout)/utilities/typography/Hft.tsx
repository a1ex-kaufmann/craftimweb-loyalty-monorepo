// import { PageLayout } from '@components/PageLayout'
// import { FC, useState } from 'react'
// import {
//   ChainsSelects,
//   HyperLaneIcon,
//   MaxButton,
//   NftLine,
//   Title,
//   TokenBridgeCounter,
//   Wrapper,
// } from './Hft.styled'
// import { Box } from '@ui-kit/box'
// import { SelectItemType } from '@components/Select'
// import Image from 'next/image'
// import { chainOptions } from './Hft.constants'
// import { Button } from '@ui-kit/button'
// import { contracts } from '@config/web3'
// import { useBridge, useTokensBalance, useMint } from './page.hooks'
// import dynamic from 'next/dynamic'
// import { ContentCard } from '@components/ContentCard'
// import { ContractAddress } from '@components/ContractAddress'
// import { AmountTokenInput } from '@components/AmountTokenInput'

// const SelectDynamic = dynamic(() => import('../../components/Select/Select'), { ssr: false })

// const Main: FC = () => {
//   const [chainFrom, setChainFrom] = useState<SelectItemType>()
//   const [chainTo, setChainTo] = useState<SelectItemType>()
//   const { tokenBalance, refetch: refetchTokenBalance } = useTokensBalance(
//     chainFrom?.value as number,
//   )
//   const { mintHandler, isMinting } = useMint(chainFrom?.value as number)
//   const { bridgeHandler, isBridging } = useBridge()
//   const [tokensToMint, setTokensToMint] = useState('1000')
//   const [tokensToBridge, setTokensToBridge] = useState('')

//   const setChainFromHandler = (option: SelectItemType) => setChainFrom(option)

//   const setChainToHandler = (option: SelectItemType) => setChainTo(option)

//   const onClickMaxHandler = async () => {
//     await refetchTokenBalance()
//     setTokensToBridge(tokenBalance)
//   }

//   const switchChainsHandler = () => {
//     setChainFrom(chainTo)
//     setChainTo(chainFrom)
//   }

//   const onClickMintHandler = async () => {
//     await mintHandler(tokensToMint)
//   }

//   const onClickBridgeHandler = async () => {
//     await bridgeHandler({
//       chainFromId: chainFrom?.value as number,
//       chainToId: chainTo?.value as number,
//       amount: tokensToBridge,
//     })
//     void refetchTokenBalance()
//   }

//   return (
//     <PageLayout>
//       <Wrapper>
//         <ContentCard>
//           <Box mb={2}>
//             <Title>Step 1: Select blockchains</Title>
//           </Box>
//           <ChainsSelects>
//             <Box width='100%'>
//               <SelectDynamic
//                 selectedOption={chainFrom}
//                 onSelect={setChainFromHandler}
//                 options={chainOptions}
//                 placeholder='Select blockchain'
//                 width='100%'
//               />
//               <ContractAddress address={contracts.ft[chainFrom?.value as number]?.address} />
//             </Box>
//             <Box mx={11} cursor='pointer' onClick={switchChainsHandler}>
//               <Image width={64} height={64} src='/img/switch.png' alt='' />
//             </Box>
//             <Box width='100%'>
//               <SelectDynamic
//                 selectedOption={chainTo}
//                 onSelect={setChainToHandler}
//                 options={chainOptions}
//                 placeholder='Select blockchain'
//                 width='100%'
//               />
//               <ContractAddress address={contracts.ft[chainTo?.value as number]?.address} />
//             </Box>
//           </ChainsSelects>

//           <Box mt={30}>
//             <NftLine>
//               <Title>Step 2: Mint hFT</Title>
//               <TokenBridgeCounter>
//                 Tokens to be minted
//                 <AmountTokenInput value={tokensToMint} onChange={setTokensToMint} placeholder='0' />
//               </TokenBridgeCounter>
//             </NftLine>
//           </Box>
//           <Button width='100%' mt={2} onClick={onClickMintHandler} isLoading={isMinting}>
//             Mint
//           </Button>

//           <NftLine>
//             <Title>Step 3: Bridge hFT</Title>
//             <TokenBridgeCounter>
//               Tokens to be bridged
//               <AmountTokenInput
//                 value={tokensToBridge}
//                 onChange={setTokensToBridge}
//                 placeholder='0'
//               />
//               <MaxButton onClick={onClickMaxHandler}>max</MaxButton>
//             </TokenBridgeCounter>
//           </NftLine>
//           <Button
//             width='100%'
//             variant='outlined'
//             mt={2}
//             isLoading={isBridging}
//             onClick={onClickBridgeHandler}
//           >
//             Bridge
//           </Button>
//           <Box mt={42} textAlign='center'>
//             <Title className='center'>
//               Powered by HyperLane
//               <HyperLaneIcon>
//                 <Image src='/img/hyper-lane.svg' alt='' width={20} height={20} />
//               </HyperLaneIcon>
//             </Title>
//           </Box>
//         </ContentCard>
//       </Wrapper>
//     </PageLayout>
//   )
// }
// export default Main
