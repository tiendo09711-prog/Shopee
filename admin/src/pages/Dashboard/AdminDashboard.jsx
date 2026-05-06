import { useEffect, useState } from 'react'
import { formatCurrency, getDashboard } from '../../services/adminStore.service'

const empty = {
  revenue: 0, revenueToday: 0, totalOrders: 0, pendingOrders: 0,
  customers: 0, sellers: 0, activeProducts: 0, pendingProducts: 0,
  ordersByStatus: {}, topProducts: [],
}

function AdminDashboard() {
  const [stats, setStats] = useState(empty)
  const [filters, setFilters] = useState({ range: '30', from: '', to: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getDashboard(filters)
      .then((data) => setStats({ ...empty, ...data }))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [filters])

  if (loading) return <div className="admin-page"><div style={{ padding: 32 }}>Dang tai du lieu...</div></div>

  return (
    <div className="admin-page">
      <header className="admin-hero"><p className="admin-eyebrow">Dashboard</p><h1>Tong quan PShop</h1><p className="admin-hero-copy">So lieu thuc tu MongoDB database.</p></header>
      <section className="admin-panel">
        <div className="admin-form-row">
          <select className="admin-search-input" value={filters.range} onChange={(e) => setFilters((prev) => ({ ...prev, range: e.target.value }))}>
            <option value="7">7 ngay</option>
            <option value="30">30 ngay</option>
            <option value="all">Tat ca</option>
          </select>
          <input className="admin-search-input" type="date" value={filters.from} onChange={(e) => setFilters((prev) => ({ ...prev, from: e.target.value }))} />
          <input className="admin-search-input" type="date" value={filters.to} onChange={(e) => setFilters((prev) => ({ ...prev, to: e.target.value }))} />
        </div>
      </section>
      <section className="admin-summary-grid">
        <article className="admin-card"><span>Doanh thu hom nay</span><strong>{formatCurrency(stats.revenueToday)}</strong></article>
        <article className="admin-card"><span>Tong doanh thu</span><strong>{formatCurrency(stats.revenue)}</strong></article>
        <article className="admin-card"><span>Tong don</span><strong>{stats.totalOrders}</strong></article>
        <article className="admin-card"><span>Don cho xu ly</span><strong>{stats.pendingOrders}</strong></article>
        <article className="admin-card"><span>Customer</span><strong>{stats.customers}</strong></article>
        <article className="admin-card"><span>Seller</span><strong>{stats.sellers}</strong></article>
        <article className="admin-card"><span>Active products</span><strong>{stats.activeProducts}</strong></article>
        <article className="admin-card"><span>Pending products</span><strong>{stats.pendingProducts}</strong></article>
      </section>
      <section className="admin-panel">
        <h2>Top san pham theo doanh thu</h2>
        <table className="admin-table">
          <thead><tr><th>San pham</th><th>Da ban</th><th>Doanh thu</th></tr></thead>
          <tbody>
            {(stats.topProducts || []).map((item) => (
              <tr key={item.product}><td>{item.name}</td><td>{item.quantity}</td><td>{formatCurrency(item.revenue)}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default AdminDashboard
