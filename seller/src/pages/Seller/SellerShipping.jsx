import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { useSeller } from '../../contexts/SellerContext'

function SellerShipping() {
  const { seller } = useSeller()
  return (
    <SellerDashboardLayout rightbar={<div><h3>Lưu ý</h3><p className="seller-muted">Shopee không hỗ trợ theo dõi cho các phương thức không tích hợp.</p></div>}>
      <section className="seller-panel">
        <h1 className="seller-page-title">Cài đặt vận chuyển</h1>
        <div className="seller-mini-grid">
          {seller?.shippingSettings?.map((item) => (
            <div key={item.id} className="seller-info-card">
              <h4>{item.title}</h4>
              <div>Đang bật: {item.active ? 'Có' : 'Không'}</div>
              <div>COD: {item.cod ? 'Có' : 'Không'}</div>
              <div>Nhóm: {item.group}</div>
            </div>
          ))}
        </div>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerShipping
