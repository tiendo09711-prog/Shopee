import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { getNotificationsByUser, markAllNotificationsAsRead, pushNotification } from '../services/notification.service'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    let active = true
    if (!user?.id) {
      setNotifications([])
      return undefined
    }
    getNotificationsByUser(user.id)
      .then((items) => {
        if (active) setNotifications(items)
      })
      .catch(() => {
        if (active) setNotifications([])
      })
    return () => {
      active = false
    }
  }, [user])

  const addNotification = (payload) => {
    if (!user?.id) return
    setNotifications((prev) => [...pushNotification(user.id, payload), ...prev])
  }

  const markAllRead = async () => {
    if (!user?.id) return
    const next = await markAllNotificationsAsRead(user.id, notifications)
    setNotifications(next)
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
