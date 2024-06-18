import { FC, useRef } from 'react'
import { DialogProps } from './Dialog.types'
import { CloseButton, DialogStyled, Title } from './Dialog.styled'
import Image from 'next/image'

const Dialog: FC<DialogProps> = ({ children, isOpen, onClose, title }) => {
  const dialogRef = useRef(null)

  const onCloseHandler = () => {
    onClose()
  }

  return (
    <>
      <DialogStyled ref={dialogRef} isOpen={isOpen}>
        <Title>{title}</Title>
        <CloseButton onClick={onCloseHandler}>
          <Image width={24} height={24} alt='' src='/img/cross.png' />
        </CloseButton>
        {children}
      </DialogStyled>
    </>
  )
}

export default Dialog
