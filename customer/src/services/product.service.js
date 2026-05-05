import { apiRequest } from './apiClient'

const HISTORY_KEY = 'shopee_clone_search_history'
let productCache = []
let categoryCache = []

function normalizeProduct(product = {}) {
  const category = product.category || {}
  const seller = product.seller || {}
  const price = Number(product.price || 0)
  const oldPrice = Number(product.oldPrice || 0)
  const discountPercent = oldPrice > price && oldPrice > 0
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0

  return {
    ...product,
    id: product._id || product.id,
    shopId: seller._id || product.shopId || product.seller,
    shopName: seller.shopName || product.shopName || 'PShop',
    categoryId: category._id || product.categoryId || product.category,
    category: category.name || product.categoryName || product.category,
    slug: product.slug,
    sku: product.sku,
    rating: Number(product.ratingAverage ?? product.rating ?? 0),
    reviewCount: Number(product.reviewCount || 0),
    sold: Number(product.sold || 0),
    views: Number(product.views || product.sold || 0),
    stock: Number(product.stock || 0),
    images: Array.isArray(product.images) ? product.images : [],
    variations: product.variants || product.variations || [],
    discountPercent,
    shippingLeadTime: product.shippingLeadTime || '2-4 ngày',
    shippingFee: Number(product.shippingFee || 30000),
    brand: product.brand || 'PShop',
    location: product.location || 'Việt Nam',
    status: product.status || 'active'
  }
}

function normalizeCategory(category = {}) {
  return {
    ...category,
    id: category.slug || category._id || category.id,
    value: category.slug || category._id || category.id,
    name: category.name
  }
}

function rememberProducts(products) {
  productCache = products.map(normalizeProduct)
  return productCache
}

export async function fetchProducts(params = {}) {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === 0) return
    const apiKey = key === 'pageSize' ? 'limit' : key
    searchParams.set(apiKey, String(value))
  })

  const data = await apiRequest(`/products${searchParams.toString() ? `?${searchParams}` : ''}`)
  const products = rememberProducts(data.products || data || [])
  return {
    products,
    pagination: data.pagination || {
      page: 1,
      limit: products.length,
      total: products.length,
      totalPages: 1
    }
  }
}

export async function fetchCategories() {
  const data = await apiRequest('/categories')
  categoryCache = (data || []).map(normalizeCategory)
  return categoryCache
}

export async function fetchProductBySlug(slug) {
  const product = normalizeProduct(await apiRequest(`/products/${slug}`))
  productCache = [product, ...productCache.filter((item) => item.id !== product.id)]
  return product
}

export async function fetchProductReviews(productIdOrSlug) {
  const data = await apiRequest(`/products/${productIdOrSlug}/reviews`)
  return data.reviews || []
}

export async function fetchRelatedProducts(product, limit = 6) {
  if (!product) return []
  const data = await fetchProducts({
    category: product.categoryId,
    limit: limit + 1,
    sort: 'bestSeller'
  })
  return data.products.filter((item) => item.id !== product.id).slice(0, limit)
}

export function getAllProducts() {
  return productCache
}

export function getProductStore() {
  return productCache
}

export function getCachedCategories() {
  return categoryCache
}

export function saveProductStore(nextProducts) {
  productCache = nextProducts.map(normalizeProduct)
}

export function isProductVisible(product) {
  return Boolean(product) && (product.status === 'active' || !product.status)
}

export function getProductUnavailableMessage(product) {
  if (!product) return 'Sản phẩm không tồn tại.'
  if (product.status === 'hidden') return 'Sản phẩm này đang bị ẩn hoặc tạm ngừng kinh doanh.'
  if (product.status === 'rejected') return 'Sản phẩm này chưa được duyệt để hiển thị.'
  if (product.status && product.status !== 'active') return 'Sản phẩm này hiện chưa sẵn sàng để bán.'
  return ''
}

export function getProductBySlug(slug) {
  return productCache.find((product) => product.slug === slug)
}

export function getProductById(id) {
  return productCache.find((product) => product.id === id || product._id === id)
}

export function getProductsByShop(shopId) {
  return productCache.filter((product) => product.shopId === shopId)
}

export function getBestSellerProducts(limit = 6, excludeId = '') {
  return productCache
    .filter((product) => product.id !== excludeId)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, limit)
}

export function getRelatedProducts(product, limit = 6) {
  if (!product) return []
  return productCache
    .filter((item) => item.id !== product.id && (item.categoryId === product.categoryId || item.shopId === product.shopId))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, limit)
}

export function getSearchSuggestions(keyword = '') {
  const query = keyword.trim().toLowerCase()
  const history = getSearchHistory()
  const productNames = productCache.map((product) => product.name)
  const merged = [...history, ...productNames]
  const unique = Array.from(new Set(merged))
  if (!query) return unique.slice(0, 8)
  return unique.filter((item) => item.toLowerCase().includes(query)).slice(0, 8)
}

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
  return ['điện thoại', 'pshop phone', 'smart watch', 'áo thun', 'freeship']
}
