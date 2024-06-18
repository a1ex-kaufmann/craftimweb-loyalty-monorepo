import { connectors } from '../../config/web3'
import { CONNECT_WALLET_MESSAGE, USER_REJECTED_REQUEST_ERROR_MESSAGE } from '../../constants'
import { useDialogContext } from '../../context/Dialog'
import { useNotificationContext } from '../../context/Notification'
import { Box } from '../../ui-kit/box'
import { Button } from '../../ui-kit/button'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import { shortAddress } from '../../utils'
import { UserRejectedRequestError } from 'viem'
import { useAccount, useDisconnect } from 'wagmi'

const ConnectButton: FC = () => {
  const { address, connector } = useAccount()
  const { disconnectAsync } = useDisconnect()
  const [isMounted, setIsMounted] = useState(false)
  const { addNotification } = useNotificationContext()
  const { openDialog, closeDialog } = useDialogContext()
  const connectorImage = connector && connectors.find(el => el.id === connector.id)?.icon

  const onConfirmDisconnect = async () => {
    try {
      await disconnectAsync()
      closeDialog()
    } catch {}
  }

  const onClickHandler = () => {
    try {
      if (address) {
        openDialog({
          name: 'confirm',
          props: { title: 'Отключить кошелек?', onConfirm: onConfirmDisconnect },
        })

        return
      }

      openDialog({
        name: 'connectWallet',
        props: { title: CONNECT_WALLET_MESSAGE },
      })
    } catch (error) {
      console.log(error)

      if (error instanceof UserRejectedRequestError) {
        addNotification({
          title: USER_REJECTED_REQUEST_ERROR_MESSAGE,
        })
      }
    }
  }

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
    }
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Button width='217px' flexShrink={0} variant='connect' onClick={onClickHandler}>
      {address ? (
        <Box display='flex' alignItems='center' justifyContent='center'>
          {connectorImage && (
            <Image
              src={connectorImage}
              width={30}
              height={30}
              style={{ borderRadius: 50, marginRight: 10 }}
              alt=''
            />
          )}
          {shortAddress(address)}
        </Box>
      ) : (
        'Metamask'
      )}
    </Button>
  )
}

export default ConnectButton
