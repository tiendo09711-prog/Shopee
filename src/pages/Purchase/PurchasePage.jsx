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
  { key: 'cancelled', label: 'Đã hủy' }
]

function PurchasePage() {
  const { isAuthenticated } = useAuth()
  const { orders } = useOrders()
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
          <div className="purchase-list card">
            {filteredOrders.length === 0 ? (
              <div className="empty-message">Chưa có đơn hàng nào trong trạng thái này.</div>
            ) : filteredOrders.map((order) => (
              <div key={order.id} className="purchase-item">
                <Link to={`/product/${order.slug}`} className="purchase-product">
                  <img src={order.image} alt={order.name} />
                  <div>
                    <h4>{order.name}</h4>
                    <p>x{order.quantity}</p>
                  </div>
                </Link>
                <div className="purchase-meta">
                  <div>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                  <div><span className="old">{formatCurrency(order.oldPrice)}</span> <strong>{formatCurrency(order.total)}</strong></div>
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