import styled from '@emotion/styled'
import { mediaQueries } from '../../../ui-kit/theme'

export const MainStyled = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${mediaQueries.minTablet} {
    flex-direction: row;
  }
`
