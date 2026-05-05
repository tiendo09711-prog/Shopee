function AdminSettings() {
  return (
    <div className="admin-page">
      <header className="admin-hero"><p className="admin-eyebrow">Settings</p><h1>Cài đặt hệ thống</h1><p className="admin-hero-copy">Mock cấu hình hệ thống, phí sàn và trạng thái đăng ký seller.</p></header>
      <section className="admin-panel">
        <table className="admin-table"><tbody><tr><td>Tên hệ thống</td><td>PShop</td></tr><tr><td>Phí sàn mock</td><td>3%</td></tr><tr><td>Đăng ký seller</td><td>Bật</td></tr><tr><td>LocalStorage contract</td><td>pshop_users, pshop_products, pshop_orders, pshop_sellers</td></tr></tbody></table>
      </section>
    </div>
  )
}

export default AdminSettings
