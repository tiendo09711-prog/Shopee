import SellerDashboardLayout from '../../layout/SellerDashboardLayout'

function SellerDataCenter() {
  return (
    <SellerDashboardLayout rightbar={<div><h3>Xu hướng</h3><p className="seller-muted">Ngành hàng thời trang nam đang tăng trưởng +12% tuần này.</p></div>}>
      <section className="seller-panel">
        <h1 className="seller-page-title">Dữ liệu</h1>
        <div className="seller-chart-placeholder">Khu vực analytics / biểu đồ / top sản phẩm bán chạy</div>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerDataCenter
