import ApiError from '../utils/apiError.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Review from '../models/Review.js'
import Seller from '../models/Seller.js'

async function recalculateProductRating(productId) {
  const stats = await Review.aggregate([
    { $match: { product: productId, status: 'visible' } },
    { $group: { _id: '$product', average: { $avg: '$rating' }, count: { $sum: 1 } } }
  ])
  const next = stats[0] || { average: 0, count: 0 }
  await Product.findByIdAndUpdate(productId, {
    ratingAverage: Number(next.average.toFixed?.(1) || next.average || 0),
    reviewCount: next.count
  })
}

async function recalculateSellerRating(sellerId) {
  const stats = await Review.aggregate([
    { $match: { seller: sellerId, status: 'visible' } },
    { $group: { _id: '$seller', average: { $avg: '$rating' } } }
  ])
  await Seller.findByIdAndUpdate(sellerId, {
    ratingAverage: Number((stats[0]?.average || 0).toFixed(1))
  })
}

export async function createReview(user, payload) {
  const { orderId, productId, rating, comment = '', images = [], anonymous = false } = payload
  const order = await Order.findOne({ _id: orderId, customer: user._id })
  if (!order) throw new ApiError(404, 'Order not found')
  if (!['delivered', 'completed'].includes(order.status)) throw new ApiError(400, 'Only delivered or completed orders can be reviewed')

  if (order.deliveredAt) {
    const limit = new Date(order.deliveredAt).getTime() + 30 * 24 * 60 * 60 * 1000
    if (Date.now() > limit) throw new ApiError(400, 'Review window has expired')
  }

  const orderItem = order.items.find((item) => item.product.toString() === productId)
  if (!orderItem) throw new ApiError(400, 'Product is not in this order')

  const existed = await Review.exists({ order: order._id, product: productId, customer: user._id })
  if (existed) throw new ApiError(409, 'Product already reviewed for this order')

  const numericRating = Number(rating)
  if (!numericRating || numericRating < 1 || numericRating > 5) throw new ApiError(400, 'Rating must be from 1 to 5')

  const review = await Review.create({
    order: order._id,
    product: productId,
    customer: user._id,
    seller: order.seller,
    rating: numericRating,
    comment,
    images,
    anonymous
  })

  orderItem.reviewed = true
  await order.save()
  await recalculateProductRating(review.product)
  await recalculateSellerRating(review.seller)
  return review
}
