import styled from '@emotion/styled'
import { mediaQueries } from '../../ui-kit/theme'
import { colors } from '../../ui-kit/theme/colors'

export const DialogStyled = styled('div')<{ isOpen: boolean; isShort?: number }>`
  position: absolute;
  width: 100%;
  padding: 23px 18px 38px;
  transform: none;
  border-radius: 10px;
  position: relative;
  border-radius: 10px;
  background: ${({ theme }) => colors.bg};
  min-width: 100vw;
  height: 100vh;
  ${mediaQueries.minTablet} {
    height: auto;
    min-width: auto;
    margin: 0 auto;
    max-width: 700px;
    width: 100vw;
    padding: 33px 28px 58px;
  }
`
export const CloseButton = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  position: absolute;
  top: 14px;
  right: 14px;
  border-radius: 3px;
  cursor: pointer;
`

export const Title = styled('div')`
  max-width: 350px;
  width: 100%;
  margin: 0 auto 24px;
  padding-bottom: 24px;
  text-align: center;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;
  text-align: center;
  border-bottom: 1px solid #e0e1e2;
`

export const Body = styled('div')`
  max-height: 400px;
  overflow-y: auto;
`
