import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../layout/MainLayout'
import AuthRequiredModal from '../../components/AuthRequiredModal/AuthRequiredModal'
import ProductCard from '../../components/ProductCard/ProductCard'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import {
  fetchProductBySlug,
  fetchProductReviews,
  fetchRelatedProducts,
  getProductUnavailableMessage,
  isProductVisible
} from '../../services/product.service'
import { sendMessageToShop } from '../../services/chat.service'
import { formatCompactNumber, formatCurrency } from '../../utils/formatCurrency'
import './ProductDetail.css'

function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])
  const [activeImage, setActiveImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedVariation, setSelectedVariation] = useState({})
  const [reviewFilter, setReviewFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    setProduct(null)

    fetchProductBySlug(slug)
      .then(async (item) => {
        if (!active) return
        setProduct(item)
        setActiveImage(item.images?.[0] || '')
        setSelectedVariation(Object.fromEntries((item.variations || []).map((entry) => [entry.name, entry.options?.[0] || ''])))
        const [reviewItems, relatedItems] = await Promise.all([
          fetchProductReviews(item.slug || item.id).catch(() => []),
          fetchRelatedProducts(item, 5).catch(() => [])
        ])
        if (!active) return
        setReviews(reviewItems)
        setRelatedProducts(relatedItems)
      })
      .catch((fetchError) => {
        if (active) setError(fetchError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug])

  const shop = product?.seller || null
  const filteredReviews = useMemo(() => (
    reviewFilter === 'all'
      ? reviews
      : reviews.filter((item) => String(item.rating) === reviewFilter)
  ), [reviewFilter, reviews])

  if (loading) {
    return (
      <MainLayout>
        <div className="container page-spacing"><div className="empty-message card">Dang tai san pham...</div></div>
      </MainLayout>
    )
  }

  if (error || !product) {
    return (
      <MainLayout>
        <div className="container page-spacing"><div className="empty-message card">{error || 'San pham khong ton tai.'}</div></div>
      </MainLayout>
    )
  }

  const unavailableMessage = getProductUnavailableMessage(product)
  if (!isProductVisible(product)) {
    return (
      <MainLayout>
        <div className="container page-spacing">
          <div className="empty-message card">{unavailableMessage}</div>
        </div>
      </MainLayout>
    )
  }

  const variationText = Object.entries(selectedVariation).map(([key, value]) => `${key}: ${value}`).join(' | ')
  const variationKey = Object.values(selectedVariation).join('_')
  const hasStock = product.stock > 0

  const handleProtectedAction = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return false
    }
    return true
  }

  const handleAddToCart = async () => {
    if (!handleProtectedAction()) return
    if (!hasStock) {
      setMessage('San pham da het hang.')
      return
    }
    if (quantity > product.stock) {
      setMessage(`So luong vuot qua ton kho. San pham chi con ${product.stock}.`)
      return
    }
    const result = await addToCart(product, quantity, { key: variationKey, text: variationText })
    if (!result.success) {
      setMessage(result.error)
      return
    }
    setMessage('')
    alert('Da them vao gio hang')
  }

  const handleBuyNow = async () => {
    if (!handleProtectedAction()) return
    if (!hasStock) {
      setMessage('San pham da het hang.')
      return
    }
    if (quantity > product.stock) {
      setMessage(`So luong vuot qua ton kho. San pham chi con ${product.stock}.`)
      return
    }
    const result = await addToCart(product, quantity, { key: variationKey, text: variationText })
    if (!result.success) {
      setMessage(result.error)
      return
    }
    setMessage('')
    navigate('/cart')
  }

  const handleChat = () => {
    if (!handleProtectedAction()) return
    sendMessageToShop(user.id, product.shopId, `Xin chao shop, toi muon hoi them ve san pham ${product.name}.`)
    navigate(`/shop/${product.shopId}`)
  }

  return (
    <MainLayout>
      <div className="container page-spacing product-detail-page">
        <div className="breadcrumb"><Link to="/">Shopee</Link> <span>/</span> <span>{product.name}</span></div>

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
              <div className="stars">{'*'.repeat(Math.round(product.rating))}</div>
              <span>{formatCompactNumber(product.views)} luot xem</span>
              <span>{formatCompactNumber(product.sold)} da ban</span>
            </div>

            <div className="product-price-box">
              <span className="product-price-current">{formatCurrency(product.price)}</span>
              {product.oldPrice ? <span className="product-price-old">{formatCurrency(product.oldPrice)}</span> : null}
              {product.discountPercent > 0 ? <span className="product-price-discount">{product.discountPercent}% Giam</span> : null}
            </div>

            <div className="product-meta-list">
              <div><strong>Van chuyen</strong><span>{product.shippingLeadTime} - Phi tu {formatCurrency(product.shippingFee)}</span></div>
              <div><strong>Thuong hieu</strong><span>{product.brand}</span></div>
              <div><strong>Tinh trang</strong><span>{hasStock ? `Con ${product.stock} san pham` : 'Het hang'}</span></div>
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
              <strong>So luong</strong>
              <div className="quantity-box">
                <button type="button" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>-</button>
                <span>{quantity}</span>
                <button type="button" disabled={!hasStock || quantity >= product.stock} onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}>+</button>
              </div>
              <span className={hasStock ? 'text-muted' : 'product-stock-warning'}>{hasStock ? `${product.stock} san pham co san` : 'San pham da het hang'}</span>
            </div>

            <div className="selected-variation-text">Phan loai da chon: {variationText}</div>
            {message ? <div className="product-detail-message">{message}</div> : null}

            <div className="product-action-row">
              <button type="button" className="add-to-cart-btn" disabled={!hasStock} onClick={handleAddToCart}>Them vao gio hang</button>
              <button type="button" className="buy-now-btn" disabled={!hasStock} onClick={handleBuyNow}>Mua ngay</button>
              <button type="button" className={`wishlist-detail-btn ${isWishlisted(product.id) ? 'active' : ''}`} onClick={() => toggleWishlist(product.id)}>Yeu thich</button>
            </div>
          </div>
        </section>

        <section className="shop-summary card">
          <div className="shop-summary-left">
            <div className="shop-avatar">{shop?.shopName?.slice(0, 1) || 'S'}</div>
            <div>
              <h3>{shop?.shopName || product.shopName}</h3>
              <p>Danh gia shop {shop?.ratingAverage || 0}</p>
            </div>
          </div>
          <div className="shop-summary-metrics">
            <div><strong>{formatCompactNumber(shop?.totalSales || 0)}</strong><span>Da ban</span></div>
            <div><strong>{shop?.ratingAverage || 0}</strong><span>Danh gia shop</span></div>
            <div><strong>{shop?.totalProducts || 0}</strong><span>San pham</span></div>
          </div>
          <div className="shop-summary-actions">
            <button type="button" onClick={handleChat}>Chat ngay</button>
            <Link to={`/shop/${product.shopId}`}>Xem Shop</Link>
          </div>
        </section>

        <section className="product-description card">
          <h2>CHI TIET SAN PHAM</h2>
          <div className="product-detail-table">
            <div><span>Danh muc</span><strong>{product.category}</strong></div>
            <div><span>Kho</span><strong>{product.stock}</strong></div>
            <div><span>Gui tu</span><strong>{product.location}</strong></div>
            <div><span>Shop</span><strong>{shop?.shopName || product.shopName}</strong></div>
          </div>
          <h2>MO TA SAN PHAM</h2>
          <p>{product.description}</p>
        </section>

        <section className="product-reviews card">
          <div className="review-header">
            <h2>DANH GIA SAN PHAM</h2>
            <div className="review-filter-list">
              <button type="button" className={reviewFilter === 'all' ? 'active' : ''} onClick={() => setReviewFilter('all')}>Tat ca</button>
              {[5, 4, 3, 2, 1].map((star) => (
                <button key={star} type="button" className={reviewFilter === String(star) ? 'active' : ''} onClick={() => setReviewFilter(String(star))}>{star} Sao</button>
              ))}
            </div>
          </div>
          <div className="review-list">
            {filteredReviews.map((review) => (
              <article key={review._id || review.id} className="review-item">
                <strong>{review.customer?.name || 'Nguoi mua PShop'}</strong>
                <div className="stars">{'*'.repeat(review.rating)}</div>
                <p>{review.comment || review.content}</p>
                {review.images?.length > 0 && (
                  <div className="review-images">
                    {review.images.map((image) => <img key={image} src={image} alt={review.customer?.name || 'review'} />)}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="related-products">
          <h2 className="section-title">San Pham Lien Quan</h2>
          <div className="related-grid">{relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </section>
      </div>

      <AuthRequiredModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </MainLayout>
  )
}

export default ProductDetail
