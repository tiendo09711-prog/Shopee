import { useEffect, useState } from 'react'
import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { useSeller } from '../../contexts/SellerContext'
import { getSellerAnalytics } from '../../services/sellerAnalytics.service'
import { formatCurrency } from '../../utils/formatCurrency'

const emptyStats = {
  revenue: 0, completedOrders: [], topProducts: [],
}

function SellerFinance() {
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

  const platformFee = Math.round((stats.revenue || 0) * 0.03)
  const profit = (stats.revenue || 0) - platformFee

  const handleExport = () => {
    const rows = [
      ['Sản phẩm', 'Số lượng', 'Doanh thu'],
      ...(stats.topProducts || []).map((p) => [p.name, p.quantity, p.revenue]),
    ]
    const csv = rows.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finance_${range}days.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const rightbar = (
    <div>
      <h3>Ví PShop</h3>
      <p className="seller-muted">Phí sàn: 3% doanh thu</p>
      <p className="seller-muted">Số dư tạm tính: <strong>{formatCurrency(Math.max(0, profit))}</strong></p>
    </div>
  )

  if (loading) return <SellerDashboardLayout rightbar={rightbar}><div style={{ padding: 32 }}>Đang tải dữ liệu tài chính...</div></SellerDashboardLayout>

  return (
    <SellerDashboardLayout rightbar={rightbar}>
      <section className="seller-panel">
        <div className="seller-page-head">
          <h1 className="seller-page-title">Tài chính</h1>
          <div className="seller-row-actions">
            <select className="seller-input" value={range} onChange={(e) => setRange(e.target.value)}>
              <option value="7">7 ngày</option>
              <option value="30">30 ngày</option>
              <option value="all">Tất cả</option>
            </select>
            <input className="seller-input" type="date" value={dates.from} onChange={(e) => setDates((prev) => ({ ...prev, from: e.target.value }))} />
            <input className="seller-input" type="date" value={dates.to} onChange={(e) => setDates((prev) => ({ ...prev, to: e.target.value }))} />
            <button type="button" className="seller-primary-btn" onClick={handleExport}>Export CSV</button>
          </div>
        </div>

        {error ? <div className="status-message text-danger">{error}</div> : null}

        <div className="seller-stats-grid">
          <div className="seller-stat-card"><h4>Doanh thu tổng</h4><div className="seller-big-number">{formatCurrency(stats.revenue)}</div></div>
          <div className="seller-stat-card"><h4>Đơn hoàn thành</h4><div className="seller-big-number">{(stats.completedOrders || []).length}</div></div>
          <div className="seller-stat-card"><h4>Phí sàn (3%)</h4><div className="seller-big-number">{formatCurrency(platformFee)}</div></div>
          <div className="seller-stat-card"><h4>Lợi nhuận tạm tính</h4><div className="seller-big-number">{formatCurrency(profit)}</div></div>
        </div>

        <h3>Doanh thu theo sản phẩm</h3>
        {(stats.topProducts || []).length === 0 ? (
          <p className="seller-muted">Chưa có dữ liệu doanh thu trong khoảng thời gian này.</p>
        ) : (
          <table className="seller-table">
            <thead><tr><th>Sản phẩm</th><th>Đã bán</th><th>Doanh thu</th></tr></thead>
            <tbody>
              {(stats.topProducts || []).map((item) => (
                <tr key={item.id || item._id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
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

export default SellerFinance
