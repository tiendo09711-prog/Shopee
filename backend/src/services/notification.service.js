import Notification from '../models/Notification.js'

export async function listMyNotifications(userId) {
  return Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean()
}

export async function markRead(userId, notificationId) {
  return Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  )
}
