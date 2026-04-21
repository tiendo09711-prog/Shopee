import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../layout/MainLayout'
import AuthRequiredModal from '../../components/AuthRequiredModal/AuthRequiredModal'
import ProductCard from '../../components/ProductCard/ProductCard'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { getProductBySlug, getRelatedProducts } from '../../services/product.service'
import { getShopById } from '../../services/shop.service'
import { sendMessageToShop } from '../../services/chat.service'
import { formatCompactNumber, formatCurrency } from '../../utils/formatCurrency'
import './ProductDetail.css'

function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const product = getProductBySlug(slug)
  const [activeImage, setActiveImage] = useState(product?.images?.[0] || '')
  const [quantity, setQuantity] = useState(1)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedVariation, setSelectedVariation] = useState(() => {
    if (!product?.variations?.length) return {}
    return Object.fromEntries(product.variations.map((item) => [item.name, item.options[0]]))
  })
  const [reviewFilter, setReviewFilter] = useState('all')

  const relatedProducts = useMemo(() => (product ? getRelatedProducts(product, 5) : []), [product])
  const shop = product ? getShopById(product.shopId) : null

  if (!product) {
    return (
      <MainLayout>
        <div className="container page-spacing"><div className="empty-message">Sản phẩm không tồn tại.</div></div>
      </MainLayout>
    )
  }

  const variationText = Object.entries(selectedVariation).map(([key, value]) => `${key}: ${value}`).join(' | ')
  const variationKey = Object.values(selectedVariation).join('_')
  const filteredReviews = reviewFilter === 'all'
    ? product.reviews
    : product.reviews.filter((item) => String(item.rating) === reviewFilter)

  const handleProtectedAction = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return false
    }
    return true
  }

  const handleAddToCart = () => {
    if (!handleProtectedAction()) return
    addToCart(product, quantity, { key: variationKey, text: variationText })
    alert('Đã thêm vào giỏ hàng')
  }

  const handleBuyNow = () => {
    if (!handleProtectedAction()) return
    addToCart(product, quantity, { key: variationKey, text: variationText })
    navigate('/cart')
  }

  const handleChat = () => {
    if (!handleProtectedAction()) return
    sendMessageToShop(user.id, product.shopId, `Xin chào shop, tôi muốn hỏi thêm về sản phẩm ${product.name}.`)
    navigate(`/shop/${product.shopId}`)
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
              <div><strong>Vận Chuyển</strong><span>{product.shippingLeadTime} · Phí từ {formatCurrency(product.shippingFee)}</span></div>
              <div><strong>Thương hiệu</strong><span>{product.brand}</span></div>
              <div><strong>Tình trạng</strong><span>Còn {product.stock} sản phẩm</span></div>
            </div>

            <div className="product-variation-group">
              {product.variations?.map((variation) => (
                <div key={variation.name} className="variation-row">
                  <strong>{variation.name}</strong>
                  <div className="variation-options">
                    {variation.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={selectedVariation[variation.name] === option ? 'active' : ''}
                        onClick={() => setSelectedVariation((prev) => ({ ...prev, [variation.name]: option }))}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
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

            <div className="selected-variation-text">Phân loại đã chọn: {variationText}</div>

            <div className="product-action-row">
              <button type="button" className="add-to-cart-btn" onClick={handleAddToCart}>🛒 Thêm Vào Giỏ Hàng</button>
              <button type="button" className="buy-now-btn" onClick={handleBuyNow}>Mua Ngay</button>
              <button type="button" className={`wishlist-detail-btn ${isWishlisted(product.id) ? 'active' : ''}`} onClick={() => toggleWishlist(product.id)}>❤ Yêu thích</button>
            </div>
          </div>
        </section>

        <section className="shop-summary card">
          <div className="shop-summary-left">
            <div className="shop-avatar">{shop?.name?.slice(0, 1) || 'S'}</div>
            <div>
              <h3>{shop?.name}</h3>
              <p>Phản hồi {shop?.responseRate}% · {shop?.responseTime}</p>
            </div>
          </div>
          <div className="shop-summary-metrics">
            <div><strong>{formatCompactNumber(shop?.followers || 0)}</strong><span>Người theo dõi</span></div>
            <div><strong>{shop?.rating || 0}</strong><span>Đánh giá shop</span></div>
            <div><strong>{shop?.productsCount || 0}</strong><span>Sản phẩm</span></div>
          </div>
          <div className="shop-summary-actions">
            <button type="button" onClick={handleChat}>Chat ngay</button>
            <Link to={`/shop/${product.shopId}`}>Xem Shop</Link>
          </div>
        </section>

        <section className="product-description card">
          <h2>CHI TIẾT SẢN PHẨM</h2>
          <div className="product-detail-table">
            <div><span>Danh Mục</span><strong>{product.category}</strong></div>
            <div><span>Kho</span><strong>{product.stock}</strong></div>
            <div><span>Gửi từ</span><strong>{product.location}</strong></div>
            <div><span>Shop</span><strong>{shop?.name}</strong></div>
          </div>
          <h2>MÔ TẢ SẢN PHẨM</h2>
          <p>{product.description}</p>
        </section>

        <section className="product-reviews card">
          <div className="review-header">
            <h2>ĐÁNH GIÁ SẢN PHẨM</h2>
            <div className="review-filter-list">
              <button type="button" className={reviewFilter === 'all' ? 'active' : ''} onClick={() => setReviewFilter('all')}>Tất cả</button>
              {[5, 4, 3, 2, 1].map((star) => (
                <button key={star} type="button" className={reviewFilter === String(star) ? 'active' : ''} onClick={() => setReviewFilter(String(star))}>{star} Sao</button>
              ))}
            </div>
          </div>
          <div className="review-list">
            {filteredReviews.map((review) => (
              <article key={review.id} className="review-item">
                <strong>{review.author}</strong>
                <div className="stars">{'★'.repeat(review.rating)}</div>
                <p>{review.content}</p>
                {review.images?.length > 0 && (
                  <div className="review-images">
                    {review.images.map((image) => <img key={image} src={image} alt={review.author} />)}
                  </div>
                )}
              </article>
            ))}
          </div>
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