/* Buyer storefront — FilterSidebar, SortBar, ProductGrid */

function FilterSidebar({ filters, onChange, onReset }) {
  const cats = window.BUYER.CATEGORIES;
  return (
    <aside className="uk-sidebar">
      <h4>Theo danh mục</h4>
      <ul>
        {cats.map(c => (
          <li
            key={c.id}
            className={filters.category === c.id ? 'active' : ''}
            onClick={() => onChange('category', c.id)}
          >{c.label}</li>
        ))}
      </ul>
      <div className="uk-divider"></div>
      <h4>Khoảng giá</h4>
      <div className="uk-price-row">
        <input placeholder="Từ" value={filters.minPrice} onChange={(e) => onChange('minPrice', e.target.value)} />
        <input placeholder="Đến" value={filters.maxPrice} onChange={(e) => onChange('maxPrice', e.target.value)} />
      </div>
      <button className="uk-apply">Áp dụng</button>
      <div className="uk-divider"></div>
      <h4>Đánh giá</h4>
      <div className="uk-rating-row">
        {[5, 4, 3, 2].map(r => (
          <button key={r} onClick={() => onChange('rating', r)}>
            {'★'.repeat(r)}{'☆'.repeat(5 - r)} {r === filters.rating ? '✓' : ''}
          </button>
        ))}
      </div>
      <div className="uk-divider"></div>
      <button className="uk-reset" onClick={onReset}>Xóa bộ lọc</button>
    </aside>
  );
}

function SortBar({ sort, onSort }) {
  const opts = [
    { id: 'popular', label: 'Phổ biến' },
    { id: 'newest', label: 'Mới nhất' },
    { id: 'bestSeller', label: 'Bán chạy' },
  ];
  return (
    <div className="uk-sort">
      <span className="uk-sort-label">Sắp xếp theo</span>
      {opts.map(o => (
        <button
          key={o.id}
          className={sort === o.id ? 'active' : ''}
          onClick={() => onSort(o.id)}
        >{o.label}</button>
      ))}
      <select className="price-sort" value={sort.startsWith('price') ? sort : ''} onChange={(e) => onSort(e.target.value)}>
        <option value="">Giá</option>
        <option value="priceAsc">Giá: Thấp → Cao</option>
        <option value="priceDesc">Giá: Cao → Thấp</option>
      </select>
      <div className="grow"></div>
      <span style={{ color: '#ee4d2d', fontSize: 13 }}>1<span style={{ color: '#555' }}>/2</span></span>
      <button>‹</button>
      <button>›</button>
    </div>
  );
}

function ProductCard({ product, onOpen, onFav, faved }) {
  const p = product;
  return (
    <div className="uk-product" onClick={() => onOpen(p)}>
      <button
        className={'uk-product-fav ' + (faved ? 'active' : '')}
        onClick={(e) => { e.stopPropagation(); onFav(p.id); }}
        aria-label="Yêu thích"
      >{faved ? '❤' : '♡'}</button>
      <div className="uk-product-image-wrap">
        <img src={'../../assets/products/' + p.img} alt={p.name} />
        <div className="uk-product-discount">
          <strong>{p.discount}%</strong>
          <span>GIẢM</span>
        </div>
      </div>
      <div className="uk-product-info">
        <h4>{p.name}</h4>
        <div className="uk-product-price-row">
          <span className="uk-product-price">{fmtPrice(p.price)}</span>
          <span className="uk-product-price-old">{fmtPrice(p.oldPrice)}</span>
        </div>
        <div className="uk-product-meta">
          <span className="uk-product-stars">★ {p.rating}</span>
          <span>Đã bán {p.sold}</span>
        </div>
        <div className="uk-product-location">{p.location}</div>
      </div>
    </div>
  );
}

function ProductGrid({ products, onOpen, onFav, favs }) {
  return (
    <div className="uk-products">
      {products.map(p => (
        <ProductCard key={p.id} product={p} onOpen={onOpen} onFav={onFav} faved={favs.has(p.id)} />
      ))}
    </div>
  );
}

window.FilterSidebar = FilterSidebar;
window.SortBar = SortBar;
window.ProductCard = ProductCard;
window.ProductGrid = ProductGrid;
