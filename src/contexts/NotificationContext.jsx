import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { getNotificationsByUser, markAllNotificationsAsRead, pushNotification } from '../services/notification.service'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    setNotifications(getNotificationsByUser(user?.id))
  }, [user])

  const addNotification = (payload) => {
    if (!user?.id) return
    setNotifications(pushNotification(user.id, payload))
  }

  const markAllRead = () => {
    if (!user?.id) return
    setNotifications(markAllNotificationsAsRead(user.id))
  }

  const unreadCount = notifications.filter((item) => !item.read).length

  const value = useMemo(() => ({
    notifications,
    unreadCount,
    addNotification,
    markAllRead
  }), [notifications, unreadCount])

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotifications must be used within NotificationProvider')
  return context
}