import { useEffect, useState } from 'react'
import { formatCurrency, getDashboard } from '../../services/adminStore.service'

const empty = {
  revenue: 0, revenueToday: 0, totalOrders: 0, pendingOrders: 0,
  customers: 0, sellers: 0, activeProducts: 0, pendingProducts: 0,
  ordersByStatus: {},
}

function AdminDashboard() {
  const [stats, setStats] = useState(empty)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then((data) => setStats({ ...empty, ...data }))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="admin-page"><div style={{ padding: 32 }}>Đang tải dữ liệu...</div></div>

  return (
    <div className="admin-page">
      <header className="admin-hero"><p className="admin-eyebrow">Dashboard</p><h1>Tổng quan PShop</h1><p className="admin-hero-copy">Số liệu thực từ MongoDB database.</p></header>
      <section className="admin-summary-grid">
        <article className="admin-card"><span>Doanh thu hôm nay</span><strong>{formatCurrency(stats.revenueToday)}</strong></article>
        <article className="admin-card"><span>Tổng doanh thu</span><strong>{formatCurrency(stats.revenue)}</strong></article>
        <article className="admin-card"><span>Tổng đơn</span><strong>{stats.totalOrders}</strong></article>
        <article className="admin-card"><span>Đơn chờ xử lý</span><strong>{stats.pendingOrders}</strong></article>
        <article className="admin-card"><span>Customer</span><strong>{stats.customers}</strong></article>
        <article className="admin-card"><span>Seller</span><strong>{stats.sellers}</strong></article>
        <article className="admin-card"><span>Active products</span><strong>{stats.activeProducts}</strong></article>
        <article className="admin-card"><span>Pending products</span><strong>{stats.pendingProducts}</strong></article>
      </section>
    </div>
  )
}

export default AdminDashboard
