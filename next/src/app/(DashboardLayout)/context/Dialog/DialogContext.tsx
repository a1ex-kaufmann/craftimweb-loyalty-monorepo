import React, { FC, PropsWithChildren, createContext, useContext, useState } from 'react'
import Popup from 'reactjs-popup'
import {
  DialogContextValue,
  DialogProps,
  DialogState,
  DialogUnion,
  OpenModal,
} from './DialogContext.types'
import { Dialog } from '../../components/Dialog'
import { dialogs } from './DialogContext.constants'

const renderDialog = <K extends DialogUnion>({
  name,
  props,
}: {
  name: K
  props: DialogProps[K]
}) => {
  // @ts-ignore: check another way to typed it
  const ModalComponents: FC<DialogProps[K]> = dialogs[name]

  // @ts-ignore: temporary solution
  return <ModalComponents {...props} />
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined)

export const DialogProvider: FC<PropsWithChildren> = ({ children }) => {
  const [dialog, setDialog] = useState<DialogState | null>(null)

  const closeDialog = () => {
    setDialog(null)
    document.body.style.overflow = 'auto'
  }
  const openDialog: OpenModal = args => {
    // @ts-ignore: check another way to typed it
    setDialog(args)
    document.body.style.overflow = 'hidden'
  }

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      {dialog && (
        <Popup
          nested
          overlayStyle={{ zIndex: 50 }}
          onClose={closeDialog}
          key={Date.now()}
          modal
          open={dialog !== null}
        >
          {/* @ts-ignore */}
          <Dialog title={dialog.props.title} isOpen={!!dialog} onClose={closeDialog}>
            {dialog?.name && renderDialog(dialog)}
          </Dialog>
        </Popup>
      )}
    </DialogContext.Provider>
  )
}

export const useDialogContext = (): DialogContextValue => {
  const context = useContext(DialogContext)

  if (!context) {
    throw new Error('useDialogContext must be used within a DialogProvider')
  }

  return context
}
