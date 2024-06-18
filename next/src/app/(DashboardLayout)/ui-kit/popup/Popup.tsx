import { FC } from 'react'
import { Box } from '../../ui-kit/box'
import { PopupPros } from './Popup.types'
import { CloseButton, Overlay, PopupBody, PopupInner, PopupStyled } from './Popup.styled'
import Image from 'next/image'

const Popup: FC<PopupPros> = ({ onClickClose, children, title }) => (
  <>
    <PopupStyled>
      <PopupInner>
        <CloseButton onClick={onClickClose}>
          <Image src='/img/close.png' width={16} height={16} alt='' />
        </CloseButton>
        <Box textAlign='center'>{title}</Box>
        <PopupBody>{children}</PopupBody>
      </PopupInner>
    </PopupStyled>
    <Overlay />
  </>
)

export default Popup
