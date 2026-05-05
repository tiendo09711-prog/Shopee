import { apiRequest } from './apiClient'

export async function getSellerProducts(sellerId, query = {}) {
  const params = new URLSearchParams()
  if (query.status && query.status !== 'all') params.set('status', query.status)
  if (query.keyword) params.set('keyword', query.keyword)
  const qs = params.toString()
  return apiRequest(`/seller/products${qs ? `?${qs}` : ''}`)
}

export async function getSellerProductById(sellerId, productId) {
  return apiRequest(`/seller/products/${productId}`)
}

export async function saveSellerProduct(seller, payload, mode = 'draft') {
  const id = payload._id || payload.id
  if (id) {
    return apiRequest(`/seller/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...payload, mode }),
    })
  }
  return apiRequest('/seller/products', {
    method: 'POST',
    body: JSON.stringify({ ...payload, mode }),
  })
}

// Seller can only set status to 'pending_review' or 'hidden'
export async function toggleSellerProductVisibility(sellerId, productId, currentStatus) {
  const nextStatus = currentStatus === 'hidden' ? 'pending_review' : 'hidden'
  return apiRequest(`/seller/products/${productId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: nextStatus }),
  })
}

export async function deleteSellerProduct(sellerId, productId) {
  return apiRequest(`/seller/products/${productId}`, { method: 'DELETE' })
}

// Kept for compatibility, no-op with API
export function seedSellerProducts() {}
