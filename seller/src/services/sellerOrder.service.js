import { getStorageValue, setStorageValue } from '../utils/storage'

const ORDERS_KEY = 'pshop_orders'
const NOTIFICATIONS_KEY = 'pshop_notifications'

export const ORDER_STATUS_LABELS = {
  pending: 'Chờ xác nhận',
  pickup: 'Đang xử lý',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  return_requested: 'Yêu cầu trả hàng',
  refunded: 'Đã hoàn tiền',
}

const transitions = {
  pending: ['pickup', 'cancelled'],
  pickup: ['shipping', 'cancelled'],
  shipping: ['delivered'],
  delivered: ['completed'],
  completed: [],
}

function getAllOrders() {
  return getStorageValue(ORDERS_KEY, [])
}

function saveAllOrders(orders) {
  setStorageValue(ORDERS_KEY, orders)
}

function pushNotification(userId, payload) {
  if (!userId) return
  const all = getStorageValue(NOTIFICATIONS_KEY, {})
  const current = all[userId] || []
  all[userId] = [{
    id: `ntf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    read: false,
    createdAt: new Date().toISOString(),
    ...payload,
  }, ...current]
  setStorageValue(NOTIFICATIONS_KEY, all)
}

function timelineFor(status, createdAt) {
  return [
    { key: 'pending', status: 'pending', label: 'Đơn hàng đã đặt', done: true, at: createdAt },
    { key: 'pickup', status: 'pickup', label: 'Người bán đang chuẩn bị hàng', done: ['pickup', 'shipping', 'delivered', 'completed'].includes(status), at: null },
    { key: 'shipping', status: 'shipping', label: 'Đơn hàng đang được giao', done: ['shipping', 'delivered', 'completed'].includes(status), at: null },
    { key: 'delivered', status: 'delivered', label: 'Đơn hàng đã giao', done: ['delivered', 'completed'].includes(status), at: null },
    { key: 'completed', status: 'completed', label: 'Đơn hàng hoàn tất', done: status === 'completed', at: null },
  ].map((step) => step.done && !step.at ? { ...step, at: new Date().toISOString(), by: 'seller' } : step)
}

export function getSellerOrders(sellerId) {
  return getAllOrders()
    .filter((order) => order.sellerId === sellerId || order.shopId === sellerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function getSellerOrderById(sellerId, orderId) {
  return getSellerOrders(sellerId).find((order) => order.id === orderId)
}

export function updateSellerOrderStatus(sellerId, orderId, nextStatus, options = {}) {
  const orders = getAllOrders()
  const target = orders.find((order) => order.id === orderId && (order.sellerId === sellerId || order.shopId === sellerId))
  if (!target) throw new Error('Không tìm thấy đơn hàng.')
  if (target.status === 'completed') throw new Error('Đơn hoàn thành không thể cập nhật ngược.')
  if (!transitions[target.status]?.includes(nextStatus)) throw new Error('Trạng thái chuyển tiếp không hợp lệ.')
  if (nextStatus === 'cancelled' && !options.cancelReason?.trim()) throw new Error('Vui lòng nhập lý do hủy đơn.')

  const now = new Date().toISOString()
  const updated = {
    ...target,
    status: nextStatus,
    cancelReason: nextStatus === 'cancelled' ? options.cancelReason.trim() : target.cancelReason,
    deliveredAt: nextStatus === 'delivered' ? now : target.deliveredAt,
    completedAt: nextStatus === 'completed' ? now : target.completedAt,
    updatedAt: now,
    timeline: timelineFor(nextStatus, target.createdAt),
  }
  saveAllOrders(orders.map((order) => order.id === orderId ? updated : order))
  pushNotification(target.customerId, {
    type: 'order',
    title: 'Đơn hàng được cập nhật',
    message: `Đơn ${target.id} chuyển sang trạng thái ${ORDER_STATUS_LABELS[nextStatus] || nextStatus}.`,
  })
  return updated
}
