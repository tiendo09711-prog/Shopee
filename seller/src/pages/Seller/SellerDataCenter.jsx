import { useEffect, useState } from 'react'
import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { useSeller } from '../../contexts/SellerContext'
import { getSellerAnalytics } from '../../services/sellerAnalytics.service'
import { formatCurrency } from '../../utils/formatCurrency'

const ORDER_STATUS_LABELS = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  processing: 'Đang chuẩn bị',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  refunding: 'Trả hàng',
  refunded: 'Hoàn tiền',
}

const emptyStats = {
  revenue: 0, orders: [], completedOrders: [], topProducts: [], statusCounts: {}, conversion: 0,
}

function SellerDataCenter() {
  const { seller } = useSeller()
  const [range, setRange] = useState('30')
  const [dates, setDates] = useState({ from: '', to: '' })
  const [stats, setStats] = useState(emptyStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!seller?.id && !seller?._id) return
    setLoading(true)
    setError('')
    getSellerAnalytics(seller._id || seller.id, range, dates)
      .then((data) => setStats({ ...emptyStats, ...data }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [seller, range, dates])

  const statusCounts = stats.statusCounts || {}
  const maxStatus = Math.max(1, ...Object.values(statusCounts))

  const rightbar = (
    <div>
      <h3>Xu hướng</h3>
      <p className="seller-muted">Dữ liệu thực từ database — cập nhật theo thời gian thực.</p>
    </div>
  )

  if (loading) return <SellerDashboardLayout rightbar={rightbar}><div style={{ padding: 32 }}>Đang tải dữ liệu phân tích...</div></SellerDashboardLayout>

  return (
    <SellerDashboardLayout rightbar={rightbar}>
      <section className="seller-panel">
        <div className="seller-page-head">
          <h1 className="seller-page-title">Phân tích bán hàng</h1>
          <select className="seller-input" value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="7">7 ngày</option>
            <option value="30">30 ngày</option>
            <option value="all">Tất cả</option>
          </select>
          <input className="seller-input" type="date" value={dates.from} onChange={(e) => setDates((prev) => ({ ...prev, from: e.target.value }))} />
          <input className="seller-input" type="date" value={dates.to} onChange={(e) => setDates((prev) => ({ ...prev, to: e.target.value }))} />
        </div>

        {error ? <div className="status-message text-danger">{error}</div> : null}

        <div className="seller-stats-grid">
          <div className="seller-stat-card"><h4>Doanh thu</h4><div className="seller-big-number">{formatCurrency(stats.revenue)}</div></div>
          <div className="seller-stat-card"><h4>Tổng đơn</h4><div className="seller-big-number">{(stats.orders || []).length}</div></div>
          <div className="seller-stat-card"><h4>Hoàn thành</h4><div className="seller-big-number">{(stats.completedOrders || []).length}</div></div>
          <div className="seller-stat-card"><h4>Tỷ lệ chuyển đổi</h4><div className="seller-big-number">{stats.conversion ?? 0}%</div></div>
        </div>

        <h3>Số lượng đơn theo trạng thái</h3>
        {Object.keys(statusCounts).length === 0 ? (
          <p className="seller-muted">Chưa có đơn hàng trong khoảng thời gian này.</p>
        ) : (
          <div className="seller-bar-list">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="seller-bar-row">
                <span>{ORDER_STATUS_LABELS[status] || status}</span>
                <div><i style={{ width: `${(count / maxStatus) * 100}%` }} /></div>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        )}

        <h3>Top sản phẩm bán chạy</h3>
        {(stats.topProducts || []).length === 0 ? (
          <p className="seller-muted">Chưa có dữ liệu sản phẩm.</p>
        ) : (
          <table className="seller-table">
            <thead><tr><th>Sản phẩm</th><th>Đã bán</th><th>Doanh thu</th></tr></thead>
            <tbody>
              {(stats.topProducts || []).map((item) => (
                <tr key={item.id || item._id}>
                  <td>{item.name}</td>
                  <td>{item.quantity} bán</td>
                  <td>{formatCurrency(item.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerDataCenter
