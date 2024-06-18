import styled from '@emotion/styled'
import { mediaQueries } from '../../ui-kit/theme'

export const PopupStyled = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 23;
`

export const PopupInner = styled('div')`
  width: 80%;
  position: relative;
  border-radius: 16px;
  height: auto;
  padding: 10px;
  ${mediaQueries.minDesktop} {
    padding: 20px;
  }
`

export const PopupBody = styled('div')`
  margin-top: 20px;
  height: fit-content;
  overflow-y: auto;
`

export const CloseButton = styled('button')`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 20px;
  height: 20px;
`
export const Overlay = styled('div')`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 22;
`
