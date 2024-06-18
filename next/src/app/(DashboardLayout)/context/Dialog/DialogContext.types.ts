import { ConfirmDialogProps } from '../../components/Dialogs/ConfirmDialog/ConfirmDialog.types'
import { dialogs } from './DialogContext.constants'
import { DialogProps as DialogPropsComponent } from '../../components/Dialog'

export type DialogContextValue = {
  openDialog: (args: DialogState) => void
  closeDialog: VoidFunction
}

export type DialogUnion = keyof typeof dialogs

export type DialogProps = {
  connectWallet: object
  confirm: ConfirmDialogProps
}

export type OpenModal = <T extends DialogUnion>(args: {
  name: T
  props: DialogProps[T] & Pick<DialogPropsComponent, 'title'>
}) => void

export type DialogState = {
  name: DialogUnion
  props: DialogProps[DialogUnion] & Pick<DialogPropsComponent, 'title'>
}
