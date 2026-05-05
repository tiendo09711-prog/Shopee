import { useEffect, useState } from 'react'
import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { useSeller } from '../../contexts/SellerContext'
import { getSellerAnalytics } from '../../services/sellerAnalytics.service'
import { formatCurrency } from '../../utils/formatCurrency'

const emptyStats = {
  revenue: 0, revenueToday: 0, newOrders: 0, pending: 0, shipping: 0,
  products: [], orders: [], completedOrders: [], topProducts: [], conversion: 0,
}

function SellerDashboard() {
  const { seller } = useSeller()
  const [stats, setStats] = useState(emptyStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!seller?.id) return
    setLoading(true)
    getSellerAnalytics(seller.id, '30')
      .then((data) => setStats({ ...emptyStats, ...data }))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [seller])

  const completedOrders = stats.completedOrders || stats.orders?.filter((o) => o.status === 'completed') || []
  const conversion = stats.conversion ?? (stats.orders?.length ? Math.round((completedOrders.length / stats.orders.length) * 100) : 0)

  const rightbar = (
    <>
      <h3>Thông Báo</h3>
      <div className="seller-utility-list">
        <div className="seller-info-card"><strong>Đơn chờ xác nhận</strong><div className="seller-muted">{stats.pending} đơn cần xử lý.</div></div>
        <div className="seller-info-card"><strong>Sản phẩm cần tối ưu</strong><div className="seller-muted">{stats.products?.filter((item) => (item.stock ?? 0) <= 5).length} sản phẩm tồn thấp.</div></div>
      </div>
    </>
  )

  if (loading) return <SellerDashboardLayout rightbar={rightbar}><div style={{ padding: 32 }}>Đang tải dữ liệu...</div></SellerDashboardLayout>

  return (
    <SellerDashboardLayout rightbar={rightbar}>
      <section className="seller-panel">
        <div className="seller-banner">
          <span>Tăng đơn cùng PShop • Số liệu từ database thực</span>
        </div>

        <h2 className="seller-page-title">Danh sách cần làm</h2>
        <div className="seller-task-grid">
          <div className="seller-task-card"><h4>Đơn mới hôm nay</h4><div className="seller-big-number">{stats.newOrders}</div></div>
          <div className="seller-task-card"><h4>Chờ xác nhận</h4><div className="seller-big-number">{stats.pending}</div></div>
          <div className="seller-task-card"><h4>Đang giao</h4><div className="seller-big-number">{stats.shipping}</div></div>
          <div className="seller-task-card"><h4>Tỷ lệ chuyển đổi</h4><div className="seller-big-number">{conversion}%</div></div>
        </div>
      </section>

      <section className="seller-panel" style={{ marginTop: 16 }}>
        <h2 className="seller-page-title">Phân Tích Bán Hàng</h2>
        <div className="seller-stats-grid">
          <div className="seller-stat-card"><h4>Doanh thu hôm nay</h4><div className="seller-big-number">{formatCurrency(stats.revenueToday)}</div></div>
          <div className="seller-stat-card"><h4>Doanh thu 30 ngày</h4><div className="seller-big-number">{formatCurrency(stats.revenue)}</div></div>
          <div className="seller-stat-card"><h4>Sản phẩm</h4><div className="seller-big-number">{stats.products?.length ?? 0}</div></div>
          <div className="seller-stat-card"><h4>Đơn hoàn thành</h4><div className="seller-big-number">{completedOrders.length}</div></div>
        </div>
        <h3>Top sản phẩm bán chạy</h3>
        <table className="seller-table">
          <tbody>
            {(stats.topProducts || []).map((item) => (
              <tr key={item._id || item.id}><td>{item.name}</td><td>{item.sold ?? 0} bán</td><td>{formatCurrency(item.price)}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerDashboard
