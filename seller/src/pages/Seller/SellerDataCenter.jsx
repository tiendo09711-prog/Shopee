import { useMemo, useState } from 'react'
import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { useSeller } from '../../contexts/SellerContext'
import { getSellerAnalytics } from '../../services/sellerAnalytics.service'
import { ORDER_STATUS_LABELS } from '../../services/sellerOrder.service'
import { formatCurrency } from '../../utils/formatCurrency'

function SellerDataCenter() {
  const { seller } = useSeller()
  const [range, setRange] = useState('30')
  const stats = useMemo(() => getSellerAnalytics(seller.id, range), [range, seller.id])
  const maxStatus = Math.max(1, ...Object.values(stats.statusCounts))

  return (
    <SellerDashboardLayout rightbar={<div><h3>Xu hướng</h3><p className="seller-muted">Dữ liệu được tính từ đơn và sản phẩm thật trong localStorage.</p></div>}>
      <section className="seller-panel">
        <div className="seller-page-head">
          <h1 className="seller-page-title">Dữ liệu</h1>
          <select className="seller-input" value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="7">7 ngày</option>
            <option value="30">30 ngày</option>
            <option value="all">Tất cả</option>
          </select>
        </div>
        <div className="seller-stats-grid">
          <div className="seller-stat-card"><h4>Doanh thu</h4><div className="seller-big-number">{formatCurrency(stats.revenue)}</div></div>
          <div className="seller-stat-card"><h4>Tổng đơn</h4><div className="seller-big-number">{stats.orders.length}</div></div>
          <div className="seller-stat-card"><h4>Hoàn thành</h4><div className="seller-big-number">{stats.completedOrders.length}</div></div>
          <div className="seller-stat-card"><h4>Tỷ lệ chuyển đổi</h4><div className="seller-big-number">{stats.conversion}%</div></div>
        </div>
        <h3>Số lượng đơn theo trạng thái</h3>
        <div className="seller-bar-list">
          {Object.entries(stats.statusCounts).map(([status, count]) => (
            <div key={status} className="seller-bar-row">
              <span>{ORDER_STATUS_LABELS[status] || status}</span>
              <div><i style={{ width: `${(count / maxStatus) * 100}%` }} /></div>
              <strong>{count}</strong>
            </div>
          ))}
        </div>
        <h3>Top sản phẩm bán chạy</h3>
        <table className="seller-table">
          <tbody>{stats.topProducts.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.quantity} bán</td><td>{formatCurrency(item.revenue)}</td></tr>)}</tbody>
        </table>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerDataCenter
