import { useMemo, useState } from 'react'
import { formatCurrency, getOrders, getProducts, getReports, saveProducts, saveReports } from '../../services/adminStore.service'

function AdminReports() {
  const [reports, setReports] = useState(() => getReports())
  const [products, setProducts] = useState(() => getProducts())
  const [status, setStatus] = useState('')
  const orders = getOrders()
  const filteredReports = useMemo(() => reports.filter((report) => !status || report.status === status), [reports, status])
  const revenueByDay = orders.reduce((acc, order) => {
    const day = new Date(order.createdAt).toLocaleDateString('vi-VN')
    acc[day] = (acc[day] || 0) + Number(order.finalTotal || 0)
    return acc
  }, {})

  const persistReports = (next) => { setReports(next); saveReports(next) }
  const updateReport = (report, nextStatus, action) => {
    const note = window.prompt('Ghi chú xử lý') || ''
    persistReports(reports.map((item) => item.id === report.id ? { ...item, status: nextStatus, updatedAt: new Date().toISOString(), auditTrail: [...(item.auditTrail || []), { action, note, by: 'admin', at: new Date().toISOString() }] } : item))
  }
  const hideProduct = (report) => {
    const nextProducts = products.map((product) => product.id === report.targetId ? { ...product, status: 'hidden' } : product)
    setProducts(nextProducts); saveProducts(nextProducts); updateReport(report, 'resolved', 'hide_product')
  }

  return (
    <div className="admin-page">
      <header className="admin-hero"><p className="admin-eyebrow">UC-19/C7</p><h1>Báo cáo thống kê & khiếu nại</h1></header>
      <section className="admin-summary-grid">
        <article className="admin-card"><span>Tổng doanh thu</span><strong>{formatCurrency(orders.reduce((sum, order) => sum + Number(order.finalTotal || 0), 0))}</strong></article>
        <article className="admin-card"><span>Tổng đơn</span><strong>{orders.length}</strong></article>
        <article className="admin-card"><span>Report mở</span><strong>{reports.filter((r) => r.status === 'open').length}</strong></article>
        <article className="admin-card"><span>Đơn pending</span><strong>{orders.filter((o) => o.status === 'pending').length}</strong></article>
      </section>
      <section className="admin-panel"><h2>Doanh thu theo ngày</h2><button className="admin-table-btn" onClick={() => window.alert(JSON.stringify(revenueByDay, null, 2))}>Export CSV mock</button><table className="admin-table"><tbody>{Object.entries(revenueByDay).map(([day, revenue]) => <tr key={day}><td>{day}</td><td>{formatCurrency(revenue)}</td></tr>)}</tbody></table></section>
      <section className="admin-panel">
        <div className="admin-form-row"><h2>Report customer</h2><select className="admin-search-input" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Tất cả</option><option value="open">open</option><option value="reviewing">reviewing</option><option value="resolved">resolved</option><option value="rejected">rejected</option></select></div>
        <table className="admin-table"><thead><tr><th>Type</th><th>Target</th><th>Reason</th><th>Status</th><th>Priority</th><th>Thao tác</th></tr></thead><tbody>{filteredReports.map((report) => <tr key={report.id}><td>{report.type}</td><td>{report.targetType}:{report.targetId}</td><td>{report.reason}</td><td>{report.status}</td><td>{report.priority}</td><td><button className="admin-table-btn" onClick={() => updateReport(report, 'reviewing', 'reviewing')}>Review</button><button className="admin-table-btn" onClick={() => updateReport(report, 'resolved', 'resolve')}>Resolve</button><button className="admin-table-btn" onClick={() => updateReport(report, 'rejected', 'reject')}>Reject</button>{report.targetType === 'product' ? <button className="admin-table-btn" onClick={() => hideProduct(report)}>Ẩn SP</button> : null}</td></tr>)}</tbody></table>
      </section>
    </div>
  )
}

export default AdminReports
