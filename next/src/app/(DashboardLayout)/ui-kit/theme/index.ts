import { notification } from './notification'
import { dmSansFont } from '../../styles/fonts'
import { colors } from './colors'
import breakpoints from './breakpoints'

const dark = {
  colors,
  baseStyle: {
    body: {
      background: colors.bg,
      height: '100%',
      boxSizing: 'border-box',
      color: colors.black,
      fontFamily: dmSansFont.style.fontFamily,
      fontWeight: 500,
      fontSize: 14,
    },
    a: {
      textDecoration: 'none',
      outline: 'none',
      cursor: 'pointer',
      color: colors.grayLight,
    },
  },
  notification,
  breakpoints,
} as const

const themes = {
  dark,
  light: {
    ...dark,
  },
} as const

export type TThemesUnion = keyof typeof themes

export type TTheme = typeof themes.dark

export type TColorsUnion = keyof typeof dark.colors

export type NotificationVariants = keyof typeof notification.variants

export { mediaQueries } from './mediaQueries'

export default themes
