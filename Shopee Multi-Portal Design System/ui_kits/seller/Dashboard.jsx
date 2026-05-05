/* Seller — Dashboard home page */

function StatCard({ label, value, delta, up }) {
  return (
    <div className="sk-stat">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      <div className={'delta ' + (up ? 'up' : 'down')}>{up ? '▲' : '▼'} {delta}</div>
    </div>
  );
}

function DashboardHome() {
  return (
    <>
      <div className="sk-banner">
        <div>
          <h2>Chào mừng quay lại! 👋</h2>
          <p>Hôm nay shop của bạn có 8 đơn cần xử lý và 3 sản phẩm sắp hết hàng.</p>
        </div>
        <button>Xem hướng dẫn</button>
      </div>

      <div className="sk-stats">
        <StatCard label="Doanh thu hôm nay" value="₫4.2M" delta="12.4% so với hôm qua" up />
        <StatCard label="Đơn hàng mới" value="38" delta="6 chờ xác nhận" up />
        <StatCard label="Lượt truy cập shop" value="1,294" delta="3.1% giảm" />
        <StatCard label="Tỉ lệ chuyển đổi" value="2.94%" delta="0.4% tăng" up />
      </div>

      <div className="sk-row">
        <div className="sk-card">
          <div className="sk-card-head">
            <h3>Doanh thu 14 ngày qua</h3>
            <a href="#">Xem báo cáo ›</a>
          </div>
          <div className="sk-chart">
            {window.SELLER.CHART.map((v, i) => (
              <div key={i} className="sk-bar"
                data-label={'₫' + v + '00.000'}
                style={{ height: (v / 110 * 100) + '%' }}></div>
            ))}
          </div>
          <div className="sk-chart-axis">
            {window.SELLER.CHART_LABELS.map((l, i) => <span key={i}>{l}</span>)}
          </div>
        </div>

        <div className="sk-card">
          <div className="sk-card-head">
            <h3>Đơn hàng gần đây</h3>
            <a href="#">Tất cả ›</a>
          </div>
          <div className="sk-quick-list">
            {window.SELLER.ORDERS.slice(0, 5).map(o => (
              <div key={o.id} className="sk-quick-row">
                <div className="sk-avatar">{o.customer[0]}</div>
                <div>
                  <h5>{o.customer}</h5>
                  <span>{o.product.slice(0, 28)}{o.product.length > 28 ? '…' : ''}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong>₫{o.total.toLocaleString('vi-VN')}</strong>
                  <div style={{ fontSize: 11, color: '#757575' }}>{o.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

window.DashboardHome = DashboardHome;
