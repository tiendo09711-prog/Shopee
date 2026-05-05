import { categories } from '../data/categories.mock'
import { sellerProductsMock } from '../data/sellerProducts.mock'
import { getStorageValue, setStorageValue } from '../utils/storage'

export const PRODUCTS_KEY = 'pshop_products'
const ORDERS_KEY = 'pshop_orders'

function nowIso() {
  return new Date().toISOString()
}

function slugify(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function normalizeProduct(product) {
  const category = categories.find((item) => item.id === product.category || item.id === product.categoryId)
  return {
    ...product,
    id: product.id || `prd_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    slug: product.slug || slugify(product.name || `product-${Date.now()}`),
    sellerId: product.sellerId || product.shopId || '',
    shopId: product.shopId || product.sellerId || '',
    sku: product.sku || '',
    categoryId: product.categoryId || product.category || category?.id || '',
    categoryName: product.categoryName || category?.name || '',
    category: product.category || product.categoryId || category?.id || '',
    description: product.description || '',
    price: Number(product.price || 0),
    oldPrice: Number(product.oldPrice || product.price || 0),
    stock: Number(product.stock || 0),
    images: Array.isArray(product.images) ? product.images : product.image ? [product.image] : [],
    status: product.status || 'draft',
    rejectReason: product.rejectReason || '',
    rating: Number(product.rating || 0),
    reviewCount: Number(product.reviewCount || 0),
    sold: Number(product.sold || 0),
    priceHistory: Array.isArray(product.priceHistory) ? product.priceHistory : [{ price: Number(product.price || 0), at: product.createdAt || nowIso() }],
    createdAt: product.createdAt || nowIso(),
    updatedAt: product.updatedAt || nowIso(),
  }
}

function getProductStore() {
  const products = getStorageValue(PRODUCTS_KEY, [])
  return Array.isArray(products) ? products.map(normalizeProduct) : []
}

function saveProductStore(products) {
  setStorageValue(PRODUCTS_KEY, products.map(normalizeProduct))
}

export function seedSellerProducts(seller) {
  if (!seller?.id) return
  const products = getProductStore()
  if (products.some((product) => product.sellerId === seller.id || product.shopId === seller.id)) return
  const seeded = sellerProductsMock.map((product) => normalizeProduct({
    ...product,
    sellerId: seller.id,
    shopId: seller.id,
    categoryId: 'shirt',
    category: 'shirt',
    categoryName: 'Áo Thun',
    description: product.name,
    images: [product.image],
    status: product.stock === 0 ? 'hidden' : 'active',
  }))
  saveProductStore([...seeded, ...products])
}

export function getSellerProducts(sellerId) {
  return getProductStore().filter((product) => product.sellerId === sellerId || product.shopId === sellerId)
}

export function getSellerProductById(sellerId, productId) {
  return getSellerProducts(sellerId).find((product) => product.id === productId)
}

function validateProduct(payload, previousProduct = null) {
  if (!payload.name?.trim()) throw new Error('Tên sản phẩm không được để trống.')
  if (payload.name.trim().length > 255) throw new Error('Tên sản phẩm tối đa 255 ký tự.')
  if (!payload.categoryId) throw new Error('Vui lòng chọn danh mục.')
  if (Number(payload.price) <= 0) throw new Error('Giá sản phẩm phải lớn hơn 0.')
  if (Number(payload.stock) < 0) throw new Error('Tồn kho không được âm.')
  if (!payload.images?.length) throw new Error('Sản phẩm cần ít nhất 1 ảnh.')

  if (previousProduct && Number(previousProduct.price) > 0) {
    const latestPriceChange = [...(previousProduct.priceHistory || [])].reverse().find(Boolean)
    const changedWithin24h = latestPriceChange && Date.now() - new Date(latestPriceChange.at).getTime() < 24 * 60 * 60 * 1000
    const changeRatio = Math.abs(Number(payload.price) - Number(previousProduct.price)) / Number(previousProduct.price)
    if (changedWithin24h && changeRatio > 0.5) throw new Error('Không thể đổi giá quá 50% trong 24 giờ.')
  }
}

export function saveSellerProduct(seller, payload, mode = 'draft') {
  validateProduct(payload, payload.id ? getSellerProductById(seller.id, payload.id) : null)
  const products = getProductStore()
  const category = categories.find((item) => item.id === payload.categoryId)
  const previous = payload.id ? products.find((product) => product.id === payload.id) : null
  const timestamp = nowIso()
  const nextProduct = normalizeProduct({
    ...previous,
    ...payload,
    sellerId: seller.id,
    shopId: seller.id,
    category: payload.categoryId,
    categoryName: category?.name || '',
    images: payload.images,
    status: mode === 'publish' ? 'pending_review' : 'draft',
    priceHistory: previous && Number(previous.price) !== Number(payload.price)
      ? [...(previous.priceHistory || []), { price: Number(payload.price), at: timestamp }]
      : previous?.priceHistory,
    createdAt: previous?.createdAt || timestamp,
    updatedAt: timestamp,
  })

  if (previous) saveProductStore(products.map((product) => product.id === previous.id ? nextProduct : product))
  else saveProductStore([nextProduct, ...products])
  return nextProduct
}

export function toggleSellerProductVisibility(sellerId, productId) {
  const products = getProductStore()
  const target = products.find((product) => product.id === productId && (product.sellerId === sellerId || product.shopId === sellerId))
  if (!target) throw new Error('Không tìm thấy sản phẩm.')
  const nextStatus = target.status === 'hidden' ? 'active' : 'hidden'
  saveProductStore(products.map((product) => product.id === productId ? { ...product, status: nextStatus, updatedAt: nowIso() } : product))
  return nextStatus
}

export function deleteSellerProduct(sellerId, productId) {
  const orders = getStorageValue(ORDERS_KEY, [])
  const hasOrder = Array.isArray(orders) && orders.some((order) => order.items?.some((item) => item.productId === productId))
  if (hasOrder) throw new Error('Không thể xóa sản phẩm đã phát sinh đơn hàng.')
  saveProductStore(getProductStore().filter((product) => !(product.id === productId && (product.sellerId === sellerId || product.shopId === sellerId))))
}
