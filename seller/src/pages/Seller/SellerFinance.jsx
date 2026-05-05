import { useMemo, useState } from 'react'
import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { useSeller } from '../../contexts/SellerContext'
import { exportSellerOrdersCsv, getSellerAnalytics } from '../../services/sellerAnalytics.service'
import { formatCurrency } from '../../utils/formatCurrency'

function SellerFinance() {
  const { seller } = useSeller()
  const [range, setRange] = useState('30')
  const stats = useMemo(() => getSellerAnalytics(seller.id, range), [range, seller.id])
  const platformFee = Math.round(stats.revenue * 0.03)

  const handleExport = () => {
    const csv = exportSellerOrdersCsv(seller.id, range)
    window.alert(`CSV mock:\n${csv}`)
  }

  return (
    <SellerDashboardLayout rightbar={<div><h3>Ví PShop mock</h3><p className="seller-muted">Số dư khả dụng: {formatCurrency(Math.max(0, stats.revenue - platformFee))}</p></div>}>
      <section className="seller-panel">
        <div className="seller-page-head">
          <h1 className="seller-page-title">Tài chính</h1>
          <div className="seller-row-actions">
            <select className="seller-input" value={range} onChange={(e) => setRange(e.target.value)}>
              <option value="7">7 ngày</option>
              <option value="30">30 ngày</option>
              <option value="all">Tất cả</option>
            </select>
            <button type="button" onClick={handleExport}>Export CSV</button>
          </div>
        </div>
        <div className="seller-stats-grid">
          <div className="seller-stat-card"><h4>Doanh thu tổng</h4><div className="seller-big-number">{formatCurrency(stats.revenue)}</div></div>
          <div className="seller-stat-card"><h4>Đơn hoàn thành</h4><div className="seller-big-number">{stats.completedOrders.length}</div></div>
          <div className="seller-stat-card"><h4>Phí sàn mock</h4><div className="seller-big-number">{formatCurrency(platformFee)}</div></div>
          <div className="seller-stat-card"><h4>Lợi nhuận tạm tính</h4><div className="seller-big-number">{formatCurrency(stats.revenue - platformFee)}</div></div>
        </div>
        <h3>Doanh thu theo sản phẩm</h3>
        <table className="seller-table">
          <thead><tr><th>Sản phẩm</th><th>Đã bán</th><th>Doanh thu</th></tr></thead>
          <tbody>{stats.topProducts.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.quantity}</td><td>{formatCurrency(item.revenue)}</td></tr>)}</tbody>
        </table>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerFinance
