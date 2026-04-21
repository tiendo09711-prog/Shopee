import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { useSeller } from '../../contexts/SellerContext'

function SellerFinance() {
  const { seller } = useSeller()
  return (
    <SellerDashboardLayout rightbar={<div><h3>Ví Shopee mock</h3><p className="seller-muted">Số dư khả dụng: 5.240.000đ</p></div>}>
      <section className="seller-panel">
        <h1 className="seller-page-title">Tài chính</h1>
        <div className="seller-stats-grid">
          <div className="seller-stat-card"><h4>Doanh thu hôm nay</h4><div className="seller-big-number">{seller?.stats?.revenueToday?.toLocaleString('vi-VN')}đ</div></div>
          <div className="seller-stat-card"><h4>Đơn đã thanh toán</h4><div className="seller-big-number">18</div></div>
          <div className="seller-stat-card"><h4>Phí sàn</h4><div className="seller-big-number">312.000đ</div></div>
          <div className="seller-stat-card"><h4>Lợi nhuận tạm tính</h4><div className="seller-big-number">2.248.000đ</div></div>
        </div>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerFinance
