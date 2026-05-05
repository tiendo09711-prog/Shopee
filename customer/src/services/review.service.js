import { apiRequest } from './apiClient'

let reviewCache = []

export function getReviewsByProduct(productId) {
  return reviewCache
    .filter((review) => review.productId === productId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function hasReviewedOrderItem(orderId, orderItemId) {
  return reviewCache.some((review) => review.orderId === orderId && review.orderItemId === orderItemId)
}

export async function createReview(order, orderItemId, customer, payload) {
  const item = order.items.find((entry) => entry.orderItemId === orderItemId)
  if (!item) throw new Error('Không tìm thấy sản phẩm cần đánh giá trong đơn.')
  const review = await apiRequest('/reviews', {
    method: 'POST',
    body: JSON.stringify({
      orderId: order.id,
      productId: item.productId,
      rating: payload.rating,
      comment: payload.comment,
      images: payload.images || [],
      anonymous: Boolean(payload.anonymous)
    })
  })

  const normalizedReview = {
    ...review,
    id: review._id || review.id,
    orderId: order.id,
    orderItemId,
    productId: item.productId,
    customerId: customer.id
  }
  reviewCache = [normalizedReview, ...reviewCache]
  return normalizedReview
}
