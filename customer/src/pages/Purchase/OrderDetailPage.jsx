import { Link, Navigate, useParams } from 'react-router-dom'
import MainLayout from '../../layout/MainLayout'
import UserSidebar from '../../components/UserSidebar/UserSidebar'
import { useAuth } from '../../contexts/AuthContext'
import { useOrders } from '../../contexts/OrderContext'
import { ORDER_STATUS } from '../../services/order.service'
import { formatCurrency } from '../../utils/formatCurrency'
import './PurchasePage.css'

const paymentLabels = {
  cod: 'Thanh toán khi nhận hàng',
  wallet: 'ShopeePay',
  spaylater: 'SPayLater',
  card: 'Thẻ tín dụng/Ghi nợ'
}

const paymentStatusLabels = {
  unpaid: 'Chưa thanh toán',
  paid: 'Đã thanh toán',
  failed: 'Thanh toán thất bại'
}

function OrderDetailPage() {
  const { orderId } = useParams()
  const { isAuthenticated } = useAuth()
  const { orders } = useOrders()
  const order = orders.find((item) => item.id === orderId)

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: `/user/purchase/${orderId}` }} />

  if (!order) {
    return (
      <MainLayout>
        <div className="container page-spacing user-page-layout">
          <UserSidebar />
          <div className="empty-message card">Không tìm thấy đơn hàng.</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container page-spacing user-page-layout">
        <UserSidebar />
        <div className="user-page-main order-detail-page">
          <section className="card order-detail-card">
            <div className="order-detail-header">
              <div>
                <h1>Chi tiết đơn hàng</h1>
                <p>Mã đơn: {order.id}</p>
              </div>
              <span className={`purchase-status ${order.status}`}>{ORDER_STATUS[order.status] || order.status}</span>
            </div>
            <div className="purchase-timeline detail-timeline">
              {order.timeline?.map((step) => (
                <div key={step.key || step.status} className={`purchase-step ${step.done ? 'done' : ''}`}>
                  <span />
                  <small>{step.label}</small>
                </div>
              ))}
            </div>
          </section>

          <section className="card order-detail-card">
            <h2>Sản phẩm</h2>
            <div className="order-detail-items">
              {order.items.map((item) => (
                <Link key={item.orderItemId} to={`/product/${item.slug}`} className="purchase-product order-detail-product">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    {item.variationText ? <p>{item.variationText}</p> : null}
                    <small>x{item.quantity}</small>
                  </div>
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                </Link>
              ))}
            </div>
          </section>

          <section className="card order-detail-card order-detail-grid">
            <div>
              <h2>Địa chỉ nhận hàng</h2>
              <p><strong>{order.address.name}</strong> · {order.address.phone}</p>
              <p>{order.address.fullAddress}</p>
            </div>
            <div>
              <h2>Vận chuyển</h2>
              <p>{order.shippingProvider}</p>
              <p>Mã vận đơn: {order.trackingCode}</p>
            </div>
            <div>
              <h2>Thanh toán</h2>
              <p>{paymentLabels[order.paymentMethod] || order.paymentMethod}</p>
              <p>{paymentStatusLabels[order.paymentStatus] || order.paymentStatus}</p>
            </div>
          </section>

          <section className="card order-detail-card">
            <h2>Tổng tiền</h2>
            <div className="order-total-row"><span>Tiền hàng</span><strong>{formatCurrency(order.subtotal)}</strong></div>
            <div className="order-total-row"><span>Phí vận chuyển</span><strong>{formatCurrency(order.shippingFee)}</strong></div>
            <div className="order-total-row"><span>Giảm giá</span><strong>- {formatCurrency(order.discount + order.shippingDiscount)}</strong></div>
            <div className="order-total-row total"><span>Tổng thanh toán</span><strong>{formatCurrency(order.finalTotal)}</strong></div>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}

export default OrderDetailPage
