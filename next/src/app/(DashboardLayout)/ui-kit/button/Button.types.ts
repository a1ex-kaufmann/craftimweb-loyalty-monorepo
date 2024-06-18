import { ButtonClick } from '../../types'
import { PropsWithChildren } from 'react'
import type { FlexProps, FlexboxProps, LayoutProps, PositionProps, SpaceProps } from 'styled-system'

type ButtonVariants = 'outlined' | 'filled' | 'connect'

export type ButtonProps = SpaceProps &
  FlexProps &
  PositionProps &
  LayoutProps &
  FlexboxProps &
  PropsWithChildren<{
    onClick?: ButtonClick
    isDisabled?: boolean
    variant?: ButtonVariants
    type?: 'submit'
    value?: string | number
    isLoading?: boolean
    fullWidth?: boolean
  }>
