import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Box } from '../../ui-kit/box'
import { setAlpha } from '../../utils'
import { borderRadius, compose, layout, space } from 'styled-system'

const Shimmer = keyframes`
  0%{
    transform: translateX(-100%);
  }
  50%{
    transform: translateX(100%);
  }
  100%{
    transform: translateX(-100%);
  }
`

export const SkeletonStyled = styled(Box)`
  position: relative;
  background: ${({ theme }) => setAlpha(theme.colors.gray, 0.2)};
  overflow: hidden;
  border-radius: 8px;
  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.2) 20%,
      rgba(255, 255, 255, 0.5) 60%,
      rgba(255, 255, 255, 0)
    );
    animation: ${Shimmer} 2s infinite;
    content: '';
  }
  ${compose(space, layout, borderRadius)}
`
