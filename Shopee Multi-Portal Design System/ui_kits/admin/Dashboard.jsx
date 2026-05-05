function AdminSidebar({ active, onChange }) {
  return (
    <aside className="ad-sidebar">
      <div className="ad-brand">
        <div className="ad-brand-mark">S</div>
        <div>
          <strong>Shopee Admin</strong>
          <span>super.admin@shopee.vn</span>
        </div>
      </div>
      <div className="ad-search"><input placeholder="Tìm theo người dùng, đơn, shop..." /></div>
      <nav className="ad-nav">
        {window.ADMIN.NAV.map(it => (
          <div key={it.id} className={'ad-nav-item ' + (active === it.id ? 'active' : '')} onClick={() => onChange(it.id)}>
            <span className="ad-nav-icon">{it.icon}</span>
            <span style={{ flex: 1 }}>{it.label}</span>
          </div>
        ))}
      </nav>
      <div className="ad-side-card">
        <p>Phiên đang hoạt động</p>
        <strong>Super Admin</strong>
        <button>Đăng xuất</button>
      </div>
    </aside>
  );
}

function PageHead({ eyebrow, title, description, actions, onAction }) {
  return (
    <header className="ad-page-head">
      <div className="ad-eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{description}</p>
      {actions && (
        <div className="ad-page-actions">
          {actions.map((a, i) => (
            <button key={a} className={'ad-pill ' + (i === 0 ? 'primary' : i === 1 ? 'dark' : '')} onClick={() => onAction(a)}>
              {a}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

function StatGrid() {
  return (
    <section className="ad-stats">
      {window.ADMIN.STATS.map(s => (
        <div key={s.label} className={'ad-stat ' + (s.tone === 'dark' ? 'dark' : s.tone === 'accent' ? 'accent' : '')}>
          <div className="label">{s.label}</div>
          <div className="value">{s.value}</div>
        </div>
      ))}
    </section>
  );
}

function Dashboard({ onAction }) {
  const max = Math.max(...window.ADMIN.CHART);
  return (
    <>
      <PageHead
        eyebrow="Tổng quan · 03/05/2026"
        title="Sàn Shopee đang vận hành ổn định"
        description="Theo dõi nhanh số liệu toàn sàn, hiệu suất vận hành và các cảnh báo mới nhất từ shop, khách hàng và hệ thống."
        actions={['Cập nhật cấu hình', 'Xem nhật ký admin', 'Xuất báo cáo']}
        onAction={onAction}
      />
      <StatGrid />
      <div className="ad-row">
        <div className="ad-panel">
          <div className="ad-panel-head">
            <h3>Doanh thu 7 ngày qua</h3>
            <a href="#">Xem chi tiết →</a>
          </div>
          <div className="ad-chart">
            {window.ADMIN.CHART.map((v, i) => (
              <div key={i} className="ad-bar-wrap">
                <div className={'ad-bar ' + (i % 3 === 0 ? 'alt' : '')} style={{ height: (v / max * 100) + '%' }}></div>
                <div className="ad-bar-axis">{window.ADMIN.CHART_LABELS[i]}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, padding: '12px 0 0', borderTop: '1px dashed rgba(53,40,26,.12)' }}>
            <div>
              <div style={{ fontSize: 12, color: '#6b6258' }}>Top shop bán chạy</div>
              <strong style={{ fontFamily: 'Space Grotesk' }}>trendmall.vn</strong>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#6b6258' }}>Top sản phẩm</div>
              <strong style={{ fontFamily: 'Space Grotesk' }}>Tai nghe Bluetooth A12</strong>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#6b6258' }}>Đơn chờ xử lý</div>
              <strong style={{ fontFamily: 'Space Grotesk', color: '#f15a24' }}>182</strong>
            </div>
          </div>
        </div>
        <div className="ad-panel">
          <div className="ad-panel-head">
            <h3>Hoạt động gần đây</h3>
            <a href="#">Tất cả →</a>
          </div>
          <div className="ad-activity">
            {window.ADMIN.ACTIVITY.map((a, i) => (
              <div key={i} className="ad-activity-row">
                <div className={'ad-act-dot ' + (a.dark ? 'dark' : '')}>{a.glyph}</div>
                <div>
                  <h5>{a.title}</h5>
                  <span>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

window.AdminSidebar = AdminSidebar;
window.PageHead = PageHead;
window.StatGrid = StatGrid;
window.Dashboard = Dashboard;
