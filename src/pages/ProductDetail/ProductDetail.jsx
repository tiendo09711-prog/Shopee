import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../layout/MainLayout'
import AuthRequiredModal from '../../components/AuthRequiredModal/AuthRequiredModal'
import ProductCard from '../../components/ProductCard/ProductCard'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { getBestSellerProducts, getProductBySlug } from '../../services/product.service'
import { formatCompactNumber, formatCurrency } from '../../utils/formatCurrency'
import './ProductDetail.css'

function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const product = getProductBySlug(slug)
  const [activeImage, setActiveImage] = useState(product?.images?.[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const relatedProducts = useMemo(() => (product ? getBestSellerProducts(5, product.id) : []), [product])

  if (!product) {
    return (
      <MainLayout>
        <div className="container page-spacing"><div className="empty-message">Sản phẩm không tồn tại.</div></div>
      </MainLayout>
    )
  }

  const handleProtectedAction = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return false
    }
    return true
  }

  const handleAddToCart = () => {
    if (!handleProtectedAction()) return
    addToCart(product, quantity)
    alert('Đã thêm vào giỏ hàng')
  }

  const handleBuyNow = () => {
    if (!handleProtectedAction()) return
    addToCart(product, quantity)
    navigate('/cart')
  }

  return (
    <MainLayout>
      <div className="container page-spacing product-detail-page">
        <div className="breadcrumb"><Link to="/">Shopee</Link> <span>›</span> <span>{product.name}</span></div>

        <section className="product-detail-main card">
          <div className="product-gallery">
            <div className="product-main-image"><img src={activeImage} alt={product.name} /></div>
            <div className="product-thumbnail-list">
              {product.images.map((image) => (
                <button key={image} type="button" className={activeImage === image ? 'active' : ''} onClick={() => setActiveImage(image)}>
                  <img src={image} alt={product.name} />
                </button>
              ))}
            </div>
          </div>

          <div className="product-info">
            <h1>{product.name}</h1>
            <div className="product-review-row">
              <span className="rating-value">{product.rating.toFixed(1)}</span>
              <div className="stars">{'★'.repeat(Math.round(product.rating))}</div>
              <span>{formatCompactNumber(product.views)} lượt xem</span>
              <span>{formatCompactNumber(product.sold)} đã bán</span>
            </div>

            <div className="product-price-box">
              <span className="product-price-current">{formatCurrency(product.price)}</span>
              <span className="product-price-old">{formatCurrency(product.oldPrice)}</span>
              <span className="product-price-discount">{product.discountPercent}% Giảm</span>
            </div>

            <div className="product-meta-list">
              <div><strong>Vận Chuyển</strong><span>Miễn phí vận chuyển cho đơn từ 300.000đ</span></div>
              <div><strong>Thương hiệu</strong><span>{product.brand}</span></div>
              <div><strong>Tình trạng</strong><span>Còn {product.stock} sản phẩm</span></div>
            </div>

            <div className="product-quantity-row">
              <strong>Số Lượng</strong>
              <div className="quantity-box">
                <button type="button" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>-</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}>+</button>
              </div>
              <span className="text-muted">{product.stock} sản phẩm có sẵn</span>
            </div>

            <div className="product-action-row">
              <button type="button" className="add-to-cart-btn" onClick={handleAddToCart}>🛒 Thêm Vào Giỏ Hàng</button>
              <button type="button" className="buy-now-btn" onClick={handleBuyNow}>Mua Ngay</button>
            </div>
          </div>
        </section>

        <section className="product-description card">
          <h2>CHI TIẾT SẢN PHẨM</h2>
          <div className="product-detail-table">
            <div><span>Danh Mục</span><strong>{product.category}</strong></div>
            <div><span>Kho</span><strong>{product.stock}</strong></div>
            <div><span>Gửi từ</span><strong>Quận 10, TP. Hồ Chí Minh</strong></div>
          </div>
          <h2>MÔ TẢ SẢN PHẨM</h2>
          <p>{product.description}</p>
          <p>Sản phẩm đang được dựng theo phong cách Shopee clone để bạn dễ nối backend và database MongoDB về sau. Cấu trúc dữ liệu đã tách services, contexts và pages riêng.</p>
        </section>

        <section className="related-products">
          <h2 className="section-title">Sản Phẩm Liên Quan</h2>
          <div className="related-grid">{relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </section>
      </div>

      <AuthRequiredModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </MainLayout>
  )
}

export default ProductDetail
