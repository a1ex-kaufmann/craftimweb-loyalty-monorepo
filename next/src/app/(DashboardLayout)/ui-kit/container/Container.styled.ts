import { compose, flex, flexbox, layout, space } from 'styled-system'
import styled from '@emotion/styled'
import { ContainerProps } from './Container.types'

export const ContainerStyled = styled('div')<ContainerProps>`
  ${compose(layout, space, flex, flexbox)}
`
