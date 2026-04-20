export function formatCurrency(value) {
  return `₫ ${Number(value || 0).toLocaleString('vi-VN')}`
}

export function formatCompactNumber(value) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}m`
  }
  if (value >= 1000) {
    const formatted = (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)
    return `${formatted}k`
  }
  return `${value}`
}
