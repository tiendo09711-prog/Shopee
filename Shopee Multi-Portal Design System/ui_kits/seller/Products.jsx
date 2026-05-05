/* Seller — Products list */

function ProductsPage({ onAction }) {
  const [tab, setTab] = React.useState('all');
  const filtered = window.SELLER.PRODUCTS.filter(p => {
    if (tab === 'all') return true;
    if (tab === 'live') return p.status === 'Đang bán';
    if (tab === 'low') return p.status === 'Sắp hết hàng';
    if (tab === 'hidden') return p.status === 'Tạm ẩn';
    return true;
  });
  const tabs = [
    { id: 'all', label: 'Tất cả', count: window.SELLER.PRODUCTS.length },
    { id: 'live', label: 'Đang bán', count: window.SELLER.PRODUCTS.filter(p => p.status === 'Đang bán').length },
    { id: 'low', label: 'Sắp hết hàng', count: window.SELLER.PRODUCTS.filter(p => p.status === 'Sắp hết hàng').length },
    { id: 'hidden', label: 'Tạm ẩn', count: window.SELLER.PRODUCTS.filter(p => p.status === 'Tạm ẩn').length },
  ];

  return (
    <div className="sk-card">
      <div className="sk-tabs">
        {tabs.map(t => (
          <button key={t.id} className={'sk-tab ' + (tab === t.id ? 'active' : '')} onClick={() => setTab(t.id)}>
            {t.label} <span className="badge">{t.count}</span>
          </button>
        ))}
      </div>
      <div className="sk-toolbar">
        <input placeholder="Tìm theo tên sản phẩm hoặc SKU" />
        <select><option>Tất cả danh mục</option><option>Thời trang</option><option>Điện tử</option></select>
        <div className="grow"></div>
        <button className="sk-btn ghost">Nhập từ Excel</button>
        <button className="sk-btn" onClick={() => onAction('Tạo sản phẩm mới')}>+ Thêm sản phẩm</button>
      </div>

      <table className="sk-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Sản phẩm</th>
            <th>SKU</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Đã bán</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(p => (
            <tr key={p.id}>
              <td><input type="checkbox" /></td>
              <td>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <img src={'../../assets/products/' + p.img} className="thumb" alt="" />
                  <div>
                    <div style={{ fontWeight: 500 }}>{p.name}</div>
                    <div style={{ color: '#757575', fontSize: 11 }}>ID {p.id}</div>
                  </div>
                </div>
              </td>
              <td style={{ color: '#555' }}>{p.sku}</td>
              <td style={{ color: '#ee4d2d', fontWeight: 700 }}>₫{p.price.toLocaleString('vi-VN')}</td>
              <td>{p.stock === 0 ? <span style={{ color: '#d0011b' }}>Hết</span> : p.stock}</td>
              <td>{p.sold}</td>
              <td>
                <span className={'sk-status ' + (
                  p.status === 'Đang bán' ? 's-on' :
                  p.status === 'Sắp hết hàng' ? 's-low' : 's-off'
                )}>{p.status}</span>
              </td>
              <td>
                <div className="sk-row-actions">
                  <button className="primary" onClick={() => onAction('Sửa ' + p.name)}>Sửa</button>
                  <button onClick={() => onAction('Tạm ẩn ' + p.name)}>Ẩn</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

window.ProductsPage = ProductsPage;
