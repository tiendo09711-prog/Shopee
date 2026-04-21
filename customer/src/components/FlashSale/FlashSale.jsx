import { formatCurrency } from '../../utils/formatCurrency'
import './FlashSale.css'

function FlashSale({ products }) {
  return (
    <section className="container flash-sale card">
      <div className="flash-sale-header">
        <h3>FLASH SALE</h3>
        <span>Kết thúc sau 02:12:48</span>
      </div>
      <div className="flash-sale-grid">
        {products.slice(0, 6).map((product) => (
          <div key={product.id} className="flash-sale-item">
            <div className="flash-sale-image-wrap"><img src={product.images[0]} alt={product.name} /></div>
            <div className="flash-sale-price">{formatCurrency(product.price)}</div>
            <div className="flash-sale-sold">Đã bán {product.sold}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FlashSale
