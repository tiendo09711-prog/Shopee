import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { useSeller } from '../../contexts/SellerContext'

function SellerProducts() {
  const { seller } = useSeller()
  return (
    <SellerDashboardLayout rightbar={<div><h3>Gợi ý</h3><p className="seller-muted">Kéo dữ liệu này về từ MongoDB sau bằng đúng shape products hiện tại.</p></div>}>
      <section className="seller-panel">
        <h1 className="seller-page-title">Quản lý sản phẩm</h1>
        <table className="seller-table">
          <thead>
            <tr><th>Sản phẩm</th><th>SKU</th><th>Kho</th><th>Giá</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            {seller?.products?.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.sku}</td>
                <td>{product.stock}</td>
                <td>{product.price.toLocaleString('vi-VN')}đ</td>
                <td>{product.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerProducts
