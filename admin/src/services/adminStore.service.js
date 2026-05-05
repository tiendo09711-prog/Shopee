import { getStorageValue, setStorageValue } from '../utils/storage'

export const keys = {
  users: 'pshop_users',
  products: 'pshop_products',
  categories: 'pshop_categories',
  orders: 'pshop_orders',
  sellers: 'pshop_sellers',
  reviews: 'pshop_reviews',
  refunds: 'pshop_refunds',
  reports: 'pshop_reports',
  notifications: 'pshop_notifications',
}

const defaultCategories = [
  { id: 'phone', name: 'Điện Thoại', description: 'Điện thoại và phụ kiện', status: 'active' },
  { id: 'watch', name: 'Đồng Hồ', description: 'Đồng hồ thời trang', status: 'active' },
  { id: 'shirt', name: 'Áo Thun', description: 'Thời trang áo thun', status: 'active' },
]

export function getUsers() { return getStorageValue(keys.users, []) }
export function saveUsers(users) { setStorageValue(keys.users, users) }
export function getProducts() { return getStorageValue(keys.products, []) }
export function saveProducts(products) { setStorageValue(keys.products, products) }
export function getOrders() { return getStorageValue(keys.orders, []) }
export function saveOrders(orders) { setStorageValue(keys.orders, orders) }
export function getReports() { return getStorageValue(keys.reports, []) }
export function saveReports(reports) { setStorageValue(keys.reports, reports) }
export function getRefunds() { return getStorageValue(keys.refunds, []) }

export function getCategories() {
  const categories = getStorageValue(keys.categories, null)
  if (Array.isArray(categories) && categories.length > 0) return categories
  setStorageValue(keys.categories, defaultCategories)
  return defaultCategories
}

export function saveCategories(categories) { setStorageValue(keys.categories, categories) }

export function getSellers() {
  const raw = getStorageValue(keys.sellers, {})
  return Array.isArray(raw) ? raw : Object.values(raw)
}

export function saveSellers(sellers) {
  const map = Object.fromEntries(sellers.map((seller) => [seller.userId || seller.id, seller]))
  setStorageValue(keys.sellers, map)
}

export function pushNotification(userId, payload) {
  if (!userId) return
  const all = getStorageValue(keys.notifications, {})
  all[userId] = [{
    id: `ntf_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    read: false,
    createdAt: new Date().toISOString(),
    ...payload,
  }, ...(all[userId] || [])]
  setStorageValue(keys.notifications, all)
}

export function formatCurrency(value = 0) {
  return Number(value || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}
