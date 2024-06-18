import '@emotion/react'
import { TTheme } from '../../ui-kit/theme'

declare module '@emotion/react' {
  export interface Theme extends TTheme {}
}
