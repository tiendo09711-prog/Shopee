import ApiError from '../utils/apiError.js'
import Order from '../models/Order.js'
import Refund from '../models/Refund.js'

export async function createRefund(user, payload) {
  const { orderId, reason, description = '', images = [] } = payload
  if (!reason) throw new ApiError(400, 'Refund reason is required')

  const order = await Order.findOne({ _id: orderId, customer: user._id })
  if (!order) throw new ApiError(404, 'Order not found')
  if (!['delivered', 'completed', 'return_requested'].includes(order.status)) {
    throw new ApiError(400, 'Only delivered or completed orders can request refund')
  }

  const existed = await Refund.exists({
    order: order._id,
    status: { $in: ['requested', 'approved', 'refunded'] }
  })
  if (existed) throw new ApiError(409, 'Refund request already exists for this order')

  order.status = 'return_requested'
  order.timeline.push({
    status: 'return_requested',
    label: 'Yêu cầu trả hàng',
    note: reason,
    changedBy: user._id,
    changedByRole: user.role
  })
  await order.save()

  return Refund.create({
    order: order._id,
    customer: user._id,
    seller: order.seller,
    reason,
    description,
    images,
    amount: order.total
  })
}

export async function listMyRefunds(userId) {
  return Refund.find({ customer: userId })
    .populate('order', 'orderCode status total')
    .populate('seller', 'shopName slug')
    .sort({ createdAt: -1 })
    .lean()
}
