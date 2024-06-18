'use client';
import { Typography, Grid, CardContent } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import BlankCard from '@/app/(DashboardLayout)/components/shared/BlankCard';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Button } from '../../ui-kit/button'
// import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
// import CustomTextField from '@/app/(DashboardLayout)/components/';

// import { useTokens } from './page.hooks'

import { chains, contracts } from '../../config/web3'
import {
  CONNECT_WALLET_MESSAGE,
  HYPER_LANE_EXPLORER_LINK,
  SOMETHING_WENT_WRONG_ERROR_MESSAGE,
} from '../../constants'
// import { useNotificationContext } from '../../context/Notification'
import { useSendTransaction } from '../../hooks/useSendTransaction'
// import { UseBridgeArgs } from './Hft.types'
import { useEffect, useState } from 'react'
import { getProviderByChain, getPublicClientByChainId } from '../../utils/publicClient'
// import { formatEther, parseEther } from 'viem'
import { useAccount, useSwitchChain } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { useNotificationContext } from '../../context/Notification'


interface TokenData {
  address: string;
  name: string;
  totalSupply: string;
}

// const [tokensList, setTokensList] = useState('')
const selectedChainId = 97;
const useDeploy = () => {
  const { addNotification } = useNotificationContext()
  const { chainId, connector, address } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const [isMinting, setIsMinting] = useState(false)
  const { sendTransaction } = useSendTransaction()

  const deployTokenHandler = async (name: string) => {
    try {
      if (!address) {
        addNotification({ title: CONNECT_WALLET_MESSAGE })

        return
      }

      if (!name) {
        addNotification({ title: 'Введите название токена' })

        return
      }

      // if (!chainId || !selectedChainId) {
      //   addNotification({ title: 'Choose network' })

      //   return
      // }

      if (selectedChainId !== chainId) {
        await switchChainAsync({ chainId: selectedChainId, connector })

        return
      }

      const publicClient = getPublicClientByChainId(selectedChainId)
      const contract = contracts.tokenFactory[selectedChainId]
      setIsMinting(true)

      // const amountToMint = parseEther(amount)
      // console.log(contract)
      const fee = (await publicClient?.readContract({
        ...contract,
        functionName: 'deployERC20Bonuses',
        args: [name],
        blockTag: 'pending',
      })) as bigint

      // console.log('fee', fee)
      // const value = BigNumber(fee.toString()).multipliedBy(1.1)?.toFixed()

      const { hash } = await sendTransaction({
        contractName: 'tokenFactory',
        chainId: selectedChainId,
        method: 'deployERC20Bonuses',
        args: [name],
        params: {
          value: fee,
        },
      })
      const provider = getProviderByChain(selectedChainId)
      const mint = await provider?.waitForTransaction(hash)

      setIsMinting(false)

      if (mint?.status === 1) {
        addNotification({ title: 'Токен задеплоен' })

        return
      }

      addNotification({ title: SOMETHING_WENT_WRONG_ERROR_MESSAGE })
    } catch (error: any) {
      setIsMinting(false)
      console.log(error)

      addNotification({ title: 'Ошибка при создании токена', details: error?.details || error?.message })
    }
  }

  return { deployTokenHandler, isMinting }
}


const getTokens = async () : Promise<[]> => {
  const publicClient = getPublicClientByChainId(selectedChainId)
  // const { address } = useAccount()
  const contract = contracts.tokenFactory[selectedChainId]

  // console.log(contract)

  try {
    if (!contract?.address) {
      return []
    }
    
    const tokenList = (await publicClient?.readContract({
      ...contract,
      functionName: 'getTokens',
      args: [0, 100],
    })) as [];
    // console.log(tokenList)
    return tokenList;

  } catch (error) {
    console.log(error)
  }

  return []
}


