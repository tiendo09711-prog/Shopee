import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { useSeller } from '../../contexts/SellerContext'

function SellerDashboard() {
  const { seller } = useSeller()
  const stats = seller?.stats || {}

  const rightbar = (
    <>
      <h3>Thông Báo</h3>
      <div className="seller-utility-list">
        <div className="seller-info-card"><strong>Giảm rủi ro thất thoát hàng hóa</strong><div className="seller-muted">Trải nghiệm quản lý đơn giao không thành công.</div></div>
        <div className="seller-info-card"><strong>HOT giá chỉ có trên Live</strong><div className="seller-muted">Cài đặt gói quyền lợi cho đơn từ livestream.</div></div>
      </div>
      <h3 style={{ marginTop: 24 }}>Nhiệm Vụ Người Bán</h3>
      <div className="seller-info-card">
        <strong>Đăng tải 5 sản phẩm có tối thiểu 3 hình ảnh mô tả.</strong>
        <div className="seller-muted" style={{ marginTop: 8 }}>Nhận 1 voucher giảm giá 15.000đ</div>
      </div>
    </>
  )

  return (
    <SellerDashboardLayout rightbar={rightbar}>
      <section className="seller-panel">
        <div className="seller-banner">
          <span>Tăng đơn cùng KOL • Tỷ suất hoàn vốn trung bình 16 lần</span>
          <button className="seller-outline-btn" type="button">Tạo nhanh</button>
        </div>

        <h2 className="seller-page-title">Danh sách cần làm</h2>
        <div className="seller-task-grid">
          <div className="seller-task-card"><h4>Chờ xác nhận</h4><div className="seller-big-number">{stats.pendingConfirm}</div></div>
          <div className="seller-task-card"><h4>Chờ lấy hàng</h4><div className="seller-big-number">{stats.waitingPickup}</div></div>
          <div className="seller-task-card"><h4>Đã xử lý</h4><div className="seller-big-number">{stats.processing}</div></div>
          <div className="seller-task-card"><h4>Đơn hủy</h4><div className="seller-big-number">{stats.cancelled}</div></div>
        </div>
      </section>

      <section className="seller-panel" style={{ marginTop: 16 }}>
        <h2 className="seller-page-title">Phân Tích Bán Hàng</h2>
        <div className="seller-stats-grid">
          <div className="seller-stat-card"><h4>Doanh số</h4><div className="seller-big-number">{(stats.revenueToday || 0).toLocaleString('vi-VN')}đ</div></div>
          <div className="seller-stat-card"><h4>Lượt truy cập</h4><div className="seller-big-number">{stats.visitors}</div></div>
          <div className="seller-stat-card"><h4>Lượt xem</h4><div className="seller-big-number">{stats.views}</div></div>
          <div className="seller-stat-card"><h4>Tỷ lệ chuyển đổi</h4><div className="seller-big-number">{stats.conversion}%</div></div>
        </div>
        <div className="seller-chart-placeholder">Biểu đồ doanh số mock data</div>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerDashboard
