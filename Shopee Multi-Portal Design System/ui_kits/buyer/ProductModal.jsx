/* Buyer storefront — Product detail modal & Cart drawer */

function ProductModal({ product, onClose, onAdd }) {
  const [color, setColor] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  if (!product) return null;
  const variants = ['Mặc định', 'Phiên bản A', 'Phiên bản B'];
  return (
    <div className="uk-overlay" onClick={onClose}>
      <div className="uk-modal" onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        <button className="uk-modal-close" onClick={onClose}>×</button>
        <div className="uk-modal-grid">
          <div className="uk-modal-image">
            <img src={'../../assets/products/' + product.img} alt={product.name} />
            <div className="uk-modal-thumbs">
              {[product.img, product.img, product.img, product.img, product.img].map((t, i) => (
                <button key={i} className={i === 0 ? 'active' : ''}>
                  <img src={'../../assets/products/' + t} alt="" />
                </button>
              ))}
            </div>
          </div>
          <div className="uk-modal-body">
            <h2>{product.name}</h2>
            <div className="uk-modal-rating">
              <span className="stars">{product.rating} ★★★★☆</span>
              <span style={{ borderRight: '1px solid #ddd', paddingRight: 12 }}>120 đánh giá</span>
              <span>Đã bán {product.sold}</span>
            </div>
            <div className="uk-modal-price-block">
              <span className="old">{fmtPrice(product.oldPrice)}</span>
              <span className="price">{fmtPrice(product.price)}</span>
              <span className="pct">-{product.discount}%</span>
            </div>
            <div className="uk-modal-row">
              <span>Vận chuyển</span>
              <div>
                <span style={{ marginRight: 8 }}>🚚</span>
                Miễn phí vận chuyển <strong>cho đơn từ 50K</strong> · Giao trong 2-3 ngày
              </div>
            </div>
            <div className="uk-modal-row">
              <span>Phiên bản</span>
              <div className="uk-modal-options">
                {variants.map((v, i) => (
                  <button key={v} className={i === color ? 'active' : ''} onClick={() => setColor(i)}>{v}</button>
                ))}
              </div>
            </div>
            <div className="uk-modal-row">
              <span>Số lượng</span>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div className="uk-qty">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                  <input value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value || 1))} />
                  <button onClick={() => setQty(qty + 1)}>+</button>
                </div>
                <span style={{ color: '#757575', fontSize: 13 }}>{product.stock} sản phẩm có sẵn</span>
              </div>
            </div>
            <div className="uk-modal-actions">
              <button className="add" onClick={() => { onAdd(product, qty); }}>🛒 Thêm vào giỏ hàng</button>
              <button className="buy" onClick={() => { onAdd(product, qty); onClose(); }}>Mua ngay</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ open, items, onClose, onRemove, onCheckout }) {
  if (!open) return null;
  const total = items.reduce((s, it) => s + it.product.price * it.qty, 0);
  return (
    <>
      <div className="uk-overlay" onClick={onClose} style={{ background: 'rgba(0,0,0,.3)' }}></div>
      <aside className="uk-drawer">
        <div className="uk-drawer-head">
          <h3>Giỏ hàng ({items.length})</h3>
          <button onClick={onClose} style={{ border: 0, background: 'transparent', fontSize: 18 }}>×</button>
        </div>
        <div className="uk-drawer-body">
          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#757575' }}>
              Giỏ hàng trống.<br />Hãy thêm sản phẩm yêu thích!
            </div>
          )}
          {items.map((it, i) => (
            <div className="uk-cart-item" key={i}>
              <img src={'../../assets/products/' + it.product.img} alt={it.product.name} />
              <div>
                <h5>{it.product.name}</h5>
                <div className="price">{fmtPrice(it.product.price)}</div>
                <div className="qty">Số lượng: {it.qty}</div>
              </div>
              <button className="remove" onClick={() => onRemove(i)}>Xóa</button>
            </div>
          ))}
        </div>
        <div className="uk-drawer-foot">
          <div className="uk-drawer-total">
            <span style={{ color: '#555', fontSize: 13 }}>Tổng cộng</span>
            <strong>{fmtPrice(total)}</strong>
          </div>
          <button onClick={onCheckout} disabled={!items.length}
            style={{ opacity: items.length ? 1 : .5 }}>Thanh toán</button>
        </div>
      </aside>
    </>
  );
}

function Footer() {
  return (
    <footer className="uk-footer">
      <div className="container">
        <div>
          <h4>Chăm sóc khách hàng</h4>
          <ul>
            <li>Trung tâm trợ giúp</li>
            <li>Shopee Mall</li>
            <li>Hướng dẫn mua hàng</li>
            <li>Thanh toán</li>
            <li>Vận chuyển</li>
          </ul>
        </div>
        <div>
          <h4>Về Shopee</h4>
          <ul>
            <li>Giới thiệu</li>
            <li>Tuyển dụng</li>
            <li>Điều khoản</li>
            <li>Chính sách bảo mật</li>
          </ul>
        </div>
        <div>
          <h4>Thanh toán</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['Visa', 'JCB', 'MM', 'COD', 'SP'].map(t => (
              <span key={t} style={{ background: '#fff', border: '1px solid #ededed', borderRadius: 4, padding: '4px 8px', fontWeight: 600, fontSize: 11 }}>{t}</span>
            ))}
          </div>
          <h4 style={{ marginTop: 18 }}>Vận chuyển</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['GHN', 'GHTK', 'VNP', 'JNT', 'GRAB'].map(t => (
              <span key={t} style={{ background: '#fff', border: '1px solid #ededed', borderRadius: 4, padding: '4px 8px', fontWeight: 600, fontSize: 11 }}>{t}</span>
            ))}
          </div>
        </div>
        <div>
          <h4>Theo dõi Shopee</h4>
          <ul>
            <li>Facebook</li>
            <li>Instagram</li>
            <li>LinkedIn</li>
          </ul>
          <h4 style={{ marginTop: 18 }}>Tải app</h4>
          <ul>
            <li>App Store</li>
            <li>Google Play</li>
          </ul>
        </div>
      </div>
      <div className="uk-footer-bottom">
        © 2026 Shopee — Công ty TNHH Shopee · Địa chỉ: Tầng 4-5-6, Toà nhà Capital Place, 29 Liễu Giai, Ba Đình, Hà Nội
      </div>
    </footer>
  );
}

window.ProductModal = ProductModal;
window.CartDrawer = CartDrawer;
window.Footer = Footer;
