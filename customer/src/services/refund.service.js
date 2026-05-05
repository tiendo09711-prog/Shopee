import { apiRequest } from './apiClient'

let refundCache = []

function normalizeRefund(refund = {}) {
  return {
    ...refund,
    id: refund._id || refund.id,
    orderId: refund.order?._id || refund.order || refund.orderId,
    customerId: refund.customer?._id || refund.customer,
    sellerId: refund.seller?._id || refund.seller
  }
}

export async function loadMyRefunds() {
  const refunds = await apiRequest('/refunds/my')
  refundCache = (refunds || []).map(normalizeRefund)
  return refundCache
}

export function getRefundByOrder(orderId) {
  return refundCache.find((refund) => refund.orderId === orderId)
}

export async function requestRefund(order, customerId, payload) {
  const refund = normalizeRefund(await apiRequest('/refunds', {
    method: 'POST',
    body: JSON.stringify({
      orderId: order.id,
      reason: payload.reason,
      description: payload.description,
      images: payload.images || []
    })
  }))
  refundCache = [refund, ...refundCache.filter((item) => item.id !== refund.id)]
  return refund
}
