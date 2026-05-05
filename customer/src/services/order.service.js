import { apiRequest } from './apiClient'

export const ORDER_STATUS = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang chuẩn bị',
  pickup: 'Chờ lấy hàng',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  return_requested: 'Yêu cầu trả hàng',
  refunded: 'Đã hoàn tiền'
}

function normalizeAddress(address = {}) {
  return {
    name: address.fullName || address.name || '',
    phone: address.phone || '',
    fullAddress: address.fullAddress || address.detail || ''
  }
}

function normalizeTimeline(order) {
  if (Array.isArray(order.timeline) && order.timeline.length > 0) {
    return order.timeline.map((step) => ({
      key: step.status,
      status: step.status,
      label: step.label || ORDER_STATUS[step.status] || step.status,
      done: true,
      at: step.changedAt,
      by: step.changedByRole
    }))
  }
  return [{ key: order.status, status: order.status, label: ORDER_STATUS[order.status] || order.status, done: true }]
}

export function normalizeOrder(order = {}) {
  const items = (order.items || []).map((item) => ({
    orderItemId: item._id || item.orderItemId || item.product,
    productId: item.product?._id || item.product,
    slug: item.product?.slug || item.slug || '',
    name: item.name,
    image: item.image || item.product?.images?.[0] || '',
    quantity: Number(item.quantity || 1),
    price: Number(item.price || 0),
    oldPrice: Number(item.oldPrice || item.price || 0),
    variationText: item.variationText || '',
    reviewed: Boolean(item.reviewed)
  }))
  const firstItem = items[0] || {}
  return {
    ...order,
    id: order._id || order.id,
    orderCode: order.orderCode || order.id,
    customerId: order.customer?._id || order.customer,
    sellerId: order.seller?._id || order.seller,
    shopId: order.seller?._id || order.seller,
    shopName: order.seller?.shopName || '',
    items,
    orderItems: items,
    address: normalizeAddress(order.shippingAddress || order.address),
    finalTotal: Number(order.total ?? order.finalTotal ?? 0),
    shippingDiscount: Number(order.shippingDiscount || 0),
    timeline: normalizeTimeline(order),
    productId: firstItem.productId,
    slug: firstItem.slug,
    name: firstItem.name,
    image: firstItem.image,
    quantity: items.reduce((sum, item) => sum + item.quantity, 0),
    price: firstItem.price || 0,
    oldPrice: firstItem.oldPrice || firstItem.price || 0,
    total: Number(order.subtotal || 0),
    variationText: firstItem.variationText || ''
  }
}

export async function getOrdersByUser() {
  const orders = await apiRequest('/orders/my')
  return (orders || []).map(normalizeOrder)
}

export async function getOrderById(orderId) {
  const order = await apiRequest(`/orders/my/${orderId}`)
  return normalizeOrder(order)
}

export async function createOrdersFromCheckout(userId, payload) {
  const selectedProductIds = payload.items.map((item) => item.id)
  const orders = await apiRequest('/orders/checkout', {
    method: 'POST',
    body: JSON.stringify({
      selectedProductIds,
      shippingAddress: {
        fullName: payload.address?.name,
        phone: payload.address?.phone,
        detail: payload.address?.fullAddress,
        fullAddress: payload.address?.fullAddress
      },
      paymentMethod: payload.paymentMethod === 'wallet' || payload.paymentMethod === 'spaylater' ? 'e_wallet' : payload.paymentMethod,
      voucherCode: null
    })
  })
  return (orders || []).map(normalizeOrder)
}

export async function updateOrderStatus(userId, orderId, status, options = {}) {
  if (status === 'cancelled') {
    const order = await apiRequest(`/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason: options.cancelReason || options.note || '' })
    })
    return normalizeOrder(order)
  }
  throw new Error('Trạng thái này cần Seller/Admin cập nhật qua API riêng.')
}
