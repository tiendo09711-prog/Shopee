/* Seller — Sidebar & TopBar */

const SELLER_NAV = [
  { section: 'Tổng quan', items: [
    { id: 'home', label: 'Trang chủ', icon: '🏠' },
    { id: 'orders', label: 'Đơn hàng', icon: '📦', badge: 8 },
  ]},
  { section: 'Quản lý', items: [
    { id: 'products', label: 'Sản phẩm', icon: '🛒' },
    { id: 'marketing', label: 'Marketing', icon: '🎯' },
    { id: 'shop', label: 'Quản lý shop', icon: '🏪' },
  ]},
  { section: 'Tài chính', items: [
    { id: 'finance', label: 'Doanh thu', icon: '💰' },
    { id: 'analytics', label: 'Phân tích', icon: '📈' },
  ]},
  { section: 'Hệ thống', items: [
    { id: 'settings', label: 'Cài đặt', icon: '⚙' },
  ]},
];

function SellerSidebar({ active, onChange }) {
  return (
    <aside className="sk-sidebar">
      <div className="sk-brand">
        <div className="sk-brand-mark">S</div>
        <div className="sk-brand-name">Shopee</div>
        <div className="sk-brand-sub">Người Bán</div>
      </div>
      <nav className="sk-nav">
        {SELLER_NAV.map(s => (
          <div key={s.section}>
            <div className="sk-nav-section">{s.section}</div>
            {s.items.map(it => (
              <div
                key={it.id}
                className={'sk-nav-item ' + (active === it.id ? 'active' : '')}
                onClick={() => onChange(it.id)}
              >
                <span className="sk-nav-icon">{it.icon}</span>
                <span style={{ flex: 1 }}>{it.label}</span>
                {it.badge ? <span style={{ background: '#ee4d2d', color: '#fff', fontSize: 11, fontWeight: 700, padding: '0 6px', borderRadius: 999 }}>{it.badge}</span> : null}
              </div>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function SellerTopBar({ title }) {
  return (
    <div className="sk-topbar">
      <h1>{title}</h1>
      <div className="grow"></div>
      <input placeholder="Tìm theo mã đơn, tên khách hàng..." />
      <span className="pill">⚡ Đơn hàng cần xử lý: 8</span>
      <span style={{ fontSize: 18 }}>🔔</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="avatar">N</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Shop Nguyễn</div>
          <div style={{ fontSize: 11, color: '#757575' }}>Hoạt động</div>
        </div>
      </div>
    </div>
  );
}

window.SellerSidebar = SellerSidebar;
window.SellerTopBar = SellerTopBar;
