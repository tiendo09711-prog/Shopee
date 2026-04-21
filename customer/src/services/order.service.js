import { getStorageValue, setStorageValue } from '../utils/storage'

const ORDERS_KEY = 'shopee_clone_orders'

export const ORDER_STATUS = {
  pending: 'Chờ xác nhận',
  pickup: 'Chờ lấy hàng',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  return_requested: 'Yêu cầu trả hàng',
  refunded: 'Đã hoàn tiền'
}

function getAllOrders() {
  return getStorageValue(ORDERS_KEY, {})
}

function saveAllOrders(data) {
  setStorageValue(ORDERS_KEY, data)
}

export function getOrdersByUser(userId) {
  if (!userId) return []
  return (getAllOrders()[userId] || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function saveOrdersByUser(userId, orders) {
  if (!userId) return
  const all = getAllOrders()
  all[userId] = orders
  saveAllOrders(all)
}

function createTimeline(status) {
  const now = new Date()
  const steps = [
    { key: 'pending', label: 'Đơn hàng đã đặt', done: true, at: now.toISOString() },
    { key: 'pickup', label: 'Người bán đang chuẩn bị hàng', done: ['pickup', 'shipping', 'delivered', 'completed', 'return_requested', 'refunded'].includes(status), at: null },
    { key: 'shipping', label: 'Đơn hàng đang được giao', done: ['shipping', 'delivered', 'completed', 'return_requested', 'refunded'].includes(status), at: null },
    { key: 'delivered', label: 'Đơn hàng đã giao', done: ['delivered', 'completed', 'return_requested', 'refunded'].includes(status), at: null },
    { key: 'completed', label: 'Đơn hàng hoàn tất', done: ['completed', 'refunded'].includes(status), at: null }
  ]
  return steps
}

export function createOrdersFromCheckout(userId, payload) {
  const current = getOrdersByUser(userId)
  const { items, address, paymentMethod, shippingProvider, shippingFee, voucherCodes, discount, shippingDiscount, notes } = payload
  const createdAt = new Date().toISOString()

  const newOrders = items.map((item) => ({
    id: `od_${Date.now()}_${item.lineId || item.id}_${Math.random().toString(36).slice(2, 7)}`,
    status: 'pending',
    createdAt,
    updatedAt: createdAt,
    productId: item.id,
    slug: item.slug,
    name: item.name,
    image: item.image,
    quantity: item.quantity,
    price: item.price,
    oldPrice: item.oldPrice || item.price,
    total: item.price * item.quantity,
    variationText: item.variationText || '',
    shopId: item.shopId,
    shippingProvider,
    shippingFee,
    paymentMethod,
    address,
    notes: notes || '',
    voucherCodes: voucherCodes || [],
    discount: discount || 0,
    shippingDiscount: shippingDiscount || 0,
    finalTotal: Math.max(0, item.price * item.quantity) + Math.max(0, shippingFee - (shippingDiscount || 0)) - (discount || 0),
    trackingCode: `SPXVN${Math.random().toString().slice(2, 12)}`,
    timeline: createTimeline('pending')
  }))

  saveOrdersByUser(userId, [...newOrders, ...current])
  return newOrders
}

export function updateOrderStatus(userId, orderId, status) {
  const orders = getOrdersByUser(userId)
  const next = orders.map((order) => {
    if (order.id !== orderId) return order
    return {
      ...order,
      status,
      updatedAt: new Date().toISOString(),
      timeline: createTimeline(status)
    }
  })
  saveOrdersByUser(userId, next)
  return next.find((order) => order.id === orderId)
}