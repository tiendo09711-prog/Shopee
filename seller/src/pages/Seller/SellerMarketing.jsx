import SellerDashboardLayout from '../../layout/SellerDashboardLayout'

function SellerMarketing() {
  return (
    <SellerDashboardLayout rightbar={<div><h3>Khuyến nghị</h3><p className="seller-muted">Tạo mã giảm giá 10% cho sản phẩm mới.</p></div>}>
      <section className="seller-panel">
        <h1 className="seller-page-title">Kênh Marketing</h1>
        <div className="seller-mini-grid">
          <div className="seller-info-card"><h4>Mã Giảm Giá</h4><p className="seller-muted">2 chiến dịch đang chạy</p></div>
          <div className="seller-info-card"><h4>Tăng Đơn cùng KOL</h4><p className="seller-muted">Thiết lập nhanh chiến dịch affiliate.</p></div>
        </div>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerMarketing
