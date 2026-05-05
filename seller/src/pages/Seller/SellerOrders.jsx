import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { useSeller } from '../../contexts/SellerContext'
import { getSellerOrders, ORDER_STATUS_LABELS, updateSellerOrderStatus } from '../../services/sellerOrder.service'
import { formatCurrency } from '../../utils/formatCurrency'

const tabs = ['all', 'pending', 'pickup', 'shipping', 'delivered', 'completed', 'cancelled', 'return_requested']

function SellerOrders() {
  const { seller } = useSeller()
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [message, setMessage] = useState('')

  const reload = () => setOrders(getSellerOrders(seller.id))
  useEffect(() => { if (seller?.id) reload() }, [seller])

  const filteredOrders = useMemo(() => {
    const query = keyword.trim().toLowerCase()
    return orders.filter((order) => {
      const matchStatus = status === 'all' || order.status === status
      const matchKeyword = !query || `${order.id} ${order.address?.name || ''}`.toLowerCase().includes(query)
      return matchStatus && matchKeyword
    })
  }, [keyword, orders, status])

  const handleUpdate = (order, nextStatus) => {
    const cancelReason = nextStatus === 'cancelled' ? window.prompt('Nhập lý do hủy đơn') : ''
    try {
      updateSellerOrderStatus(seller.id, order.id, nextStatus, { cancelReason })
      setMessage('Đã cập nhật trạng thái đơn hàng.')
      reload()
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <SellerDashboardLayout rightbar={<div><h3>Bộ lọc nhanh</h3><p className="seller-muted">Seller chỉ cập nhật theo flow hợp lệ, không được tự set hoàn tiền.</p></div>}>
      <section className="seller-panel">
        <h1 className="seller-page-title">Quản lý đơn hàng</h1>
        <div className="purchase-tabs">
          {tabs.map((tab) => <button key={tab} type="button" className={status === tab ? 'active' : ''} onClick={() => setStatus(tab)}>{tab === 'all' ? 'Tất cả' : ORDER_STATUS_LABELS[tab]}</button>)}
        </div>
        <div className="seller-toolbar">
          <input className="seller-input" placeholder="Tìm mã đơn/khách hàng" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </div>
        {message ? <div className="status-message">{message}</div> : null}
        <table className="seller-table">
          <thead>
            <tr><th>Mã đơn</th><th>Khách</th><th>Sản phẩm</th><th>Vận chuyển</th><th>Thành tiền</th><th>Trạng thái</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan="7">Chưa có đơn hàng phù hợp.</td></tr>
            ) : filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.address?.name || order.customerId}</td>
                <td>{order.items?.[0]?.name}{order.items?.length > 1 ? ` +${order.items.length - 1}` : ''}</td>
                <td>{order.shippingProvider}</td>
                <td>{formatCurrency(order.finalTotal)}</td>
                <td>{ORDER_STATUS_LABELS[order.status] || order.status}</td>
                <td>
                  <div className="seller-row-actions">
                    <Link to={`/seller/orders/${order.id}`}>Xem</Link>
                    {order.status === 'pending' ? <button type="button" onClick={() => handleUpdate(order, 'pickup')}>Xác nhận</button> : null}
                    {order.status === 'pending' ? <button type="button" onClick={() => handleUpdate(order, 'cancelled')}>Hủy</button> : null}
                    {order.status === 'pickup' ? <button type="button" onClick={() => handleUpdate(order, 'shipping')}>Giao vận chuyển</button> : null}
                    {order.status === 'shipping' ? <button type="button" onClick={() => handleUpdate(order, 'delivered')}>Đã giao</button> : null}
                    {order.status === 'delivered' ? <button type="button" onClick={() => handleUpdate(order, 'completed')}>Hoàn thành</button> : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerOrders
