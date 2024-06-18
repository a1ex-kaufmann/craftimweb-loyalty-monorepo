import styled from '@emotion/styled'
import { NotificationVariants } from '../../ui-kit/theme'
import { notification } from '../../ui-kit/theme/notification'
import { colors } from '../../ui-kit/theme/colors'

export const NotificationStyled = styled('div')<{ variant: NotificationVariants }>(
  ({ theme, variant }) => notification.variants[variant],
  `
  padding: 11px 20px;
  border-radius: 12px;
  font-size: 20px;
  font-weight:700;

  & a{
    color: #28A0F0;
    text-decoration: underline;
  }
  `,
)

export const Details = styled('div')`
  margin-top: 12px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0s;
  font-size: 14px;
  &.open {
    transition: max-height 0.5s ease-in-out;
    max-height: 1000px;
  }
`

export const ShowDetailButton = styled('button')`
  margin-top: 14px;
  margin-left: auto;
  width: fit-content;
  display: block;
  border-bottom: 1px dashed ${({ theme }) => colors.grayLight};
  font-size: 14px;
`
