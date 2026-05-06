import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!productId) return
    setLoading(true)
    getSellerProductById(seller?._id || seller?.id, productId)
      .then((data) => setProduct(data))
      .catch((err) => {
        setError(err.message)
        // Nếu sản phẩm không tồn tại, về danh sách
        if (err.message?.includes('not found') || err.message?.includes('404')) {
          navigate('/seller/products', { replace: true })
        }
      })
      .finally(() => setLoading(false))
  }, [productId, seller])

  if (loading) {
    return (
      <SellerDashboardLayout>
        <div style={{ padding: 32 }}>Đang tải sản phẩm...</div>
      </SellerDashboardLayout>
    )
  }

  if (error || !product) {
    return (
      <SellerDashboardLayout>
        <section className="seller-panel">
          <div className="status-message text-danger">{error || 'Không tìm thấy sản phẩm'}</div>
          <Link to="/seller/products" className="seller-primary-btn" style={{ marginTop: 16, display: 'inline-block' }}>
            ← Về danh sách sản phẩm
          </Link>
        </section>
      </SellerDashboardLayout>
    )
  }

  return (
    <SellerDashboardLayout>
      <section className="seller-panel">
        <div className="seller-page-head">
          <h1 className="seller-page-title">{product.name}</h1>
          <Link className="seller-primary-btn" to={`/seller/products/${product._id || product.id}/edit`}>
            Sửa sản phẩm
          </Link>
        </div>

        <div className="seller-info-grid">
          <div className="seller-info-card"><span>SKU</span><strong>{product.sku || '—'}</strong></div>
          <div className="seller-info-card"><span>Giá</span><strong>{formatCurrency(product.price)}</strong></div>
          <div className="seller-info-card"><span>Tồn kho</span><strong>{product.stock}</strong></div>
          <div className="seller-info-card">
            <span>Trạng thái</span>
            <strong>{statusLabels[product.status] || product.status}</strong>
          </div>
          {product.category && (
            <div className="seller-info-card">
              <span>Danh mục</span>
              <strong>{product.category?.name || product.category}</strong>
            </div>
          )}
          {product.oldPrice && product.oldPrice !== product.price ? (
            <div className="seller-info-card">
              <span>Giá gốc</span>
              <strong style={{ textDecoration: 'line-through', color: '#999' }}>{formatCurrency(product.oldPrice)}</strong>
            </div>
          ) : null}
        </div>

        {product.rejectReason ? (
          <div className="status-message text-danger">Lý do từ chối: {product.rejectReason}</div>
        ) : null}

        {product.description ? (
          <div style={{ marginTop: 16 }}>
            <h3>Mô tả sản phẩm</h3>
            <p className="seller-muted">{product.description}</p>
          </div>
        ) : null}

        {(product.images || []).length > 0 ? (
          <div style={{ marginTop: 16 }}>
            <h3>Hình ảnh</h3>
            <div className="seller-product-images">
              {(product.images || []).map((image, idx) => (
                <img key={idx} src={image} alt={`${product.name} ${idx + 1}`} style={{ maxWidth: 160, maxHeight: 160, objectFit: 'cover', borderRadius: 8, margin: 4 }} />
              ))}
            </div>
          </div>
        ) : null}

        <div style={{ marginTop: 24 }}>
          <Link to="/seller/products" className="seller-muted" style={{ marginRight: 16 }}>← Về danh sách</Link>
          <Link to={`/seller/products/${product._id || product.id}/edit`} className="seller-primary-btn">
            Chỉnh sửa
          </Link>
        </div>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerProductDetail
