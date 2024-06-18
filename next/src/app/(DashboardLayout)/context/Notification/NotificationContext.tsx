import { Notification } from '../../components/Notification'
import React, { createContext, useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  NotificationContextValue,
  NotificationProviderProps,
  NotificationType,
} from './NotificationContext.types'

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const addNotification = ({ onClose, ...rest }: NotificationType) => {
    toast(<Notification {...rest} />, {
      onClose,
    })
  }

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <ToastContainer
        position='top-right'
        autoClose={10_000}
        hideProgressBar
        newestOnTop
        closeOnClick={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </NotificationContext.Provider>
  )
}

export const useNotificationContext = (): NotificationContextValue => {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider')
  }

  return context
}
