import { apiRequest } from './apiClient'

export async function getSellerAnalytics(sellerId, range = '30', filters = {}) {
  const params = new URLSearchParams({ range })
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  return apiRequest(`/seller/stats/dashboard?${params}`)
}

export function exportSellerOrdersCsv() {
  return ''
}
