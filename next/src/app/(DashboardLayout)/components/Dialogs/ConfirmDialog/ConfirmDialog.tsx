import { FC } from 'react'
import { ConfirmDialogProps } from './ConfirmDialog.types'
import { Buttons, MainStyled } from './ConfirmDialog.styled'
import { useDialogContext } from '../../../context/Dialog'
import { Button } from '../../../ui-kit/button'

const ConfirmDialog: FC<ConfirmDialogProps> = ({ onConfirm }) => {
  const { closeDialog } = useDialogContext()

  return (
    <MainStyled>
      <Buttons>
        <Button fullWidth onClick={onConfirm}>
          ОК
        </Button>
        <Button variant='outlined' fullWidth onClick={closeDialog}>
          Закрыть
        </Button>
      </Buttons>
    </MainStyled>
  )
}

export default ConfirmDialog
