import { FC } from 'react'
import { MainStyled } from './ConnectWalletDialog.styled'
import { type Connector, useConnect } from 'wagmi'
import { Button } from '../../../ui-kit/button'
import Image from 'next/image'
import { connectors } from '../../../config/web3'
import { useDialogContext } from '../../../context/Dialog'
import { useNotificationContext } from '../../../context/Notification'

const ConnectWalletDialog: FC = () => {
  const { connectAsync, connectors: connectorsUsers } = useConnect()
  const { closeDialog } = useDialogContext()
  const { addNotification } = useNotificationContext()

  const onClickHandler = async (connector: Connector) => {
    const findConnector = connectorsUsers.find(c => c.id === connector.id)

    if (!findConnector) {
      addNotification({ title: 'Cannot connect wallet' })

      return
    }

    try {
      await connectAsync({
        chainId: 1,
        connector: findConnector,
      })

      closeDialog()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <MainStyled>
      {connectors.map(connector => (
        <Button
          height={60}
          width='100%'
          variant='outlined'
          key={connector.name}
          // @ts-ignore works well
          onClick={() => onClickHandler(connector)}
        >
          <Image
            src={connector.icon}
            alt={connector.name}
            width={30}
            height={30}
            style={{ borderRadius: 50, marginRight: 10 }}
          />
          <span>{connector.name}</span>
        </Button>
      ))}
    </MainStyled>
  )
}
export default ConnectWalletDialog
