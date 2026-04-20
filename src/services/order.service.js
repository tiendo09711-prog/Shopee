import { getStorageValue, setStorageValue } from '../utils/storage'

const ORDERS_KEY = 'shopee_clone_orders'

function getAllOrders() {
  return getStorageValue(ORDERS_KEY, {})
}

function saveAllOrders(data) {
  setStorageValue(ORDERS_KEY, data)
}

export function getOrdersByUser(userId) {
  if (!userId) return []
  const all = getAllOrders()
  return all[userId] || []
}

export function saveOrdersByUser(userId, orders) {
  if (!userId) return
  const all = getAllOrders()
  all[userId] = orders
  saveAllOrders(all)
}

export function createOrdersFromCart(userId, items) {
  const current = getOrdersByUser(userId)
  const createdAt = new Date().toISOString()
  const newOrders = items.map((item) => ({
    id: `od_${Date.now()}_${item.id}_${Math.random().toString(36).slice(2, 7)}`,
    status: 'pending',
    createdAt,
    ...item,
    oldPrice: item.oldPrice || item.price,
    total: item.price * item.quantity
  }))
  saveOrdersByUser(userId, [...newOrders, ...current])
  return newOrders
}