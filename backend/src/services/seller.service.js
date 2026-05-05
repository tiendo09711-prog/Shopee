import ApiError from '../utils/apiError.js'
import slugify from '../utils/slugify.js'
import Seller from '../models/Seller.js'
import Product from '../models/Product.js'
import Category from '../models/Category.js'
import Order from '../models/Order.js'
import { updateOrderStatus } from './order.service.js'

export async function registerShop(user, payload) {
  if (user.role !== 'seller') throw new ApiError(403, 'Seller account is required')
  const existed = await Seller.findOne({ user: user._id })
  if (existed) throw new ApiError(409, 'Seller shop already exists')
  if (!payload.shopName) throw new ApiError(400, 'Shop name is required')
  if (!payload.legalAccepted) throw new ApiError(400, 'Legal agreement is required')

  return Seller.create({
    user: user._id,
    shopName: payload.shopName,
    slug: slugify(payload.shopName),
    email: payload.email || user.email,
    phone: payload.phone || user.phone,
    pickupAddress: payload.pickupAddress,
    identityInfo: payload.identityInfo,
    taxInfo: payload.taxInfo,
    legalAccepted: true,
    status: 'pending_approval'
  })
}

export async function getMySeller(userId) {
  const seller = await Seller.findOne({ user: userId }).lean()
  if (!seller) throw new ApiError(404, 'Seller shop not found')
  return seller
}

export async function updateMySeller(userId, payload) {
  const seller = await Seller.findOneAndUpdate({ user: userId }, payload, { new: true, runValidators: true })
  if (!seller) throw new ApiError(404, 'Seller shop not found')
  return seller
}

export async function listProducts(sellerId, query = {}) {
  const filter = { seller: sellerId }
  if (query.status && query.status !== 'all') filter.status = query.status
  if (query.keyword) filter.$or = [
    { name: new RegExp(query.keyword, 'i') },
    { sku: new RegExp(query.keyword, 'i') }
  ]
  return Product.find(filter).populate('category', 'name slug').sort({ createdAt: -1 }).lean()
}

async function resolveCategory(categoryId) {
  const category = await Category.findOne({
    $or: [
      { _id: categoryId },
      { slug: categoryId },
      { name: categoryId }
    ]
  })
  if (!category) throw new ApiError(400, 'Category is required')
  return category
}

function assertPriceRule(product, nextPrice) {
  if (!product || Number(product.price) <= 0) return
  const latest = [...(product.priceHistory || [])].reverse()[0]
  const changedWithin24h = latest && Date.now() - new Date(latest.changedAt).getTime() < 24 * 60 * 60 * 1000
  const ratio = Math.abs(Number(nextPrice) - Number(product.price)) / Number(product.price)
  if (changedWithin24h && ratio > 0.5) throw new ApiError(400, 'Cannot change price more than 50% within 24 hours')
}

export async function saveProduct(seller, payload, mode = 'draft', productId = '') {
  if (!payload.name?.trim()) throw new ApiError(400, 'Product name is required')
  if (payload.name.trim().length > 255) throw new ApiError(400, 'Product name must be at most 255 characters')
  if (Number(payload.price) <= 0) throw new ApiError(400, 'Price must be greater than 0')
  if (Number(payload.stock) < 0) throw new ApiError(400, 'Stock must not be negative')
  if (!payload.images?.length) throw new ApiError(400, 'At least one image is required')

  const category = await resolveCategory(payload.categoryId || payload.category)
  const previous = productId ? await Product.findOne({ _id: productId, seller: seller._id }) : null
  if (productId && !previous) throw new ApiError(404, 'Product not found')
  assertPriceRule(previous, payload.price)

  const status = mode === 'publish' ? 'pending_review' : 'draft'
  const base = {
    seller: seller._id,
    name: payload.name.trim(),
    slug: previous?.slug || `${slugify(payload.name)}-${Date.now().toString().slice(-5)}`,
    sku: payload.sku || previous?.sku || `SKU-${Date.now()}`,
    category: category._id,
    description: payload.description || '',
    price: Number(payload.price),
    oldPrice: Number(payload.oldPrice || payload.price),
    stock: Number(payload.stock),
    images: payload.images,
    attributes: payload.attributes || [],
    variants: payload.variants || [],
    status,
    rejectReason: ''
  }

  if (previous) {
    if (Number(previous.price) !== Number(payload.price)) {
      base.priceHistory = [...(previous.priceHistory || []), { price: Number(payload.price), changedAt: new Date(), changedBy: seller.user }]
    }
    return Product.findByIdAndUpdate(previous._id, base, { new: true, runValidators: true })
  }

  return Product.create({
    ...base,
    priceHistory: [{ price: Number(payload.price), changedAt: new Date(), changedBy: seller.user }]
  })
}

export async function getProduct(sellerId, productId) {
  const product = await Product.findOne({ _id: productId, seller: sellerId }).populate('category', 'name slug').lean()
  if (!product) throw new ApiError(404, 'Product not found')
  return product
}

export async function deleteProduct(sellerId, productId) {
  const hasOrder = await Order.exists({ seller: sellerId, 'items.product': productId })
  if (hasOrder) return Product.findOneAndUpdate({ _id: productId, seller: sellerId }, { status: 'hidden' }, { new: true })
  await Product.deleteOne({ _id: productId, seller: sellerId })
  return true
}

export async function updateProductStatus(sellerId, productId, status) {
  const allowed = ['draft', 'pending_review', 'hidden']
  if (!allowed.includes(status)) throw new ApiError(400, 'Invalid seller product status')
  const product = await Product.findOneAndUpdate({ _id: productId, seller: sellerId }, { status }, { new: true })
  if (!product) throw new ApiError(404, 'Product not found')
  return product
}

export async function listOrders(sellerId, query = {}) {
  const filter = { seller: sellerId }
  if (query.status && query.status !== 'all') filter.status = query.status
  return Order.find(filter).populate('customer', 'name email phone').sort({ createdAt: -1 }).lean()
}

export async function getOrder(sellerId, orderId) {
  const order = await Order.findOne({ _id: orderId, seller: sellerId }).populate('customer', 'name email phone').lean()
  if (!order) throw new ApiError(404, 'Order not found')
  return order
}

export async function changeOrderStatus(seller, user, orderId, nextStatus, note = '') {
  const order = await Order.findOne({ _id: orderId, seller: seller._id })
  if (!order) throw new ApiError(404, 'Order not found')
  return updateOrderStatus(user, orderId, nextStatus, note)
}

export async function getDashboard(sellerId) {
  const [products, orders] = await Promise.all([
    Product.find({ seller: sellerId }).lean(),
    Order.find({ seller: sellerId }).lean()
  ])
  const completed = orders.filter((order) => order.status === 'completed')
  const revenue = completed.reduce((sum, order) => sum + Number(order.total || 0), 0)
  return {
    revenue,
    revenueToday: completed.filter((order) => new Date(order.createdAt).toDateString() === new Date().toDateString()).reduce((sum, order) => sum + Number(order.total || 0), 0),
    newOrders: orders.filter((order) => new Date(order.createdAt).toDateString() === new Date().toDateString()).length,
    pending: orders.filter((order) => order.status === 'pending').length,
    shipping: orders.filter((order) => order.status === 'shipping').length,
    products,
    orders,
    statusCounts: orders.reduce((acc, order) => ({ ...acc, [order.status]: (acc[order.status] || 0) + 1 }), {}),
    topProducts: products.sort((a, b) => Number(b.sold || 0) - Number(a.sold || 0)).slice(0, 5)
  }
}
