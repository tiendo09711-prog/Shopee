/* Buyer storefront — Header */
function fmtPrice(n) { return n.toLocaleString('vi-VN') + 'đ'; }
window.fmtPrice = fmtPrice;

function Header({ onOpenCart, cartCount, wishlistCount, onSearch }) {
  const [keyword, setKeyword] = React.useState('');
  return (
    <header className="uk-header">
      <div className="uk-header-top">
        <div className="container uk-header-top-inner">
          <div>
            <a href="#">Kênh Người Bán</a>
            <span>Kết nối</span>
            <span>Tải ứng dụng</span>
          </div>
          <div>
            <span>🌐 Tiếng Việt</span>
            <span>Thông báo</span>
            <span>Hỗ trợ</span>
            <a href="#">Đăng ký</a>
            <a href="#">Đăng nhập</a>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="uk-header-main-inner">
          <a href="#" className="uk-logo">
            <div className="uk-logo-mark">S</div>
            <div className="uk-logo-text">Shopee</div>
          </a>
          <div className="uk-search-wrap">
            <form className="uk-search" onSubmit={(e) => { e.preventDefault(); onSearch(keyword); }}>
              <input
                type="text"
                placeholder="Shopee bao ship 0Đ - Đăng ký miễn phí ngay!"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button type="submit" aria-label="Tìm kiếm">🔍</button>
            </form>
            <div className="uk-search-tags">
              {window.BUYER.HOT_KEYWORDS.map(k => (
                <a key={k} href="#" onClick={(e) => { e.preventDefault(); setKeyword(k); onSearch(k); }}>{k}</a>
              ))}
            </div>
          </div>
          <div className="uk-action-icons">
            <a className="uk-icon-link" href="#" aria-label="Yêu thích">
              <span>❤</span>
              {wishlistCount > 0 && <small>{wishlistCount}</small>}
            </a>
            <a className="uk-icon-link" href="#" aria-label="Thông báo">
              <span>🔔</span><small>12</small>
            </a>
            <button className="uk-icon-link" onClick={onOpenCart} aria-label="Giỏ hàng" style={{ background: 'transparent', border: 0 }}>
              <span>🛒</span>
              {cartCount > 0 && <small>{cartCount}</small>}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

window.Header = Header;
