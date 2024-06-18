import breakpoints from './breakpoints'

export const mediaQueries = {
  minTablet: `@media screen and (min-width: ${breakpoints[0]})`,
  minDesktop: `@media screen and (min-width: ${breakpoints[1]})`,
  // @ts-ignore: works well
  minLargeDesktop: `@media screen and (min-width: ${breakpoints[2]})`,
  maxTablet: `@media screen and (max-width: ${Number.parseFloat(breakpoints[0]) - 1}px)`,
  maxDesktop: `@media screen and (max-width: ${Number.parseFloat(breakpoints[1]) - 1}px)`,
  // @ts-ignore: works well
  maxLargeDesktop: `@media screen and (max-width: ${Number.parseFloat(breakpoints[2]) - 1}px)`,
}
