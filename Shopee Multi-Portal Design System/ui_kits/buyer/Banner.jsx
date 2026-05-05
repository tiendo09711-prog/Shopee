/* Buyer storefront — Banner & highlight row */

function Banner() {
  return (
    <div className="uk-banner">
      <div>
        <h1>9.9 Ngày Siêu Mua Sắm</h1>
        <p>Săn deal độc quyền · Voucher giảm tới 500K · Freeship toàn quốc</p>
        <div className="uk-banner-cta">
          <button>Mua ngay</button>
          <button className="ghost">Tìm hiểu thêm</button>
        </div>
      </div>
      <div className="uk-banner-art">
        <div>Bắt đầu sau</div>
        <strong>02 : 14 : 56</strong>
      </div>
    </div>
  );
}

function HighlightRow() {
  return (
    <section className="uk-highlight">
      <div className="uk-card">
        <h3>Voucher hôm nay</h3>
        <div className="uk-vouchers">
          {window.BUYER.VOUCHERS.map(v => (
            <div className="uk-voucher" key={v.code}>
              <strong>{v.code}</strong>
              <span>{v.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="uk-card">
        <h3>Tìm kiếm nổi bật</h3>
        <div className="uk-hot-keywords">
          {window.BUYER.HOT_KEYWORDS.map(k => <a href="#" key={k}>{k}</a>)}
        </div>
      </div>
    </section>
  );
}

window.Banner = Banner;
window.HighlightRow = HighlightRow;
