import { categories } from '../../data/categories.mock'
import './FilterSidebar.css'

function FilterSidebar({ filters, onChange, onReset }) {
  return (
    <aside className="filter-sidebar card">
      <div className="filter-group">
        <h3>Theo Danh Mục</h3>
        <div className="filter-category-list">
          <button type="button" className={!filters.category ? 'active' : ''} onClick={() => onChange('category', '')}>Tất cả sản phẩm</button>
          {categories.map((category) => (
            <button key={category.id} type="button" className={filters.category === category.id ? 'active' : ''} onClick={() => onChange('category', category.id)}>{category.name}</button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h3>Khoảng Giá</h3>
        <div className="filter-price-row">
          <input type="number" placeholder="TỪ" value={filters.minPrice} onChange={(e) => onChange('minPrice', e.target.value)} />
          <span>-</span>
          <input type="number" placeholder="ĐẾN" value={filters.maxPrice} onChange={(e) => onChange('maxPrice', e.target.value)} />
        </div>
      </div>

      <div className="filter-group">
        <h3>Đánh Giá</h3>
        <div className="filter-rating-list">
          {[5, 4, 3].map((item) => (
            <button key={item} type="button" className={filters.rating === item ? 'active' : ''} onClick={() => onChange('rating', filters.rating === item ? 0 : item)}>
              {'★'.repeat(item)} trở lên
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h3>Sắp Xếp</h3>
        <select value={filters.sortBy} onChange={(e) => onChange('sortBy', e.target.value)}>
          <option value="newest">Mới nhất</option>
          <option value="popular">Phổ biến</option>
          <option value="bestSeller">Bán chạy</option>
        </select>
        <select value={filters.priceOrder} onChange={(e) => onChange('priceOrder', e.target.value)}>
          <option value="">Giá</option>
          <option value="asc">Giá thấp đến cao</option>
          <option value="desc">Giá cao đến thấp</option>
        </select>
      </div>

      <button type="button" className="filter-reset-btn" onClick={onReset}>Xóa tất cả</button>
    </aside>
  )
}

export default FilterSidebar
