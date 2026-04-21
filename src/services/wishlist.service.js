import { getStorageValue, setStorageValue } from '../utils/storage'
import { getProductById } from './product.service'

const WISHLIST_KEY = 'shopee_clone_wishlists'

function getAllWishlists() {
  return getStorageValue(WISHLIST_KEY, {})
}

function saveAllWishlists(data) {
  setStorageValue(WISHLIST_KEY, data)
}

export function getWishlistIdsByUser(userId) {
  if (!userId) return []
  return getAllWishlists()[userId] || []
}

export function saveWishlistIdsByUser(userId, ids) {
  if (!userId) return
  const all = getAllWishlists()
  all[userId] = ids
  saveAllWishlists(all)
}

export function toggleWishlistProduct(userId, productId) {
  const current = getWishlistIdsByUser(userId)
  const exists = current.includes(productId)
  const next = exists ? current.filter((id) => id !== productId) : [productId, ...current]
  saveWishlistIdsByUser(userId, next)
  return next
}

export function getWishlistProductsByUser(userId) {
  return getWishlistIdsByUser(userId)
    .map((id) => getProductById(id))
    .filter(Boolean)
}