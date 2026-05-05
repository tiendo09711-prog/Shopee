import { apiRequest, formatCurrency } from './apiClient'

export { formatCurrency }

// Categories
export async function getCategories() {
  return apiRequest('/admin/categories')
}

export async function saveCategory(payload) {
  if (payload.id || payload._id) {
    return apiRequest(`/admin/categories/${payload.id || payload._id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  }
  return apiRequest('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function deleteCategory(id) {
  return apiRequest(`/admin/categories/${id}`, { method: 'DELETE' })
}

export async function updateCategoryStatus(id, status) {
  return apiRequest(`/admin/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// Products
export async function getProducts(query = {}) {
  const params = new URLSearchParams()
  if (query.status) params.set('status', query.status)
  if (query.keyword) params.set('keyword', query.keyword)
  const qs = params.toString()
  return apiRequest(`/admin/products${qs ? `?${qs}` : ''}`)
}

export async function approveProduct(id) {
  return apiRequest(`/admin/products/${id}/approve`, { method: 'PATCH' })
}

export async function rejectProduct(id, reason) {
  return apiRequest(`/admin/products/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  })
}

export async function updateProductStatus(id, status) {
  return apiRequest(`/admin/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// Orders
export async function getOrders(query = {}) {
  const params = new URLSearchParams()
  if (query.status) params.set('status', query.status)
  const qs = params.toString()
  return apiRequest(`/admin/orders${qs ? `?${qs}` : ''}`)
}

export async function updateOrderStatus(id, status, note = '') {
  return apiRequest(`/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note }),
  })
}

// Users
export async function getUsers(query = {}) {
  const params = new URLSearchParams()
  if (query.role) params.set('role', query.role)
  if (query.status) params.set('status', query.status)
  const qs = params.toString()
  return apiRequest(`/admin/users${qs ? `?${qs}` : ''}`)
}

export async function updateUserStatus(id, status) {
  return apiRequest(`/admin/users/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// Sellers
export async function getSellers(query = {}) {
  const params = new URLSearchParams()
  if (query.status) params.set('status', query.status)
  const qs = params.toString()
  return apiRequest(`/admin/sellers${qs ? `?${qs}` : ''}`)
}

export async function approveSeller(id) {
  return apiRequest(`/admin/sellers/${id}/approve`, { method: 'PATCH' })
}

export async function rejectSeller(id, reason) {
  return apiRequest(`/admin/sellers/${id}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  })
}

export async function updateSellerStatus(id, status) {
  return apiRequest(`/admin/sellers/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  })
}

// Reports
export async function getReports(query = {}) {
  const params = new URLSearchParams()
  if (query.status) params.set('status', query.status)
  const qs = params.toString()
  return apiRequest(`/admin/reports${qs ? `?${qs}` : ''}`)
}

export async function updateReport(id, status, note = '') {
  return apiRequest(`/admin/reports/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note }),
  })
}

// Refunds
export async function getRefunds(query = {}) {
  const params = new URLSearchParams()
  if (query.status) params.set('status', query.status)
  const qs = params.toString()
  return apiRequest(`/admin/refunds${qs ? `?${qs}` : ''}`)
}

// Dashboard
export async function getDashboard() {
  return apiRequest('/admin/stats/dashboard')
}
