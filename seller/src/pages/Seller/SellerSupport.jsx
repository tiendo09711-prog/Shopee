import SellerDashboardLayout from '../../layout/SellerDashboardLayout'

function SellerSupport() {
  return (
    <SellerDashboardLayout rightbar={<div><h3>Liên hệ</h3><p className="seller-muted">Hotline mock: 1900 1221</p></div>}>
      <section className="seller-panel">
        <h1 className="seller-page-title">Chăm sóc khách hàng</h1>
        <div className="seller-mini-grid">
          <div className="seller-info-card"><h4>Ticket hỗ trợ</h4><p className="seller-muted">3 ticket đang mở</p></div>
          <div className="seller-info-card"><h4>Tin nhắn</h4><p className="seller-muted">19 cuộc hội thoại chưa đọc</p></div>
          <div className="seller-info-card"><h4>Trợ lý vận hành</h4><p className="seller-muted">Nhắc nhở phản hồi chat dưới 15 phút.</p></div>
          <div className="seller-info-card"><h4>FAQ người bán</h4><p className="seller-muted">Tổng hợp chính sách, vận chuyển, thanh toán.</p></div>
        </div>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerSupport
