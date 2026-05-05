function AdminApp() {
  const [page, setPage] = React.useState('dashboard');
  const [toast, setToast] = React.useState('');
  const onAction = (msg) => { setToast(msg); setTimeout(() => setToast(''), 1700); };

  return (
    <div className="ad-app">
      <AdminSidebar active={page} onChange={setPage} />
      <div className="ad-main">
        {page === 'dashboard' && <Dashboard onAction={onAction} />}
        {page === 'users' && <UsersPage onAction={onAction} />}
        {page === 'orders' && <OrdersPage onAction={onAction} />}
        {!['dashboard', 'users', 'orders'].includes(page) && (
          <>
            <PageHead
              eyebrow={'Quản lý · ' + (window.ADMIN.NAV.find(n => n.id === page)?.label)}
              title="Khu vực đang hoàn thiện"
              description="Phần này còn trong UI Kit. Hãy báo nếu bạn muốn mình mở rộng module cụ thể."
              actions={['Quay lại tổng quan']}
              onAction={() => setPage('dashboard')}
            />
            <div className="ad-panel" style={{ marginTop: 22, textAlign: 'center', padding: 40 }}>
              <div style={{ fontSize: 38 }}>◐</div>
              <h3 style={{ fontFamily: 'Space Grotesk', fontWeight: 700, marginTop: 8 }}>Module sắp ra mắt</h3>
              <p style={{ color: '#6b6258', marginTop: 6 }}>Có thể tham khảo `admin/src/pages/{page}` trong codebase nguồn.</p>
            </div>
          </>
        )}
      </div>
      {toast && <div className="ad-toast">{toast}</div>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AdminApp />);
