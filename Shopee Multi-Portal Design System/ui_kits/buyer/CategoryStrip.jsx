/* Buyer storefront — CategoryStrip & FlashSale */

function CategoryStrip({ active, onSelect }) {
  return (
    <section className="uk-categories">
      <div className="uk-categories-title">Danh mục</div>
      <div className="uk-categories-grid">
        {window.BUYER.CATEGORIES.map(c => (
          <button
            key={c.id}
            className={'uk-cat ' + (active === c.id ? 'active' : '')}
            onClick={() => onSelect(c.id)}
            style={{ background: 'transparent', border: 0 }}
          >
            <div className="uk-cat-icon">{c.icon}</div>
            <div>{c.label}</div>
          </button>
        ))}
      </div>
    </section>
  );
}

function FlashSale({ products, onOpen }) {
  const items = products.slice(0, 5);
  return (
    <section className="uk-flashsale">
      <div className="uk-flashsale-head">
        <h3>FLASH SALE</h3>
        <div className="uk-clock">
          <span>02</span><span>:</span><span>14</span><span>:</span><span>56</span>
        </div>
        <div style={{ flex: 1 }}></div>
        <a href="#" style={{ color: '#ee4d2d', fontSize: 13 }}>Xem tất cả ›</a>
      </div>
      <div className="uk-flashsale-grid">
        {items.map(p => (
          <button
            key={p.id}
            className="uk-flash-item"
            onClick={() => onOpen(p)}
            style={{ background: '#fff', border: 0, padding: 0, cursor: 'pointer', textAlign: 'left' }}
          >
            <div style={{ background: '#fafafa', position: 'relative' }}>
              <img src={'../../assets/products/' + p.img} alt={p.name} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'contain' }} />
              <div className="uk-product-discount">
                <strong>{p.discount}%</strong>
                <span>GIẢM</span>
              </div>
            </div>
            <div style={{ padding: 8 }}>
              <div style={{ color: '#ee4d2d', fontWeight: 700, fontSize: 16 }}>{fmtPrice(p.price)}</div>
              <div style={{ background: '#ffe1cf', borderRadius: 999, height: 16, position: 'relative', marginTop: 6, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, width: p.sale + '%', background: 'linear-gradient(90deg, #ffbda7, #ff664f)' }}></div>
                <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>
                  ĐÃ BÁN {p.sale}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

window.CategoryStrip = CategoryStrip;
window.FlashSale = FlashSale;
