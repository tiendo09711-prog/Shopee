import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { useSeller } from '../../contexts/SellerContext'
import { getSellerAnalytics } from '../../services/sellerAnalytics.service'
import { formatCurrency } from '../../utils/formatCurrency'

function SellerDashboard() {
  const { seller } = useSeller()
  const stats = getSellerAnalytics(seller.id, '30')

  const rightbar = (
    <>
      <h3>Thông Báo</h3>
      <div className="seller-utility-list">
        <div className="seller-info-card"><strong>Đơn chờ xác nhận</strong><div className="seller-muted">{stats.pending} đơn cần xử lý.</div></div>
        <div className="seller-info-card"><strong>Sản phẩm cần tối ưu</strong><div className="seller-muted">{stats.products.filter((item) => item.stock <= 5).length} sản phẩm tồn thấp.</div></div>
      </div>
    </>
  )

  return (
    <SellerDashboardLayout rightbar={rightbar}>
      <section className="seller-panel">
        <div className="seller-banner">
          <span>Tăng đơn cùng PShop • Số liệu lấy từ localStorage orders/products</span>
        </div>

        <h2 className="seller-page-title">Danh sách cần làm</h2>
        <div className="seller-task-grid">
          <div className="seller-task-card"><h4>Đơn mới hôm nay</h4><div className="seller-big-number">{stats.newOrders}</div></div>
          <div className="seller-task-card"><h4>Chờ xác nhận</h4><div className="seller-big-number">{stats.pending}</div></div>
          <div className="seller-task-card"><h4>Đang giao</h4><div className="seller-big-number">{stats.shipping}</div></div>
          <div className="seller-task-card"><h4>Tỷ lệ chuyển đổi</h4><div className="seller-big-number">{stats.conversion}%</div></div>
        </div>
      </section>

      <section className="seller-panel" style={{ marginTop: 16 }}>
        <h2 className="seller-page-title">Phân Tích Bán Hàng</h2>
        <div className="seller-stats-grid">
          <div className="seller-stat-card"><h4>Doanh thu hôm nay</h4><div className="seller-big-number">{formatCurrency(stats.revenueToday)}</div></div>
          <div className="seller-stat-card"><h4>Doanh thu 30 ngày</h4><div className="seller-big-number">{formatCurrency(stats.revenue)}</div></div>
          <div className="seller-stat-card"><h4>Sản phẩm</h4><div className="seller-big-number">{stats.products.length}</div></div>
          <div className="seller-stat-card"><h4>Đơn hoàn thành</h4><div className="seller-big-number">{stats.completedOrders.length}</div></div>
        </div>
        <h3>Top sản phẩm bán chạy</h3>
        <table className="seller-table">
          <tbody>
            {stats.topProducts.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.quantity} bán</td><td>{formatCurrency(item.revenue)}</td></tr>)}
          </tbody>
        </table>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerDashboard
