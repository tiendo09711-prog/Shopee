import { Link, useNavigate } from 'react-router-dom'
import { formatCompactNumber, formatCurrency } from '../../utils/formatCurrency'
import { useWishlist } from '../../contexts/WishlistContext'
import { useAuth } from '../../contexts/AuthContext'
import './ProductCard.css'

function ProductCard({ product }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { isWishlisted, toggleWishlist } = useWishlist()

  const handleToggleWishlist = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    toggleWishlist(product.id)
  }

  return (
    <Link to={`/product/${product.slug}`} className="product-card">
      <button type="button" className={`product-wishlist-btn ${isWishlisted(product.id) ? 'active' : ''}`} onClick={handleToggleWishlist}>❤</button>
      <div className="product-thumb-wrap">
        <img src={product.images[0]} alt={product.name} className="product-thumb" />
        {product.discountPercent > 0 && (
          <div className="product-discount-badge">
            <strong>{product.discountPercent}%</strong>
            <span>GIẢM</span>
          </div>
        )}
      </div>
      <div className="product-content">
        <h4 className="product-name">{product.name}</h4>
        <div className="product-price-row">
          <span className="product-price">{formatCurrency(product.price)}</span>
          {product.oldPrice ? <span className="product-old-price">{formatCurrency(product.oldPrice)}</span> : null}
        </div>
        <div className="product-meta-row">
          <div className="stars">★ {product.rating.toFixed(1)}</div>
          <span>Đã bán {formatCompactNumber(product.sold)}</span>
        </div>
        <div className="product-location">{product.location || 'TP. Hồ Chí Minh'}</div>
      </div>
    </Link>
  )
}

export default ProductCard