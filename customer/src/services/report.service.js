import { apiRequest } from './apiClient'

export const REPORT_TYPES = [
  { value: 'product_violation', label: 'Sản phẩm vi phạm' },
  { value: 'seller_behavior', label: 'Hành vi người bán' },
  { value: 'delivery_issue', label: 'Vấn đề giao hàng' },
  { value: 'counterfeit', label: 'Hàng giả/hàng nhái' },
  { value: 'offensive_content', label: 'Nội dung không phù hợp' }
]

export async function createReport(reporterId, payload) {
  return apiRequest('/reports', {
    method: 'POST',
    body: JSON.stringify({
      targetType: payload.targetType,
      targetId: payload.targetId,
      type: payload.type,
      reason: payload.reason,
      description: payload.description,
      evidence: payload.evidence || [],
      priority: payload.priority || 'medium'
    })
  })
}
