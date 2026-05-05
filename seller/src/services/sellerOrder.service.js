import { apiRequest } from './apiClient'

export const ORDER_STATUS_LABELS = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang chuẩn bị',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  return_requested: 'Yêu cầu trả hàng',
  refunded: 'Đã hoàn tiền',
}

export async function getSellerOrders(sellerId, query = {}) {
  const params = new URLSearchParams()
  if (query.status && query.status !== 'all') params.set('status', query.status)
  const qs = params.toString()
  return apiRequest(`/seller/orders${qs ? `?${qs}` : ''}`)
}

export async function getSellerOrderById(sellerId, orderId) {
  return apiRequest(`/seller/orders/${orderId}`)
}

export async function updateSellerOrderStatus(sellerId, orderId, nextStatus, options = {}) {
  return apiRequest(`/seller/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: nextStatus, note: options.cancelReason || '' }),
  })
}