const TypographyPage = () => {
  const [data, setData] = useState<TokenData[]>([]);
  const [newTokenName, setNewTokenName] = useState('')
  const { deployTokenHandler, isMinting } = useDeploy()

  useEffect(() => {
    fetchDataFromBackend(); // Вызов функции для получения данных
  }, []);

  async function fetchDataFromBackend() {
    let tokens: any[] = await getTokens();


    let newData: TokenData[] = [];
    tokens[0].forEach((item: any, index: any) => {
      // console.log(item)
      // if (index < 3) {
        newData.push({
          address: tokens[0][index],
          name: tokens[1][index],
          totalSupply: formatEther(tokens[2][index]).toString(),
        });
      // }
    })
    console.log(tokens)
    setData(newData);
  }

  const onClickMintHandler = async () => {
    console.log(newTokenName)
    await deployTokenHandler(newTokenName)
    await fetchDataFromBackend()
  }

  return (
    <PageContainer title="Typography" description="this is Typography">

      <Grid container spacing={3}>
        <Grid item sm={12}>
        {/* <div>
          {data.map((item) => (
            item
            // <p key={item.id}>{item.name}</p>
          ))}
        </div> */}
        <DashboardCard title="Создать новый токен">
            <Grid container spacing={3}>
              <Grid item sm={12}>
              <CustomTextField onChange={(e: any) => setNewTokenName(e.target.value)} label="Название токена"> </CustomTextField>
              <Button onClick={onClickMintHandler}> Создать </Button>
                {/* <BlankCard></BlankCard> */}
              </Grid>
            </Grid>

          </DashboardCard>
          <DashboardCard title="Список токенов-бонусов">
            <Grid container spacing={3}>
                  {data.map((item) => (
              <Grid item sm={15}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h2">{item.name}</Typography>
                    <Typography variant="body1" color="textSecondary">
                    Всего создано: {item.totalSupply}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                    Адрес: {item.address}
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
                  ))}
            </Grid>

          </DashboardCard>
        </Grid>
        
        {/* <Grid item sm={12}>
          <DashboardCard title="Default 1 Text">
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h5" color="textprimary">
                      Text Primary
                    </Typography>

                    <Typography variant="body1" color="textprimary">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h5" color="textSecondary">
                      Text Secondary
                    </Typography>

                    <Typography variant="body1" color="textSecondary">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h5" sx={{ color: (theme) => theme.palette.info.main }}>
                      Text Info
                    </Typography>

                    <Typography variant="body1" sx={{ color: (theme) => theme.palette.info.main }}>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h5" sx={{ color: (theme) => theme.palette.primary.main }}>
                      Text Primary
                    </Typography>

                    <Typography variant="body1" sx={{ color: (theme) => theme.palette.primary.main }}>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h5" sx={{ color: (theme) => theme.palette.warning.main }}>
                      Text Warning
                    </Typography>

                    <Typography variant="body1" sx={{ color: (theme) => theme.palette.warning.main }}>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h5" sx={{ color: (theme) => theme.palette.error.main }}>
                      Text Error
                    </Typography>

                    <Typography variant="body1" sx={{ color: (theme) => theme.palette.error.main }}>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
              <Grid item sm={12}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h5" sx={{ color: (theme) => theme.palette.success.main }}>
                      Text Success
                    </Typography>

                    <Typography variant="body1" sx={{ color: (theme) => theme.palette.success.main }}>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
            </Grid>
          </DashboardCard>
        </Grid> */}
      </Grid >
    </PageContainer>
  );
};

export default TypographyPage;


// const TypographyPage = () => {
//   return (
//     <PageContainer title="Typography" description="this is Typography">

//       <Grid container spacing={3}>
//         <Grid item sm={12}>
//         <input value={tokensList} placeholder='0' />
//           <DashboardCard title="Список токенов-бонусов">
//             <Grid container spacing={3}>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="h1">h1. Heading</Typography>
//                     <Typography variant="body1" color="textSecondary">
//                       font size: 30 | line-height: 45 | font weight: 500
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="h2">h2. Heading</Typography>
//                     <Typography variant="body1" color="textSecondary">
//                       font size: 24 | line-height: 36 | font weight: 500
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="h3">h3. Heading</Typography>

