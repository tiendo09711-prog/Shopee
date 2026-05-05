function UsersPage({ onAction }) {
  const [tab, setTab] = React.useState('all');
  const tabs = [
    { id: 'all', label: 'Tất cả · 25,480' },
    { id: 'customer', label: 'Khách hàng · 24,200' },
    { id: 'seller', label: 'Người bán · 1,280' },
    { id: 'admin', label: 'Admin · 18' },
    { id: 'locked', label: 'Bị khóa · 124' },
  ];
  const rows = window.ADMIN.USERS.filter(u => {
    if (tab === 'all') return true;
    if (tab === 'customer') return u.role === 'Customer';
    if (tab === 'seller') return u.role === 'Seller';
    if (tab === 'admin') return u.role === 'Admin';
    if (tab === 'locked') return u.status === 'Bị khóa';
    return true;
  });
  return (
    <>
      <PageHead
        eyebrow="Quản lý · Người dùng"
        title="Tài khoản trên toàn sàn"
        description="Danh sách tất cả tài khoản, phân loại khách hàng, người bán và admin."
        actions={['Xuất danh sách', 'Mời admin mới']}
        onAction={onAction}
      />
      <div className="ad-stats">
        {[
          { label: 'Tài khoản hoạt động', value: '24,832' },
          { label: 'Đang chờ duyệt', value: '56' },
          { label: 'Bị khóa', value: '124' },
          { label: 'Mới tuần này', value: '+412' },
        ].map(s => (
          <div className="ad-stat" key={s.label}>
            <div className="label">{s.label}</div>
            <div className="value" style={{ fontSize: 22 }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div className="ad-panel" style={{ marginTop: 18 }}>
        <div className="ad-panel-head">
          <div className="ad-tabs">
            {tabs.map(t => (
              <button key={t.id} className={'ad-tab ' + (tab === t.id ? 'active' : '')} onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
          </div>
          <a href="#">Bộ lọc nâng cao</a>
        </div>
        <table className="ad-table">
          <thead>
            <tr>
              <th>Tên</th><th>Email</th><th>SĐT</th><th>Vai trò</th><th>Trạng thái</th><th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(u => (
              <tr key={u.email}>
                <td><strong>{u.name}</strong></td>
                <td style={{ color: '#6b6258' }}>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.role}</td>
                <td><span className={'ad-status ' + u.tone}>{u.status}</span></td>
                <td>
                  <div className="ad-row-actions">
                    <button className="primary" onClick={() => onAction('Xem ' + u.name)}>Xem</button>
                    <button className="danger" onClick={() => onAction('Khóa ' + u.name)}>Khóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function OrdersPage({ onAction }) {
  return (
    <>
      <PageHead
        eyebrow="Quản lý · Đơn hàng"
        title="Theo dõi đơn hàng & tranh chấp"
        description="Xem trạng thái đơn theo thời gian thực, xử lý hoàn trả, khiếu nại."
        actions={['Tìm theo mã đơn', 'Xử lý tranh chấp']}
        onAction={onAction}
      />
      <div className="ad-stats">
        {[
          { label: 'Tổng đơn', value: '12,640', tone: 'plain' },
          { label: 'Chờ xác nhận', value: '248', tone: 'accent' },
          { label: 'Đang giao', value: '1,032', tone: 'plain' },
          { label: 'Tranh chấp', value: '64', tone: 'dark' },
        ].map(s => (
          <div className={'ad-stat ' + (s.tone === 'dark' ? 'dark' : s.tone === 'accent' ? 'accent' : '')} key={s.label}>
            <div className="label">{s.label}</div>
            <div className="value" style={{ fontSize: 22 }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div className="ad-panel" style={{ marginTop: 18 }}>
        <div className="ad-panel-head"><h3>Đơn gần đây</h3><a href="#">Xem tất cả →</a></div>
        <table className="ad-table">
          <thead><tr><th>Mã đơn</th><th>Khách</th><th>Shop</th><th>Tổng tiền</th><th>Trạng thái</th><th></th></tr></thead>
          <tbody>
            {window.ADMIN.ORDERS.map(o => (
              <tr key={o.id}>
                <td><strong>{o.id}</strong></td>
                <td>{o.customer}</td>
                <td style={{ color: '#6b6258' }}>{o.shop}</td>
                <td><strong style={{ fontFamily: 'Space Grotesk' }}>{o.total}</strong></td>
                <td><span className={'ad-status ' + o.tone}>{o.status}</span></td>
                <td><div className="ad-row-actions"><button className="primary" onClick={() => onAction('Mở ' + o.id)}>Chi tiết</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

window.UsersPage = UsersPage;
window.OrdersPage = OrdersPage;
