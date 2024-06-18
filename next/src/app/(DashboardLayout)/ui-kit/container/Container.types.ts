import { PropsWithChildren } from 'react'
import type { FlexProps, FlexboxProps, LayoutProps, SpaceProps } from 'styled-system'

export type ContainerProps = PropsWithChildren & SpaceProps & LayoutProps & FlexProps & FlexboxProps
