import SellerDashboardLayout from '../../layout/SellerDashboardLayout'

function SellerPlaceholder({ title }) {
  return (
    <SellerDashboardLayout rightbar={<div><h3>{title}</h3><p className="seller-muted">Trang khung sườn để bạn nối backend sau.</p></div>}>
      <section className="seller-panel">
        <h1 className="seller-page-title">{title}</h1>
        <div className="seller-chart-placeholder">Nội dung {title}</div>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerPlaceholder
