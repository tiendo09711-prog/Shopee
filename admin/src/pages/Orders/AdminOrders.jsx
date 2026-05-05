import { useEffect, useMemo, useState } from 'react'
import { formatCurrency, getOrders, updateOrderStatus } from '../../services/adminStore.service'

const labels = {
  pending: 'Chờ xác nhận', confirmed: 'Đã xác nhận', processing: 'Đang chuẩn bị',
  shipping: 'Đang giao', delivered: 'Đã giao', completed: 'Hoàn thành',
  cancelled: 'Đã hủy', return_requested: 'Trả hàng', refunded: 'Hoàn tiền',
}

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const reload = async () => {
    const data = await getOrders()
    setOrders(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    reload().catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => orders.filter((order) => {
    const text = `${order.orderCode || ''} ${order._id || ''} ${order.shippingAddress?.fullName || ''} ${order.seller?.shopName || ''}`.toLowerCase()
    return (!keyword || text.includes(keyword.toLowerCase())) && (!status || order.status === status)
  }), [keyword, orders, status])

  const updateStatus = async (order, nextStatus) => {
    const id = order._id || order.id
    try {
      const cancelReason = nextStatus === 'cancelled' ? window.prompt('Lý do hủy') : ''
      await updateOrderStatus(id, nextStatus, cancelReason || '')
      setMessage('Đã cập nhật trạng thái.')
      await reload()
    } catch (err) {
      setMessage(err.message)
    }
  }

  if (loading) return <div className="admin-page"><div style={{ padding: 32 }}>Đang tải...</div></div>

  return (
    <div className="admin-page">
      <header className="admin-hero"><p className="admin-eyebrow">UC-18</p><h1>Quản lý đơn hàng</h1></header>
      <section className="admin-panel">
        {message ? <div className="admin-message">{message}</div> : null}
        <div className="admin-form-row">
          <input className="admin-search-input" placeholder="Tìm mã đơn/customer/seller" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          <select className="admin-search-input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Tất cả</option>
            {Object.keys(labels).map((key) => <option key={key} value={key}>{labels[key]}</option>)}
          </select>
        </div>
        <table className="admin-table">
          <thead><tr><th>Mã</th><th>Customer</th><th>Seller</th><th>Items</th><th>Tổng</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order._id || order.id}>
                <td>{order.orderCode || order._id}</td>
                <td>{order.customer?.name || order.shippingAddress?.fullName}</td>
                <td>{order.seller?.shopName}</td>
                <td>{order.items?.length || 0}</td>
                <td>{formatCurrency(order.total)}</td>
                <td>{labels[order.status] || order.status}</td>
                <td>
                  {['confirmed', 'processing', 'shipping', 'delivered', 'completed', 'cancelled'].map((next) => (
                    <button key={next} className="admin-table-btn" onClick={() => updateStatus(order, next)}>{labels[next]}</button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default AdminOrders
