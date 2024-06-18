import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { LoaderProps } from './Loader.types'
import { colors } from '../../ui-kit/theme/colors'

const ration = keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }

`

export const LoaderStyled = styled('div')<LoaderProps>`
  width: 18px;
  height: 18px;
  border: 5px solid ${({ theme, color = 'white' }) => colors['white']};
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: ${ration} 1s linear infinite;
`
