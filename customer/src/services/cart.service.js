import { getStorageValue, setStorageValue } from '../utils/storage'

const CARTS_KEY = 'shopee_clone_carts'

function getAllCarts() {
  return getStorageValue(CARTS_KEY, {})
}

function saveAllCarts(carts) {
  setStorageValue(CARTS_KEY, carts)
}

export function getCartByUser(userId) {
  if (!userId) return []
  const carts = getAllCarts()
  return carts[userId] || []
}

export function saveCartByUser(userId, items) {
  if (!userId) return
  const carts = getAllCarts()
  carts[userId] = items
  saveAllCarts(carts)
}
