import apiResponse from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import * as notificationService from '../services/notification.service.js'

export const listMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationService.listMyNotifications(req.user._id)
  res.json(apiResponse(notifications, 'Notifications loaded successfully'))
})

export const markRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markRead(req.user._id, req.params.id)
  res.json(apiResponse(notification, 'Notification marked as read'))
})
