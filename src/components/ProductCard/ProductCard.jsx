import { Link } from 'react-router-dom'
import { formatCompactNumber, formatCurrency } from '../../utils/formatCurrency'
import './ProductCard.css'

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.slug}`} className="product-card">
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
          <div className="stars">{'★'.repeat(Math.round(product.rating))}</div>
          <span>Đã bán {formatCompactNumber(product.sold)}</span>
        </div>
        <div className="product-location">TP. Hồ Chí Minh</div>
      </div>
    </Link>
  )
}

export default ProductCard
