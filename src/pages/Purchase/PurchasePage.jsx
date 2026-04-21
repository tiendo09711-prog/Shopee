import { Navigate, Link, useSearchParams } from 'react-router-dom'
import MainLayout from '../../layout/MainLayout'
import { useAuth } from '../../contexts/AuthContext'
import { useOrders } from '../../contexts/OrderContext'
import UserSidebar from '../../components/UserSidebar/UserSidebar'
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
  const { isAuthenticated } = useAuth()
  const { orders, changeOrderStatus } = useOrders()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('status') || 'all'

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: '/user/purchase' }} />

  const filteredOrders = activeTab === 'all' ? orders : orders.filter((item) => item.status === activeTab)

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
            {filteredOrders.length === 0 ? (
              <div className="empty-message card">Chưa có đơn hàng nào trong trạng thái này.</div>
            ) : filteredOrders.map((order) => (
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
                      <small>x{order.quantity}</small>
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
                  {order.status === 'pending' ? <button type="button" onClick={() => changeOrderStatus(order.id, 'cancelled', 'Đơn hàng đã hủy')}>Hủy đơn</button> : null}
                  {order.status === 'pickup' ? <button type="button" onClick={() => changeOrderStatus(order.id, 'shipping', 'Đơn hàng bắt đầu giao')}>Giả lập bắt đầu giao</button> : null}
                  {order.status === 'shipping' ? <button type="button" onClick={() => changeOrderStatus(order.id, 'delivered', 'Đơn hàng đã giao')}>Đánh dấu đã giao</button> : null}
                  {order.status === 'delivered' ? <button type="button" onClick={() => changeOrderStatus(order.id, 'completed', 'Đơn hàng hoàn thành')}>Đã nhận hàng</button> : null}
                  {['completed', 'delivered'].includes(order.status) ? <button type="button" onClick={() => changeOrderStatus(order.id, 'return_requested', 'Yêu cầu trả hàng/hoàn tiền')}>Yêu cầu trả hàng</button> : null}
                  {order.status === 'return_requested' ? <button type="button" onClick={() => changeOrderStatus(order.id, 'refunded', 'Đơn hàng đã hoàn tiền')}>Giả lập hoàn tiền</button> : null}
                  <Link to={`/product/${order.slug}`}>Mua lại</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default PurchasePage