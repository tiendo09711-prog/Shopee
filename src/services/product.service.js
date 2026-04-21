import { products } from '../data/products.mock'

export function getAllProducts() {
  return [...products]
}

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug)
}

export function getProductById(id) {
  return products.find((product) => product.id === id)
}

export function getProductsByShop(shopId) {
  return products.filter((product) => product.shopId === shopId)
}

export function getBestSellerProducts(limit = 6, excludeId = '') {
  return products
    .filter((product) => product.isBestSeller && product.id !== excludeId)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, limit)
}

export function getRelatedProducts(product, limit = 6) {
  if (!product) return []
  return products
    .filter((item) => item.id !== product.id && (item.category === product.category || item.shopId === product.shopId))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, limit)
}

export function getSearchSuggestions(keyword = '') {
  const query = keyword.trim().toLowerCase()
  const history = getSearchHistory()
  const base = [
    'iphone',
    'samsung',
    'xiaomi',
    'áo thun form rộng',
    'đồng hồ nam',
    'flash sale',
    'freeship'
  ]
  const productNames = products.map((product) => product.name)
  const merged = [...history, ...base, ...productNames]
  const unique = Array.from(new Set(merged))
  if (!query) return unique.slice(0, 8)
  return unique.filter((item) => item.toLowerCase().includes(query)).slice(0, 8)
}

const HISTORY_KEY = 'shopee_clone_search_history'

export function getSearchHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')
  } catch (error) {
    return []
  }
}

export function addSearchHistory(keyword) {
  const value = keyword.trim()
  if (!value) return
  const next = [value, ...getSearchHistory().filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 8)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
}

export function getHotKeywords() {
  return ['iphone 12', 'samsung a54', 'áo thun basic', 'đồng hồ bạc', 'voucher freeship', 'redmi note 13']
}