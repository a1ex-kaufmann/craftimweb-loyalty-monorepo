/* eslint-disable prefer-destructuring */
const breakpoints: {
  readonly ['0']: string
  readonly ['1']: string
  sm?: string
  md?: string
  lg?: string
  xl?: string
} = ['744px', '1430px', '1920px']

// aliases
breakpoints.md = breakpoints[0]
breakpoints.lg = breakpoints[1]
// @ts-ignore: works well
breakpoints.xl = breakpoints[2]

export type Breakpoints = 'sm' | 'md' | 'lg' | 'xl'

export default breakpoints
