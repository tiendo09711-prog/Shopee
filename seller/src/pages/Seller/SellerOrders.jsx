import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { useSeller } from '../../contexts/SellerContext'

function SellerOrders() {
  const { seller } = useSeller()
  return (
    <SellerDashboardLayout rightbar={<div><h3>Bộ lọc nhanh</h3><div className="seller-utility-list"><div className="seller-info-card">Chờ xác nhận</div><div className="seller-info-card">Đang xử lý</div><div className="seller-info-card">Đã giao</div></div></div>}>
      <section className="seller-panel">
        <h1 className="seller-page-title">Quản lý đơn hàng</h1>
        <table className="seller-table">
          <thead>
            <tr><th>Mã đơn</th><th>Khách</th><th>Sản phẩm</th><th>Vận chuyển</th><th>Thành tiền</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            {seller?.orders?.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.product}</td>
                <td>{order.shipping}</td>
                <td>{order.total.toLocaleString('vi-VN')}đ</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerOrders
