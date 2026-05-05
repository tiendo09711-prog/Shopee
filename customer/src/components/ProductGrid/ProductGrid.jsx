import ProductCard from '../ProductCard/ProductCard'
import './ProductGrid.css'

function ProductGrid({ products, totalCount = products.length, currentPage = 1, pageCount = 1 }) {
  return (
    <section className="product-grid-section">
      <div className="product-grid-toolbar card">
        <h3>GỢI Ý HÔM NAY</h3>
        <span>{totalCount} sản phẩm · Trang {currentPage}/{pageCount}</span>
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
