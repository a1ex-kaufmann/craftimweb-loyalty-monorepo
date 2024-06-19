'use client';
import { Typography, Grid, CardContent } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import BlankCard from '@/app/(DashboardLayout)/components/shared/BlankCard';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Button } from '../../ui-kit/button'

import { chains, contracts } from '../../config/web3'
import {
  CONNECT_WALLET_MESSAGE,
  SOMETHING_WENT_WRONG_ERROR_MESSAGE,
} from '../../constants'
import { useSendTransaction } from '../../hooks/useSendTransaction'
import { useEffect, useState } from 'react'
import { getProviderByChain, getPublicClientByChainId } from '../../utils/publicClient'
import { useAccount, useSwitchChain } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { useNotificationContext } from '../../context/Notification'


interface LoyaltyData {
  address: string;
  name: string;
  token: string;
}

const selectedChainId = 111000;
const useDeploy = () => {
  const { addNotification } = useNotificationContext()
  const { chainId, connector, address } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const [isMinting, setIsMinting] = useState(false)
  const { sendTransaction } = useSendTransaction()

  const mintTokensHandler = async (token: `0x${string}` | string, target: `0x${string}` | undefined) => {
    try {
      if (!address) {
        addNotification({ title: CONNECT_WALLET_MESSAGE })

        return
      }

      if (selectedChainId !== chainId) {
        await switchChainAsync({ chainId: selectedChainId, connector })

        return
      }

      const publicClient = getPublicClientByChainId(selectedChainId)
      let contract = contracts.loyalty[selectedChainId]
      contract.address = `0x${token.replace('0x', '')}`;
      setIsMinting(true)

      const fee = (await publicClient?.readContract({
        ...contract,
        functionName: 'accrueBonuses',
        args: [target, parseEther('10')],
        blockTag: 'pending',
      })) as bigint

      // console.log('fee', fee)
      // const value = BigNumber(fee.toString()).multipliedBy(1.1)?.toFixed()

      const { hash } = await sendTransaction({
        contractName: 'loyalty',
        chainId: selectedChainId,
        method: 'accrueBonuses',
        args: [target, parseEther('10')],
        params: {
          value: fee,
        },
      })
      const provider = getProviderByChain(selectedChainId)
      const mint = await provider?.waitForTransaction(hash)

      setIsMinting(false)

      if (mint?.status === 1) {
        addNotification({ title: 'Бонусные баллы начислены' })

        return
      }

      addNotification({ title: SOMETHING_WENT_WRONG_ERROR_MESSAGE })
    } catch (error: any) {
      setIsMinting(false)
      console.log(error)

      addNotification({ title: 'Ошибка при начислении бонусных баллов', details: error?.details || error?.message })
    }
  }

  return { mintTokensHandler, isMinting }
}


const getLoyalties = async () : Promise<[]> => {
  const publicClient = getPublicClientByChainId(selectedChainId)
  // const { address } = useAccount()
  const contract = contracts.loyaltyFactory[selectedChainId]

  // console.log(contract)

  try {
    if (!contract?.address) {
      return []
    }
    
    const loyaltyList = (await publicClient?.readContract({
      ...contract,
      functionName: 'getLoyalties',
      args: [0, 100],
    })) as [];
    // console.log(tokenList)
    return loyaltyList;

  } catch (error) {
    console.log(error)
  }

  return []
}


const TypographyPage = () => {
  const [data, setData] = useState<LoyaltyData[]>([]);
  const [newLoyaltyName, setNewLoyaltyName] = useState('')
  const [newLoyaltyToken, setNewLoyaltyToken] = useState('')
  const { mintTokensHandler, isMinting } = useDeploy()
  const { address } = useAccount()

  useEffect(() => {
    fetchDataFromBackend(); // Вызов функции для получения данных
  }, []);

  async function fetchDataFromBackend() {
    let tokens: any[] = await getLoyalties();


    let newData: LoyaltyData[] = [];
    tokens[0].forEach((item: any, index: any) => {
      // console.log(item)
      // if (index < 3) {
        newData.push({
          address: tokens[0][index],
          name: tokens[1][index],
          token: tokens[2][index].toString(),
        });
      // }
    })
    console.log(tokens)
    setData(newData);
  }

  const onClickMintHandler = async (token: `0x${string}` | string) => {
    console.log(token)
    await mintTokensHandler(token, address)
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
          <DashboardCard title="Список программ лояльности">
            <Grid container spacing={3}>
                  {data.map((item) => (
              <Grid item sm={15}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h2">{item.name}</Typography>
                    <Typography variant="body1" color="textSecondary">
                    Использующийся токен: {item.token}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                    Адрес: {item.address}
                    </Typography>
                    <Button onClick={() => onClickMintHandler(`${item.address}`)}>Начислить 10 бонусов</Button>
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