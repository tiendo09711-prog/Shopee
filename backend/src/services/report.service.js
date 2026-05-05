import ApiError from '../utils/apiError.js'
import Report from '../models/Report.js'

export async function createReport(user, payload) {
  const {
    targetType,
    targetId,
    type,
    reason,
    description = '',
    evidence = [],
    priority = 'medium'
  } = payload

  if (!targetType || !targetId || !type || !reason) {
    throw new ApiError(400, 'Report target, type and reason are required')
  }

  return Report.create({
    reporter: user._id,
    targetType,
    targetId,
    type,
    reason,
    description,
    evidence,
    priority,
    auditTrail: [{
      action: 'created',
      note: reason,
      by: user._id,
      at: new Date()
    }]
  })
}

export async function listMyReports(userId) {
  return Report.find({ reporter: userId })
    .sort({ createdAt: -1 })
    .lean()
}
