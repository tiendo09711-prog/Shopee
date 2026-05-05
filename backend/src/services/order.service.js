import mongoose from 'mongoose'
import ApiError from '../utils/apiError.js'
import Cart from '../models/Cart.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Notification from '../models/Notification.js'
import Seller from '../models/Seller.js'
import User from '../models/User.js'
import { canTransitionOrder } from '../utils/orderStatus.js'

const STATUS_LABELS = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang chuẩn bị',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  return_requested: 'Yêu cầu trả hàng',
  refunded: 'Đã hoàn tiền'
}

function generateOrderCode() {
  const date = new Date()
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(1000 + Math.random() * 9000)
  return `PS${stamp}${Date.now().toString().slice(-5)}${random}`
}

function assertAddress(address = {}) {
  if (!address.fullName && !address.name) throw new ApiError(400, 'Shipping address name is required')
  if (!address.phone) throw new ApiError(400, 'Shipping address phone is required')
  if (!address.fullAddress && !address.detail) throw new ApiError(400, 'Shipping full address is required')
}

function normalizeAddress(address) {
  return {
    fullName: address.fullName || address.name,
    phone: address.phone,
    province: address.province || '',
    district: address.district || '',
    ward: address.ward || '',
    detail: address.detail || address.fullAddress,
    fullAddress: address.fullAddress || address.detail
  }
}

export async function checkout(user, payload) {
  const { selectedProductIds = [], shippingAddress, paymentMethod = 'cod' } = payload
  assertAddress(shippingAddress)

  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const cart = await Cart.findOne({ user: user._id }).session(session)
    if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty')

    const selectedSet = new Set(selectedProductIds.map(String))
    const selectedItems = cart.items.filter((item) => selectedSet.size === 0 ? item.selected : selectedSet.has(item.product.toString()))
    if (selectedItems.length === 0) throw new ApiError(400, 'No cart items selected')

    const productIds = selectedItems.map((item) => item.product)
    const products = await Product.find({ _id: { $in: productIds }, status: 'active' }).session(session)
    const productMap = new Map(products.map((product) => [product._id.toString(), product]))

    const grouped = new Map()
    for (const item of selectedItems) {
      const product = productMap.get(item.product.toString())
      if (!product) throw new ApiError(400, 'Product is not available')
      if (product.stock < item.quantity) throw new ApiError(400, `${product.name} does not have enough stock`)

      const result = await Product.updateOne(
        { _id: product._id, stock: { $gte: item.quantity }, status: 'active' },
        { $inc: { stock: -item.quantity, sold: item.quantity } },
        { session }
      )
      if (result.modifiedCount !== 1) throw new ApiError(400, `${product.name} does not have enough stock`)

      const sellerId = product.seller.toString()
      if (!grouped.has(sellerId)) grouped.set(sellerId, [])
      grouped.get(sellerId).push({ cartItem: item, product })
    }

    const createdOrders = []
    for (const [sellerId, entries] of grouped.entries()) {
      const items = entries.map(({ cartItem, product }) => ({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        sku: product.sku,
        quantity: cartItem.quantity,
        price: product.price,
        subtotal: product.price * cartItem.quantity,
        reviewed: false
      }))
      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
      const shippingFee = 30000
      const discount = 0
      const order = await Order.create([{
        orderCode: generateOrderCode(),
        customer: user._id,
        seller: sellerId,
        items,
        shippingAddress: normalizeAddress(shippingAddress),
        subtotal,
        shippingFee,
        discount,
        total: subtotal + shippingFee - discount,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
        status: 'pending',
        timeline: [{
          status: 'pending',
          label: STATUS_LABELS.pending,
          note: 'Đơn hàng được tạo',
          changedBy: user._id,
          changedByRole: user.role
        }]
      }], { session })
      createdOrders.push(order[0])
    }

    cart.items = cart.items.filter((item) => !selectedItems.some((selected) => selected.product.toString() === item.product.toString()))
    await cart.save({ session })
    await session.commitTransaction()

    return createdOrders
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

export async function listMyOrders(userId, query = {}) {
  const filter = { customer: userId }
  if (query.status && query.status !== 'all') filter.status = query.status
  return Order.find(filter)
    .populate('seller', 'shopName slug logo')
    .populate('items.product', 'slug images')
    .sort({ createdAt: -1 })
    .lean()
}

export async function getMyOrder(userId, orderId) {
  const order = await Order.findOne({ _id: orderId, customer: userId })
    .populate('seller', 'shopName slug logo')
    .populate('items.product', 'slug images')
    .lean()
  if (!order) throw new ApiError(404, 'Order not found')
  return order
}

export async function cancelMyOrder(user, orderId, reason = '') {
  const order = await Order.findOne({ _id: orderId, customer: user._id })
  if (!order) throw new ApiError(404, 'Order not found')
  if (!['pending', 'confirmed'].includes(order.status)) throw new ApiError(400, 'Order cannot be cancelled')

  order.status = 'cancelled'
  order.cancelReason = reason
  order.cancelledAt = new Date()
  order.timeline.push({
    status: 'cancelled',
    label: STATUS_LABELS.cancelled,
    note: reason || 'Khách hàng hủy đơn',
    changedBy: user._id,
    changedByRole: user.role
  })
  await order.save()
  await Notification.create({
    user: user._id,
    title: 'Đơn hàng đã hủy',
    message: `Đơn hàng ${order.orderCode} đã được hủy.`,
    type: 'order',
    data: { orderId: order._id.toString(), orderCode: order.orderCode }
  })
  return order
}

export async function updateOrderStatus(actor, orderId, nextStatus, note = '') {
  const order = await Order.findById(orderId)
  if (!order) throw new ApiError(404, 'Order not found')
  if (!canTransitionOrder(order.status, nextStatus)) throw new ApiError(400, 'Invalid order status transition')

  order.status = nextStatus
  if (nextStatus === 'delivered') order.deliveredAt = new Date()
  if (nextStatus === 'completed') order.completedAt = new Date()
  if (nextStatus === 'cancelled') order.cancelledAt = new Date()
  order.timeline.push({
    status: nextStatus,
    label: STATUS_LABELS[nextStatus] || nextStatus,
    note,
    changedBy: actor._id,
    changedByRole: actor.role
  })
  await order.save()

  await Notification.create({
    user: order.customer,
    title: 'Cập nhật đơn hàng',
    message: `Đơn hàng ${order.orderCode} chuyển sang trạng thái ${STATUS_LABELS[nextStatus] || nextStatus}.`,
    type: 'order',
    data: { orderId: order._id.toString(), orderCode: order.orderCode, status: nextStatus }
  })

  return order
}
