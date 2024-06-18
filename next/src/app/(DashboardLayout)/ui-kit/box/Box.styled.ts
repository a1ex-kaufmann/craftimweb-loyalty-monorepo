import styled from '@emotion/styled'
import { BoxProps } from './Box.types'
import { border, compose, flex, flexbox, layout, position, space, typography } from 'styled-system'
import {colors} from '../../ui-kit/theme/colors'

export const BoxStyled = styled('div')<BoxProps>(
  compose(layout, space, flex, flexbox, layout, position, typography, border),
  ({ theme, bg }) => bg && `background: ${colors[bg]};`,
  ({ cursor }) => cursor && `cursor:${cursor};`,
)
