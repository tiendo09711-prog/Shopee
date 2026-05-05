import { getSellerOrders } from './sellerOrder.service'
import { getSellerProducts } from './sellerProduct.service'

function inRange(dateValue, days) {
  if (days === 'all') return true
  const date = new Date(dateValue).getTime()
  return Date.now() - date <= Number(days) * 24 * 60 * 60 * 1000
}

export function getSellerAnalytics(sellerId, range = '30') {
  const products = getSellerProducts(sellerId)
  const orders = getSellerOrders(sellerId)
  const rangedOrders = orders.filter((order) => inRange(order.createdAt, range))
  const completedOrders = rangedOrders.filter((order) => order.status === 'completed')
  const today = new Date().toDateString()
  const todayOrders = orders.filter((order) => new Date(order.createdAt).toDateString() === today)
  const revenue = completedOrders.reduce((sum, order) => sum + Number(order.finalTotal || 0), 0)
  const revenueToday = todayOrders.filter((order) => order.status === 'completed').reduce((sum, order) => sum + Number(order.finalTotal || 0), 0)
  const statusCounts = rangedOrders.reduce((acc, order) => ({ ...acc, [order.status]: (acc[order.status] || 0) + 1 }), {})
  const productRevenue = products.map((product) => {
    const productOrders = completedOrders.filter((order) => order.items?.some((item) => item.productId === product.id))
    const quantity = productOrders.reduce((sum, order) => sum + order.items.filter((item) => item.productId === product.id).reduce((total, item) => total + item.quantity, 0), 0)
    return {
      id: product.id,
      name: product.name,
      quantity,
      revenue: productOrders.reduce((sum, order) => sum + order.items.filter((item) => item.productId === product.id).reduce((total, item) => total + item.price * item.quantity, 0), 0),
    }
  }).sort((a, b) => b.quantity - a.quantity)

  return {
    orders: rangedOrders,
    completedOrders,
    products,
    revenue,
    revenueToday,
    newOrders: todayOrders.length,
    pending: orders.filter((order) => order.status === 'pending').length,
    shipping: orders.filter((order) => order.status === 'shipping').length,
    conversion: products.length ? Math.min(99, Math.round((completedOrders.length / Math.max(1, rangedOrders.length)) * 100)) : 0,
    statusCounts,
    topProducts: productRevenue.slice(0, 5),
  }
}

export function exportSellerOrdersCsv(sellerId, range = '30') {
  const data = getSellerAnalytics(sellerId, range).completedOrders
  const rows = [['orderId', 'createdAt', 'status', 'finalTotal'], ...data.map((order) => [order.id, order.createdAt, order.status, order.finalTotal])]
  return rows.map((row) => row.join(',')).join('\n')
}
