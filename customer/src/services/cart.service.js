import { apiRequest } from './apiClient'

function normalizeCartItem(item = {}) {
  const product = item.product || {}
  return {
    lineId: product._id || item.product,
    id: product._id || item.product,
    slug: product.slug || '',
    shopId: item.seller?._id || item.seller,
    shopName: item.seller?.shopName || 'PShop',
    name: product.name || item.name,
    image: product.images?.[0] || item.image || '',
    price: Number(product.price ?? item.priceSnapshot ?? item.price ?? 0),
    oldPrice: Number(product.oldPrice ?? item.priceSnapshot ?? item.oldPrice ?? 0),
    quantity: Number(item.quantity || 1),
    selected: Boolean(item.selected),
    variationKey: '',
    variationText: '',
    stock: Number(product.stock ?? item.stock ?? 0)
  }
}

export function normalizeCart(cart = {}) {
  return (cart.items || []).map(normalizeCartItem)
}

export async function getCartByUser() {
  const cart = await apiRequest('/cart')
  return normalizeCart(cart)
}

export async function addCartItem(productId, quantity = 1) {
  const cart = await apiRequest('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity, selected: true })
  })
  return normalizeCart(cart)
}

export async function updateCartItem(productId, payload) {
  const cart = await apiRequest(`/cart/items/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
  return normalizeCart(cart)
}

export async function removeCartItem(productId) {
  const cart = await apiRequest(`/cart/items/${productId}`, { method: 'DELETE' })
  return normalizeCart(cart)
}

export async function clearRemoteCart() {
  const cart = await apiRequest('/cart', { method: 'DELETE' })
  return normalizeCart(cart)
}

export function saveCartByUser() {}
