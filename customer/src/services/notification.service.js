import { apiRequest } from './apiClient'

function normalizeNotification(item = {}) {
  return {
    ...item,
    id: item._id || item.id
  }
}

export async function getNotificationsByUser() {
  const notifications = await apiRequest('/notifications')
  return (notifications || []).map(normalizeNotification)
}

export function pushNotification(userId, payload) {
  return [{
    id: `local_${Date.now()}`,
    createdAt: new Date().toISOString(),
    read: false,
    ...payload
  }]
}

export async function markAllNotificationsAsRead(userId, notifications = []) {
  await Promise.all(notifications.filter((item) => !item.read && !String(item.id).startsWith('local_')).map((item) => (
    apiRequest(`/notifications/${item.id}/read`, { method: 'PATCH' })
  )))
  return notifications.map((item) => ({ ...item, read: true }))
}
