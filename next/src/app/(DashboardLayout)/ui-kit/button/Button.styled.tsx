import styled from '@emotion/styled'
import { ButtonProps } from './Button.types'
import { compose, flex, flexbox, layout, position, space } from 'styled-system'
import { setAlpha } from '../../utils'
import { dmSansFont, montserratFont } from '../../styles/fonts'
import { mediaQueries } from '../../ui-kit/theme'
import { colors } from '../../ui-kit/theme/colors'

export const ButtonStyled = styled('button')<ButtonProps>`
  font-size: 20px;
  border-radius: 15px;
  height: 39px;
  font-weight: 700;
  font-family: ${dmSansFont.style.fontFamily};
  &.connect,
  &.filled {
    color: ${({ theme }) => colors.white};
    background: ${({ theme }) => colors.primary};

    ${mediaQueries.minDesktop} {
      transition: 0.15s ease-in-out;
      &:hover {
        background: ${({ theme, disabled }) =>
          disabled ? colors.primary : colors.darkBlue};
      }
    }
  }

  &.filled {
    border: 1px solid ${({ theme }) => setAlpha(colors.white, 0.7)};
  }

  &.outlined {
    background: ${({ theme }) => colors.alpha50};
    border: 1px solid ${({ theme }) => setAlpha(colors.white, 0.7)};
    color: ${({ theme }) => colors.black};
    backdrop-filter: blur(20px);

    ${mediaQueries.minDesktop} {
      transition: 0.15s ease-in-out;
      &:hover {
        background: ${({ theme, disabled }) =>
          disabled ? colors.alpha50 : setAlpha(colors.pink, 0.5)};
      }
    }
  }

  &.connect {
    border: 1px solid rgba(237, 233, 227, 0.3);
    font-family: ${montserratFont.style.fontFamily};
    font-weight: 500;
  }

  ${({ fullWidth }) => fullWidth && 'width:100%;'}

  ${compose(space, layout, flex, position, flexbox)}
  ${({ disabled }) => disabled && `opacity: 0.5; cursor: not-allowed;`}
  ${({ isLoading }) => isLoading && 'cursor: not-allowed;'}
`
