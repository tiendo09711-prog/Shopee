import { Link, Navigate, useParams } from 'react-router-dom'
import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { useSeller } from '../../contexts/SellerContext'
import { getSellerProductById } from '../../services/sellerProduct.service'
import { formatCurrency } from '../../utils/formatCurrency'

const statusLabels = {
  draft: 'Nháp',
  pending_review: 'Chờ duyệt',
  active: 'Đang bán',
  hidden: 'Đã ẩn',
  rejected: 'Bị từ chối',
}

function SellerProductDetail() {
  const { productId } = useParams()
  const { seller } = useSeller()
  const product = getSellerProductById(seller.id, productId)

  if (!product) return <Navigate to="/seller/products" replace />

  return (
    <SellerDashboardLayout>
      <section className="seller-panel">
        <div className="seller-page-head">
          <h1 className="seller-page-title">{product.name}</h1>
          <Link className="seller-primary-btn" to={`/seller/products/${product.id}/edit`}>Sửa sản phẩm</Link>
        </div>
        <div className="seller-info-grid">
          <div className="seller-info-card"><span>SKU</span><strong>{product.sku}</strong></div>
          <div className="seller-info-card"><span>Giá</span><strong>{formatCurrency(product.price)}</strong></div>
          <div className="seller-info-card"><span>Tồn kho</span><strong>{product.stock}</strong></div>
          <div className="seller-info-card"><span>Trạng thái</span><strong>{statusLabels[product.status] || product.status}</strong></div>
        </div>
        {product.rejectReason ? <div className="status-message text-danger">Lý do từ chối: {product.rejectReason}</div> : null}
        <p className="seller-muted">{product.description}</p>
        <div className="seller-product-images">
          {product.images.map((image) => <img key={image} src={image} alt={product.name} />)}
        </div>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerProductDetail
