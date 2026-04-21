export function formatCurrency(value = 0) {
  return Number(value || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

export function formatCompactNumber(value = 0) {
  return Number(value || 0).toLocaleString('vi-VN', { notation: 'compact', maximumFractionDigits: 1 })
}