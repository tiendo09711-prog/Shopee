import { Navigate, Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import MainLayout from '../../layout/MainLayout'
import { useAuth } from '../../contexts/AuthContext'
import { useOrders } from '../../contexts/OrderContext'
import UserSidebar from '../../components/UserSidebar/UserSidebar'
import RefundRequestModal from './RefundRequestModal'
import ReviewModal from './ReviewModal'
import ReportOrderModal from './ReportOrderModal'
import { getRefundByOrder, loadMyRefunds } from '../../services/refund.service'
import { hasReviewedOrderItem } from '../../services/review.service'
import { formatCurrency } from '../../utils/formatCurrency'
import './PurchasePage.css'

const tabs = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'pickup', label: 'Chờ lấy hàng' },
  { key: 'shipping', label: 'Đang giao' },
  { key: 'delivered', label: 'Đã giao' },
  { key: 'completed', label: 'Hoàn thành' },
  { key: 'cancelled', label: 'Đã hủy' },
  { key: 'return_requested', label: 'Trả hàng' },
  { key: 'refunded', label: 'Hoàn tiền' }
]

function PurchasePage() {
  const { user, isAuthenticated } = useAuth()
  const { orders, changeOrderStatus, reloadOrders } = useOrders()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeModal, setActiveModal] = useState(null)
  const [message, setMessage] = useState('')
  const activeTab = searchParams.get('status') || 'all'

  useEffect(() => {
    if (isAuthenticated) loadMyRefunds().catch(() => null)
  }, [isAuthenticated])

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: '/user/purchase' }} />

  const filteredOrders = activeTab === 'all' ? orders : orders.filter((item) => item.status === activeTab)

  const handleRefundSuccess = () => {
    reloadOrders()
    setMessage('Đã gửi yêu cầu hoàn tiền/trả hàng.')
    setActiveModal(null)
  }

  const handleChangeStatus = async (orderId, status, title) => {
    try {
      await changeOrderStatus(orderId, status, title)
      setMessage('')
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handleReviewSuccess = () => {
    setMessage('Đã gửi đánh giá sản phẩm.')
    setActiveModal(null)
  }

  const handleReportSuccess = () => {
    setMessage('Đã gửi báo cáo cho Admin xử lý.')
    setActiveModal(null)
  }

  return (
    <MainLayout>
      <div className="container page-spacing user-page-layout">
        <UserSidebar />
        <div className="user-page-main">
          <div className="purchase-tabs card">
            {tabs.map((tab) => (
              <button key={tab.key} type="button" className={activeTab === tab.key ? 'active' : ''} onClick={() => setSearchParams(tab.key === 'all' ? {} : { status: tab.key })}>{tab.label}</button>
            ))}
          </div>
          <div className="purchase-list">
            {message ? <div className="purchase-feedback card">{message}</div> : null}
            {filteredOrders.length === 0 ? (
              <div className="empty-message card">Chưa có đơn hàng nào trong trạng thái này.</div>
            ) : filteredOrders.map((order) => {
              const canAfterDelivered = ['delivered', 'completed'].includes(order.status)
              const refundExists = Boolean(getRefundByOrder(order.id))
              const hasReviewableItem = order.items?.some((item) => !hasReviewedOrderItem(order.id, item.orderItemId))
              return (
              <div key={order.id} className="purchase-item card">
                <div className="purchase-top">
                  <div>
                    <strong>{order.shippingProvider}</strong>
                    <p>Mã vận đơn: {order.trackingCode}</p>
                  </div>
                  <span className={`purchase-status ${order.status}`}>{tabs.find((item) => item.key === order.status)?.label || order.status}</span>
                </div>

                <div className="purchase-body">
                  <Link to={`/product/${order.slug}`} className="purchase-product">
                    <img src={order.image} alt={order.name} />
                    <div>
                      <h4>{order.name}</h4>
                      {order.variationText ? <p>{order.variationText}</p> : null}
                      <small>{order.items?.length > 1 ? `${order.items.length} sản phẩm` : `x${order.quantity}`}</small>
                    </div>
                  </Link>
                  <div className="purchase-meta">
                    <div>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                    <div><span className="old">{formatCurrency(order.oldPrice)}</span> <strong>{formatCurrency(order.finalTotal || order.total)}</strong></div>
                  </div>
                </div>

                <div className="purchase-timeline">
                  {order.timeline?.map((step) => (
                    <div key={step.key} className={`purchase-step ${step.done ? 'done' : ''}`}>
                      <span />
                      <small>{step.label}</small>
                    </div>
                  ))}
                </div>

                <div className="purchase-actions">
                  <Link to={`/user/purchase/${order.id}`}>Xem chi tiết</Link>
                  {order.status === 'pending' ? <button type="button" onClick={() => handleChangeStatus(order.id, 'cancelled', 'Đơn hàng đã hủy')}>Hủy đơn</button> : null}
                  {canAfterDelivered && !refundExists ? <button type="button" onClick={() => setActiveModal({ type: 'refund', order })}>Yêu cầu hoàn tiền</button> : null}
                  {canAfterDelivered && hasReviewableItem ? <button type="button" onClick={() => setActiveModal({ type: 'review', order })}>Đánh giá</button> : null}
                  <button type="button" onClick={() => setActiveModal({ type: 'report', order })}>Báo cáo</button>
                  <Link to={`/product/${order.slug}`}>Mua lại</Link>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
      {activeModal?.type === 'refund' ? (
        <RefundRequestModal order={activeModal.order} customerId={user.id} onClose={() => setActiveModal(null)} onSuccess={handleRefundSuccess} />
      ) : null}
      {activeModal?.type === 'review' ? (
        <ReviewModal order={activeModal.order} customer={user} onClose={() => setActiveModal(null)} onSuccess={handleReviewSuccess} />
      ) : null}
      {activeModal?.type === 'report' ? (
        <ReportOrderModal order={activeModal.order} reporterId={user.id} onClose={() => setActiveModal(null)} onSuccess={handleReportSuccess} />
      ) : null}
    </MainLayout>
  )
}

export default PurchasePage
