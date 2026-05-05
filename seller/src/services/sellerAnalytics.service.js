import { apiRequest } from './apiClient'

export async function getSellerAnalytics(sellerId, range = '30') {
  return apiRequest(`/seller/stats/dashboard?range=${range}`)
}

export function exportSellerOrdersCsv() {
  return ''
}
