import './Banner.css'

function Banner() {
  return (
    <section className="banner">
      <div className="container banner-grid">
        <div className="banner-main card">
          <div className="banner-main-content">
            <div>
              <p className="banner-tag">11.11 SIÊU SALE</p>
              <h2>Hoàn xu xtra lên đến 1 triệu</h2>
              <p>Săn deal điện thoại, đồng hồ, áo thun với giao diện gần giống video demo.</p>
            </div>
            <div className="banner-phone-stack">
              <div className="banner-phone orange"></div>
              <div className="banner-phone white"></div>
              <div className="banner-phone blue"></div>
            </div>
          </div>
        </div>
        <div className="banner-side-wrapper">
          <div className="banner-side card"><strong>Mã giảm giá</strong><span>Giảm đến 50%</span></div>
          <div className="banner-side card"><strong>Freeship Xtra</strong><span>Toàn quốc hôm nay</span></div>
        </div>
      </div>
    </section>
  )
}

export default Banner
