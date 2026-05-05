import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorRole: String,
  action: String,
  entityType: String,
  entityId: mongoose.Schema.Types.ObjectId,
  before: Object,
  after: Object,
  note: String,
  ip: String,
  userAgent: String,
  createdAt: { type: Date, default: Date.now }
}, { versionKey: false })

auditLogSchema.index({ actor: 1 })
auditLogSchema.index({ entityType: 1, entityId: 1 })
auditLogSchema.index({ createdAt: -1 })

export default mongoose.model('AuditLog', auditLogSchema)