//                     <Typography variant="body1" color="textSecondary">
//                       font size: 21 | line-height: 31.5 | font weight: 500
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="h4">h4. Heading</Typography>

//                     <Typography variant="body1" color="textSecondary">
//                       font size: 18 | line-height: 27 | font weight: 500
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="h5">h5. Heading</Typography>

//                     <Typography variant="body1" color="textSecondary">
//                       font size: 16 | line-height: 24 | font weight: 500
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="h6">h6. Heading</Typography>

//                     <Typography variant="body1" color="textSecondary">
//                       font size: 14 | line-height: 21 | font weight: 500
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="subtitle1">
//                       subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis
//                       tenetur
//                     </Typography>

//                     <Typography variant="body1" color="textSecondary">
//                       font size: 16 | line-height: 28 | font weight: 400
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="subtitle2">
//                       subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis
//                       tenetur
//                     </Typography>

//                     <Typography variant="body1" color="textSecondary">
//                       font size: 14 | line-height: 21 | font weight: 400
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="body1">
//                       body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
//                     </Typography>

//                     <Typography variant="body1" color="textSecondary">
//                       font size: 16 | line-height: 24 | font weight: 400
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="body2">
//                       body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
//                     </Typography>

//                     <Typography variant="body1" color="textSecondary">
//                       font size: 14 | line-height: 20 | font weight: 400
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="caption">
//                       caption. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis
//                       tenetur
//                     </Typography>

//                     <Typography variant="body1" color="textSecondary">
//                       font size: 12 | line-height: 19 | font weight: 400
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="overline">
//                       overline. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis
//                       tenetur
//                     </Typography>

//                     <Typography variant="body1" color="textSecondary">
//                       font size: 12 | line-height: 31 | font weight: 400
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//             </Grid>

//           </DashboardCard>
//         </Grid>
        
//         {/* <Grid item sm={12}>
//           <DashboardCard title="Default 1 Text">
//             <Grid container spacing={3}>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="h5" color="textprimary">
//                       Text Primary
//                     </Typography>

//                     <Typography variant="body1" color="textprimary">
//                       Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="h5" color="textSecondary">
//                       Text Secondary
//                     </Typography>

//                     <Typography variant="body1" color="textSecondary">
//                       Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="h5" sx={{ color: (theme) => theme.palette.info.main }}>
//                       Text Info
//                     </Typography>

//                     <Typography variant="body1" sx={{ color: (theme) => theme.palette.info.main }}>
//                       Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="h5" sx={{ color: (theme) => theme.palette.primary.main }}>
//                       Text Primary
//                     </Typography>

//                     <Typography variant="body1" sx={{ color: (theme) => theme.palette.primary.main }}>
//                       Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="h5" sx={{ color: (theme) => theme.palette.warning.main }}>
//                       Text Warning
//                     </Typography>

//                     <Typography variant="body1" sx={{ color: (theme) => theme.palette.warning.main }}>
//                       Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="h5" sx={{ color: (theme) => theme.palette.error.main }}>
//                       Text Error
//                     </Typography>

//                     <Typography variant="body1" sx={{ color: (theme) => theme.palette.error.main }}>
//                       Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//               <Grid item sm={12}>
//                 <BlankCard>
//                   <CardContent>
//                     <Typography variant="h5" sx={{ color: (theme) => theme.palette.success.main }}>
//                       Text Success
//                     </Typography>

//                     <Typography variant="body1" sx={{ color: (theme) => theme.palette.success.main }}>
//                       Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
//                     </Typography>
//                   </CardContent>
//                 </BlankCard>
//               </Grid>
//             </Grid>
//           </DashboardCard>
//         </Grid> */}
//       </Grid >
//     </PageContainer>
//   );
// };

// export default TypographyPage;
