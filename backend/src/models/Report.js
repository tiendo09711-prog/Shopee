import mongoose from 'mongoose'
import { REPORT_PRIORITIES, REPORT_STATUSES, REPORT_TARGET_TYPES, REPORT_TYPES } from '../constants/statuses.js'

const auditTrailSchema = new mongoose.Schema({
  action: String,
  note: String,
  by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  at: { type: Date, default: Date.now }
}, { _id: false })

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: REPORT_TARGET_TYPES, required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  type: { type: String, enum: REPORT_TYPES, required: true },
  reason: { type: String, required: true },
  description: { type: String, default: '' },
  evidence: { type: [String], default: [] },
  status: { type: String, enum: REPORT_STATUSES, default: 'open' },
  priority: { type: String, enum: REPORT_PRIORITIES, default: 'medium' },
  auditTrail: [auditTrailSchema]
}, { timestamps: true })

reportSchema.index({ reporter: 1 })
reportSchema.index({ targetType: 1, targetId: 1 })
reportSchema.index({ status: 1 })

export default mongoose.model('Report', reportSchema)
