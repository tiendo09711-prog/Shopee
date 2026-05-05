import { Navigate, useParams } from 'react-router-dom'
import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { useSeller } from '../../contexts/SellerContext'
import { getSellerOrderById, ORDER_STATUS_LABELS } from '../../services/sellerOrder.service'
import { formatCurrency } from '../../utils/formatCurrency'

function SellerOrderDetail() {
  const { orderId } = useParams()
  const { seller } = useSeller()
  const order = getSellerOrderById(seller.id, orderId)

  if (!order) return <Navigate to="/seller/orders" replace />

  return (
    <SellerDashboardLayout>
      <section className="seller-panel">
        <h1 className="seller-page-title">Chi tiết đơn {order.id}</h1>
        <div className="seller-info-grid">
          <div className="seller-info-card"><span>Khách hàng</span><strong>{order.address?.name}</strong><small>{order.address?.phone}</small></div>
          <div className="seller-info-card"><span>Trạng thái</span><strong>{ORDER_STATUS_LABELS[order.status] || order.status}</strong></div>
          <div className="seller-info-card"><span>Thanh toán</span><strong>{order.paymentMethod}</strong><small>{order.paymentStatus}</small></div>
          <div className="seller-info-card"><span>Vận chuyển</span><strong>{order.shippingProvider}</strong><small>{order.trackingCode}</small></div>
        </div>
        <div className="seller-info-card" style={{ marginTop: 16 }}>
          <span>Địa chỉ nhận hàng</span>
          <strong>{order.address?.fullAddress}</strong>
        </div>
        <table className="seller-table" style={{ marginTop: 16 }}>
          <thead><tr><th>Sản phẩm</th><th>Phân loại</th><th>Số lượng</th><th>Đơn giá</th><th>Tổng</th></tr></thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.orderItemId}>
                <td>{item.name}</td>
                <td>{item.variationText}</td>
                <td>{item.quantity}</td>
                <td>{formatCurrency(item.price)}</td>
                <td>{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="order-total-row total"><span>Tổng thanh toán</span><strong>{formatCurrency(order.finalTotal)}</strong></div>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerOrderDetail
