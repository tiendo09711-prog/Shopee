import { useEffect, useMemo, useState } from 'react'
import { formatCurrency, getDashboard, getReports, updateReport } from '../../services/adminStore.service'

function AdminReports() {
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState({ revenue: 0, totalOrders: 0, pendingOrders: 0 })
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const reload = async () => {
    const [reportData, dashData] = await Promise.all([getReports(), getDashboard()])
    setReports(Array.isArray(reportData) ? reportData : [])
    setStats({ ...{ revenue: 0, totalOrders: 0, pendingOrders: 0 }, ...dashData })
  }

  useEffect(() => {
    reload().catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filteredReports = useMemo(() => reports.filter((r) => !status || r.status === status), [reports, status])

  const handleUpdate = async (report, nextStatus) => {
    const note = window.prompt('Ghi chú xử lý') || ''
    try {
      await updateReport(report._id || report.id, nextStatus, note)
      setMessage('Đã cập nhật report.')
      await reload()
    } catch (err) {
      setMessage(err.message)
    }
  }

  if (loading) return <div className="admin-page"><div style={{ padding: 32 }}>Đang tải...</div></div>

  return (
    <div className="admin-page">
      <header className="admin-hero"><p className="admin-eyebrow">UC-19/C7</p><h1>Báo cáo thống kê & khiếu nại</h1></header>
      <section className="admin-summary-grid">
        <article className="admin-card"><span>Tổng doanh thu</span><strong>{formatCurrency(stats.revenue)}</strong></article>
        <article className="admin-card"><span>Tổng đơn</span><strong>{stats.totalOrders}</strong></article>
        <article className="admin-card"><span>Report mở</span><strong>{reports.filter((r) => r.status === 'open').length}</strong></article>
        <article className="admin-card"><span>Đơn pending</span><strong>{stats.pendingOrders}</strong></article>
      </section>
      {message ? <div className="admin-message">{message}</div> : null}
      <section className="admin-panel">
        <div className="admin-form-row">
          <h2>Report customer</h2>
          <select className="admin-search-input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Tất cả</option>
            <option value="open">open</option>
            <option value="reviewing">reviewing</option>
            <option value="resolved">resolved</option>
            <option value="rejected">rejected</option>
          </select>
        </div>
        <table className="admin-table">
          <thead><tr><th>Type</th><th>Target</th><th>Reason</th><th>Status</th><th>Priority</th><th>Thao tác</th></tr></thead>
          <tbody>
            {filteredReports.map((report) => (
              <tr key={report._id || report.id}>
                <td>{report.type}</td>
                <td>{report.targetType}:{report.targetId}</td>
                <td>{report.reason}</td>
                <td>{report.status}</td>
                <td>{report.priority}</td>
                <td>
                  <button className="admin-table-btn" onClick={() => handleUpdate(report, 'reviewing')}>Review</button>
                  <button className="admin-table-btn" onClick={() => handleUpdate(report, 'resolved')}>Resolve</button>
                  <button className="admin-table-btn" onClick={() => handleUpdate(report, 'rejected')}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default AdminReports
