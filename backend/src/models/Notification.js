import mongoose from 'mongoose'
import { NOTIFICATION_TYPES } from '../constants/statuses.js'

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, default: '' },
  type: { type: String, enum: NOTIFICATION_TYPES, default: 'system' },
  data: { type: Object, default: {} },
  read: { type: Boolean, default: false }
}, { timestamps: true })

notificationSchema.index({ user: 1, read: 1 })
notificationSchema.index({ createdAt: -1 })

export default mongoose.model('Notification', notificationSchema)
