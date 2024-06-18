import { NotificationVariants } from '../../ui-kit/theme'
import { ReactNode } from 'react'

export type NotificationType = {
  text?: ReactNode
  variant?: NotificationVariants
  title: ReactNode
  onClick?: VoidFunction
  onClose?: VoidFunction
  button?: ReactNode
  link?: {
    text: string
    url: string
  }
  details?: string
}

export type NotificationContextValue = {
  addNotification: (args: NotificationType) => void
}

export type NotificationProviderProps = {
  autoDismissTimeout?: number
  children: ReactNode
}
