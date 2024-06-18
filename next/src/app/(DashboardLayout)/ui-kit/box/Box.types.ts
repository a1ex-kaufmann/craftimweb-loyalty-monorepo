import { HTMLElementClick } from '../../types'
import { TColorsUnion } from '../../ui-kit/theme'
import { ElementType, PropsWithChildren } from 'react'
import type {
  BorderProps,
  FlexProps,
  FlexboxProps,
  LayoutProps,
  PositionProps,
  SpaceProps,
  TypographyProps,
} from 'styled-system'

export type BoxProps = PropsWithChildren &
  TypographyProps &
  LayoutProps &
  BorderProps &
  FlexProps &
  FlexboxProps &
  PositionProps &
  SpaceProps & {
    onClick?: HTMLElementClick
    bg?: TColorsUnion
    as?: ElementType<any>
    cursor?: 'pointer' | 'auto'
  }
