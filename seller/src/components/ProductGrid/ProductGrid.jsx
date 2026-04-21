import ProductCard from '../ProductCard/ProductCard'
import './ProductGrid.css'

function ProductGrid({ products }) {
  return (
    <section className="product-grid-section">
      <div className="product-grid-toolbar card">
        <h3>GỢI Ý HÔM NAY</h3>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export default ProductGrid
