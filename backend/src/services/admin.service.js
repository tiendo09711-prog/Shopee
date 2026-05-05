import ApiError from '../utils/apiError.js'
import slugify from '../utils/slugify.js'
import User from '../models/User.js'
import Seller from '../models/Seller.js'
import Category from '../models/Category.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import Report from '../models/Report.js'
import Refund from '../models/Refund.js'
import Notification from '../models/Notification.js'
import AuditLog from '../models/AuditLog.js'
import { updateOrderStatus } from './order.service.js'

export async function dashboard() {
  const [orders, customers, sellers, activeProducts, pendingProducts] = await Promise.all([
    Order.find().lean(),
    User.countDocuments({ role: 'customer' }),
    Seller.countDocuments(),
    Product.countDocuments({ status: 'active' }),
    Product.countDocuments({ status: 'pending_review' })
  ])
  const completed = orders.filter((order) => order.status === 'completed')
  return {
    revenue: completed.reduce((sum, order) => sum + Number(order.total || 0), 0),
    revenueToday: completed.filter((order) => new Date(order.createdAt).toDateString() === new Date().toDateString()).reduce((sum, order) => sum + Number(order.total || 0), 0),
    totalOrders: orders.length,
    pendingOrders: orders.filter((order) => order.status === 'pending').length,
    customers,
    sellers,
    activeProducts,
    pendingProducts,
    ordersByStatus: orders.reduce((acc, order) => ({ ...acc, [order.status]: (acc[order.status] || 0) + 1 }), {})
  }
}

export async function listCategories() {
  return Category.find().sort({ sortOrder: 1, name: 1 }).lean()
}

export async function createCategory(payload) {
  if (!payload.name) throw new ApiError(400, 'Category name is required')
  return Category.create({
    name: payload.name,
    slug: payload.slug || slugify(payload.name),
    description: payload.description || '',
    status: payload.status || 'active',
    image: payload.image || '',
    sortOrder: payload.sortOrder || 0
  })
}

export async function updateCategory(id, payload) {
  const category = await Category.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
  if (!category) throw new ApiError(404, 'Category not found')
  return category
}

export async function deleteCategory(id) {
  const count = await Product.countDocuments({ category: id })
  if (count > 0) throw new ApiError(400, 'Cannot delete category with products')
  await Category.findByIdAndDelete(id)
  return true
}

export async function listProducts(query = {}) {
  const filter = {}
  if (query.status && query.status !== 'all') filter.status = query.status
  if (query.keyword) filter.$or = [
    { name: new RegExp(query.keyword, 'i') },
    { sku: new RegExp(query.keyword, 'i') }
  ]
  return Product.find(filter).populate('seller', 'shopName status').populate('category', 'name slug').sort({ createdAt: -1 }).lean()
}

export async function updateProduct(id, payload) {
  const product = await Product.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
  if (!product) throw new ApiError(404, 'Product not found')
  return product
}

export async function approveProduct(admin, id) {
  const product = await updateProduct(id, { status: 'active', rejectReason: '' })
  const seller = await Seller.findById(product.seller)
  if (seller) {
    await Notification.create({ user: seller.user, title: 'Sản phẩm đã duyệt', message: product.name, type: 'product', data: { productId: product._id.toString() } })
  }
  return product
}

export async function rejectProduct(admin, id, reason) {
  if (!reason) throw new ApiError(400, 'Reject reason is required')
  const product = await updateProduct(id, { status: 'rejected', rejectReason: reason })
  const seller = await Seller.findById(product.seller)
  if (seller) {
    await Notification.create({ user: seller.user, title: 'Sản phẩm bị từ chối', message: reason, type: 'product', data: { productId: product._id.toString() } })
  }
  return product
}

export async function listOrders(query = {}) {
  const filter = {}
  if (query.status && query.status !== 'all') filter.status = query.status
  return Order.find(filter).populate('customer', 'name email phone').populate('seller', 'shopName').sort({ createdAt: -1 }).lean()
}

export async function changeOrder(admin, id, status, note = '') {
  return updateOrderStatus(admin, id, status, note)
}

export async function listUsers(query = {}) {
  const filter = {}
  if (query.role) filter.role = query.role
  if (query.status) filter.status = query.status
  return User.find(filter).sort({ createdAt: -1 }).lean()
}

export async function updateUserStatus(id, status) {
  const user = await User.findByIdAndUpdate(id, { status }, { new: true })
  if (!user) throw new ApiError(404, 'User not found')
  return user
}

export async function listSellers(query = {}) {
  const filter = {}
  if (query.status && query.status !== 'all') filter.status = query.status
  return Seller.find(filter).populate('user', 'name email phone status').sort({ createdAt: -1 }).lean()
}

export async function approveSeller(admin, id) {
  const seller = await Seller.findByIdAndUpdate(id, { status: 'approved', approvedAt: new Date(), approvedBy: admin._id, rejectReason: '' }, { new: true })
  if (!seller) throw new ApiError(404, 'Seller not found')
  await Notification.create({ user: seller.user, title: 'Gian hàng đã được duyệt', message: seller.shopName, type: 'seller' })
  return seller
}

export async function rejectSeller(admin, id, reason) {
  if (!reason) throw new ApiError(400, 'Reject reason is required')
  const seller = await Seller.findByIdAndUpdate(id, { status: 'rejected', rejectReason: reason }, { new: true })
  if (!seller) throw new ApiError(404, 'Seller not found')
  await Notification.create({ user: seller.user, title: 'Gian hàng bị từ chối', message: reason, type: 'seller' })
  return seller
}

export async function updateSellerStatus(id, status) {
  const seller = await Seller.findByIdAndUpdate(id, { status }, { new: true })
  if (!seller) throw new ApiError(404, 'Seller not found')
  return seller
}

export async function listReports(query = {}) {
  const filter = {}
  if (query.status && query.status !== 'all') filter.status = query.status
  return Report.find(filter).populate('reporter', 'name email').sort({ createdAt: -1 }).lean()
}

export async function updateReport(admin, id, status, note = '') {
  const report = await Report.findById(id)
  if (!report) throw new ApiError(404, 'Report not found')
  report.status = status
  report.auditTrail.push({ action: status, note, by: admin._id, at: new Date() })
  await report.save()
  return report
}

export async function listRefunds(query = {}) {
  const filter = {}
  if (query.status && query.status !== 'all') filter.status = query.status
  return Refund.find(filter).populate('order', 'orderCode status total').populate('customer', 'name email').populate('seller', 'shopName').sort({ createdAt: -1 }).lean()
}
