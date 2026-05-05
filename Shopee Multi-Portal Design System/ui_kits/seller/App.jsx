/* Seller — App orchestrator */

const TITLES = {
  home: 'Tổng quan shop',
  orders: 'Quản lý đơn hàng',
  products: 'Sản phẩm của tôi',
  marketing: 'Marketing',
  shop: 'Quản lý shop',
  finance: 'Doanh thu',
  analytics: 'Phân tích',
  settings: 'Cài đặt',
};

function SellerApp() {
  const [page, setPage] = React.useState('home');
  const [toast, setToast] = React.useState('');
  const action = (msg) => { setToast(msg); setTimeout(() => setToast(''), 1700); };

  return (
    <div className="sk-app">
      <SellerSidebar active={page} onChange={setPage} />
      <div className="sk-main">
        <SellerTopBar title={TITLES[page] || 'Trang'} />
        <div className="sk-content">
          {page === 'home' && <DashboardHome />}
          {page === 'orders' && <OrdersPage onAction={action} />}
          {page === 'products' && <ProductsPage onAction={action} />}
          {!['home', 'orders', 'products'].includes(page) && (
            <div className="sk-empty">
              <div style={{ fontSize: 48 }}>🚧</div>
              <h3 style={{ marginTop: 12, color: '#222' }}>{TITLES[page]}</h3>
              <p>Khu vực đang được hoàn thiện trong phiên bản UI Kit này.</p>
            </div>
          )}
        </div>
      </div>
      {toast && <div className="sk-toast">{toast}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<SellerApp />);
