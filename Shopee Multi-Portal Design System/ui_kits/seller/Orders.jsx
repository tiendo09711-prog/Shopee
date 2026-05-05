/* Seller — Orders list */

const ORDER_TABS = [
  { id: 'all', label: 'Tất cả', count: 5 },
  { id: 'pending', label: 'Chờ xác nhận', count: 1 },
  { id: 'processing', label: 'Đang xử lý', count: 1 },
  { id: 'shipping', label: 'Đang giao', count: 1 },
  { id: 'done', label: 'Đã giao', count: 2 },
  { id: 'canceled', label: 'Đã hủy', count: 0 },
];

function statusClass(s) {
  if (s === 'Chờ xác nhận' || s === 'Đang xử lý') return 's-pending';
  if (s === 'Đang giao') return 's-shipping';
  if (s === 'Đã giao') return 's-done';
  return 's-off';
}

function OrdersPage({ onAction }) {
  const [tab, setTab] = React.useState('all');
  const orders = window.SELLER.ORDERS.filter(o => {
    if (tab === 'all') return true;
    if (tab === 'pending') return o.status === 'Chờ xác nhận';
    if (tab === 'processing') return o.status === 'Đang xử lý';
    if (tab === 'shipping') return o.status === 'Đang giao';
    if (tab === 'done') return o.status === 'Đã giao';
    return false;
  });
  return (
    <div className="sk-card">
      <div className="sk-tabs">
        {ORDER_TABS.map(t => (
          <button key={t.id} className={'sk-tab ' + (tab === t.id ? 'active' : '')} onClick={() => setTab(t.id)}>
            {t.label} <span className="badge">{t.count}</span>
          </button>
        ))}
      </div>
      <div className="sk-toolbar">
        <input placeholder="Mã đơn / khách hàng / sản phẩm" />
        <select>
          <option>Tất cả vận chuyển</option>
          <option>Hỏa Tốc</option>
          <option>Trong Ngày</option>
          <option>Nhanh</option>
        </select>
        <input type="date" />
        <div className="grow"></div>
        <button className="sk-btn ghost">Xuất Excel</button>
        <button className="sk-btn">Cập nhật hàng loạt</button>
      </div>

      {orders.length === 0 ? <div className="sk-empty">Không có đơn hàng phù hợp</div> : (
        <table className="sk-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>Mã đơn</th>
              <th>Sản phẩm</th>
              <th>Khách hàng</th>
              <th>Vận chuyển</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td><input type="checkbox" /></td>
                <td><strong>#{o.id.replace('od_', '')}</strong></td>
                <td>{o.product}</td>
                <td>{o.customer}</td>
                <td>{o.shipping}</td>
                <td><strong style={{ color: '#ee4d2d' }}>₫{o.total.toLocaleString('vi-VN')}</strong></td>
                <td><span className={'sk-status ' + statusClass(o.status)}>{o.status}</span></td>
                <td style={{ color: '#757575' }}>{o.createdAt}</td>
                <td>
                  <div className="sk-row-actions">
                    <button className="primary" onClick={() => onAction('Xác nhận đơn ' + o.id)}>Xác nhận</button>
                    <button onClick={() => onAction('In hóa đơn ' + o.id)}>In</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

window.OrdersPage = OrdersPage;
