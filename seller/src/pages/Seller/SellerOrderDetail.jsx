import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { useSeller } from '../../contexts/SellerContext'
import { getSellerOrderById, ORDER_STATUS_LABELS } from '../../services/sellerOrder.service'
import { formatCurrency } from '../../utils/formatCurrency'

function SellerOrderDetail() {
  const { orderId } = useParams()
  const { seller } = useSeller()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!seller?.id && !seller?._id) return
    setLoading(true)
    setError('')
    getSellerOrderById(seller._id || seller.id, orderId)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [orderId, seller])

  if (loading) {
    return <SellerDashboardLayout><div style={{ padding: 32 }}>Đang tải chi tiết đơn hàng...</div></SellerDashboardLayout>
  }

  if (error) {
    return (
      <SellerDashboardLayout>
        <section className="seller-panel">
          <div className="status-message text-danger">{error}</div>
          <Link to="/seller/orders" className="seller-primary-btn">Về danh sách đơn</Link>
        </section>
      </SellerDashboardLayout>
    )
  }

  if (!order) return <Navigate to="/seller/orders" replace />

  const address = order.shippingAddress || order.address || {}

  return (
    <SellerDashboardLayout>
      <section className="seller-panel">
        <h1 className="seller-page-title">Chi tiết đơn {order.orderCode || order._id || order.id}</h1>
        <div className="seller-info-grid">
          <div className="seller-info-card"><span>Khách hàng</span><strong>{address.fullName || address.name || order.customer?.name}</strong><small>{address.phone || order.customer?.phone}</small></div>
          <div className="seller-info-card"><span>Trạng thái</span><strong>{ORDER_STATUS_LABELS[order.status] || order.status}</strong></div>
          <div className="seller-info-card"><span>Thanh toán</span><strong>{order.paymentMethod}</strong><small>{order.paymentStatus}</small></div>
          <div className="seller-info-card"><span>Vận chuyển</span><strong>{order.shippingProvider || 'PShop Delivery'}</strong><small>{order.trackingCode || 'Chưa có mã'}</small></div>
        </div>
        <div className="seller-info-card" style={{ marginTop: 16 }}>
          <span>Địa chỉ nhận hàng</span>
          <strong>{address.fullAddress || address.detail}</strong>
          {order.cancelReason ? <small>Lý do hủy: {order.cancelReason}</small> : null}
        </div>
        <table className="seller-table" style={{ marginTop: 16 }}>
          <thead><tr><th>Sản phẩm</th><th>Phân loại</th><th>Số lượng</th><th>Đơn giá</th><th>Tổng</th></tr></thead>
          <tbody>
            {(order.items || []).map((item) => (
              <tr key={item._id || item.orderItemId || item.product}>
                <td>{item.name}</td>
                <td>{item.variationText || item.sku || ''}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.price)}</td>
                <td>{formatCurrency(item.subtotal || item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="order-total-row total"><span>Tổng thanh toán</span><strong>{formatCurrency(order.total || order.finalTotal)}</strong></div>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerOrderDetail
