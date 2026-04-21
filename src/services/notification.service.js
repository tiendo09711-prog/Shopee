import { getStorageValue, setStorageValue } from '../utils/storage'

const NOTIFICATION_KEY = 'shopee_clone_notifications'

function getAllNotifications() {
  return getStorageValue(NOTIFICATION_KEY, {})
}

function saveAllNotifications(data) {
  setStorageValue(NOTIFICATION_KEY, data)
}

export function getNotificationsByUser(userId) {
  if (!userId) return []
  return getAllNotifications()[userId] || []
}

export function pushNotification(userId, payload) {
  if (!userId) return []
  const all = getAllNotifications()
  const current = all[userId] || []
  const item = {
    id: `ntf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    read: false,
    ...payload
  }
  all[userId] = [item, ...current]
  saveAllNotifications(all)
  return all[userId]
}

export function markAllNotificationsAsRead(userId) {
  if (!userId) return []
  const all = getAllNotifications()
  all[userId] = (all[userId] || []).map((item) => ({ ...item, read: true }))
  saveAllNotifications(all)
  return all[userId]
}