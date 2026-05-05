import { useMemo, useState } from 'react'
import { formatCurrency, getOrders, pushNotification, saveOrders } from '../../services/adminStore.service'

const labels = { pending: 'Chờ xác nhận', pickup: 'Đang xử lý', shipping: 'Đang giao', delivered: 'Đã giao', completed: 'Hoàn thành', cancelled: 'Đã hủy', return_requested: 'Trả hàng' }
const flow = ['pending', 'pickup', 'shipping', 'delivered', 'completed']

function AdminOrders() {
  const [orders, setOrders] = useState(() => getOrders())
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('')
  const filtered = useMemo(() => orders.filter((order) => {
    const text = `${order.id} ${order.address?.name || ''} ${order.shopId || ''}`.toLowerCase()
    return (!keyword || text.includes(keyword.toLowerCase())) && (!status || order.status === status)
  }), [keyword, orders, status])

  const persist = (next) => { setOrders(next); saveOrders(next) }
  const updateStatus = (order, nextStatus) => {
    if (order.status === 'completed' && nextStatus !== 'completed') return window.alert('Không thể đổi completed về trạng thái trước.')
    if (nextStatus === 'cancelled' && order.status === 'completed') return window.alert('Không thể hủy đơn completed.')
    if (flow.includes(order.status) && flow.includes(nextStatus) && flow.indexOf(nextStatus) < flow.indexOf(order.status)) return window.alert('Transition không hợp lệ.')
    const cancelReason = nextStatus === 'cancelled' ? window.prompt('Lý do hủy') : ''
    persist(orders.map((item) => item.id === order.id ? { ...item, status: nextStatus, cancelReason: cancelReason || item.cancelReason, updatedAt: new Date().toISOString() } : item))
    pushNotification(order.customerId, { type: 'order', title: 'Admin cập nhật đơn hàng', message: `Đơn ${order.id}: ${labels[nextStatus] || nextStatus}` })
    pushNotification(order.sellerId, { type: 'order', title: 'Admin cập nhật đơn hàng', message: `Đơn ${order.id}: ${labels[nextStatus] || nextStatus}` })
  }

  return (
    <div className="admin-page">
      <header className="admin-hero"><p className="admin-eyebrow">UC-18</p><h1>Quản lý đơn hàng</h1></header>
      <section className="admin-panel">
        <div className="admin-form-row"><input className="admin-search-input" placeholder="Tìm mã đơn/customer/seller" value={keyword} onChange={(e) => setKeyword(e.target.value)} /><select className="admin-search-input" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Tất cả</option>{Object.keys(labels).map((key) => <option key={key} value={key}>{labels[key]}</option>)}</select></div>
        <table className="admin-table"><thead><tr><th>Mã</th><th>Customer</th><th>Seller</th><th>Items</th><th>Tổng</th><th>Payment</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{filtered.map((order) => <tr key={order.id}><td>{order.id}</td><td>{order.address?.name}</td><td>{order.shopId}</td><td>{order.items?.length || 0}</td><td>{formatCurrency(order.finalTotal)}</td><td>{order.paymentMethod}/{order.paymentStatus}</td><td>{labels[order.status] || order.status}</td><td>{['pickup', 'shipping', 'delivered', 'completed', 'cancelled'].map((next) => <button key={next} className="admin-table-btn" onClick={() => updateStatus(order, next)}>{labels[next]}</button>)}</td></tr>)}</tbody></table>
      </section>
    </div>
  )
}

export default AdminOrders
