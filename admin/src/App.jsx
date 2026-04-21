const summaryCards = [
  {
    label: 'Doanh thu hôm nay',
    value: '₫1.248B',
    delta: '+12.4% so với hôm qua',
    icon: '₫',
    tone: 'revenue',
  },
  {
    label: 'Đơn chờ xử lý',
    value: '284',
    delta: '18 đơn cần duyệt gấp',
    icon: '🧾',
    tone: 'orders',
  },
  {
    label: 'Shop bị gắn cờ',
    value: '19',
    delta: '4 shop tăng rủi ro',
    icon: '🛡️',
    tone: 'warning',
  },
  {
    label: 'Ticket hỗ trợ',
    value: '63',
    delta: '9 ticket quá SLA',
    icon: '💬',
    tone: 'support',
  },
]

const quickStats = [
  { label: 'Shop đang hoạt động', value: '12.450', helper: '+126 shop mới' },
  { label: 'Tỉ lệ giao thành công', value: '96.8%', helper: 'Toàn sàn 24h' },
  { label: 'Khiếu nại mở', value: '146', helper: 'Cần phân ca lại' },
]

const moderationQueue = [
  {
    shop: 'trendlab.vn',
    owner: 'Nguyễn Minh',
    tag: 'Mall',
    issue: 'Ảnh sản phẩm nhạy cảm',
    priority: 'Cao',
    status: 'Chờ duyệt',
    risk: 'Cần xử lý trong 20 phút',
  },
  {
    shop: 'gearzone.pro',
    owner: 'Phạm Quang',
    tag: 'Yêu thích+',
    issue: 'Tăng giá bất thường',
    priority: 'Trung bình',
    status: 'Đang kiểm tra',
    risk: 'Đã gửi sang đội giá bán',
  },
  {
    shop: 'nhabepxinh',
    owner: 'Lê Anh',
    tag: 'Normal',
    issue: 'Tỉ lệ hủy đơn vượt ngưỡng',
    priority: 'Cao',
    status: 'Cần gọi lại',
    risk: 'Tăng 14% trong 48h',
  },
  {
    shop: 'freshbox.daily',
    owner: 'Trần Vy',
    tag: 'Food',
    issue: 'Phản hồi giao trễ',
    priority: 'Thấp',
    status: 'Theo dõi',
    risk: 'Khách phàn nàn giờ cao điểm',
  },
]

const systemSignals = [
  { name: 'API Gateway', state: 'Ổn định', detail: 'P95 182ms', tone: 'good' },
  { name: 'Search Index', state: 'Cần chú ý', detail: '1 shard đang lag', tone: 'warn' },
  { name: 'Payment Webhook', state: 'Ổn định', detail: 'Retry rate 0.3%', tone: 'good' },
  { name: 'Fraud Stream', state: 'Bận tải', detail: 'Backlog 248 events', tone: 'bad' },
]

const regionalTraffic = [
  { region: 'Hồ Chí Minh', share: '34%', trend: '+5.2%', progress: '34%' },
  { region: 'Hà Nội', share: '28%', trend: '+2.1%', progress: '28%' },
  { region: 'Đà Nẵng', share: '9%', trend: '+1.6%', progress: '9%' },
  { region: 'Cần Thơ', share: '6%', trend: '-0.8%', progress: '6%' },
]

const campaigns = [
  { title: 'Flash Sale 4.4', meta: 'Ưu tiên duyệt banner và giá sốc', status: 'Đang chạy' },
  { title: 'Shopee Mall Week', meta: '98 shop cần xác minh tồn kho', status: 'Sắp tới' },
  { title: 'Voucher hoàn xu', meta: 'Kiểm tra gian lận mã giảm giá', status: 'Theo dõi' },
]

const menuItems = [
  { label: 'Tổng quan', icon: '🏠', active: true },
  { label: 'Kiểm duyệt', icon: '🛡️' },
  { label: 'Đơn hàng', icon: '📦' },
  { label: 'Người bán', icon: '🏬' },
  { label: 'CSKH', icon: '💬' },
  { label: 'Thiết lập', icon: '⚙️' },
]

function App() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark">S</div>
          <div>
            <strong>Shopee Admin</strong>
            <span>Seller Operations Center</span>
          </div>
        </div>

        <div className="admin-store-pill">Khu vực quản trị vận hành sàn</div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <a key={item.label} className={item.active ? 'active' : ''} href="#dashboard">
              <span className="admin-nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="admin-sidebar-card">
          <p>Phiên trực hiện tại</p>
          <strong>Ops Morning Shift</strong>
          <span>08:00 - 17:00 ICT</span>
          <button type="button">Xem bàn giao</button>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <p className="admin-topbar-label">Trang quản trị</p>
            <h1>Shopee Admin Dashboard</h1>
          </div>

          <div className="admin-topbar-actions">
            <label className="admin-search">
              <span>🔎</span>
              <input type="text" placeholder="Tìm kiếm shop, đơn hàng, ticket..." />
            </label>
            <button type="button" className="admin-icon-btn" aria-label="Thông báo">🔔</button>
            <button type="button" className="admin-icon-btn" aria-label="Hồ sơ">👤</button>
          </div>
        </header>

        <main className="admin-main">
          <section className="admin-banner" id="dashboard">
            <div className="admin-banner-copy">
              <div className="admin-banner-chip">Kênh vận hành sàn</div>
              <h2>Trung tâm điều phối người bán và đơn hàng</h2>
              <p>
                Tập trung kiểm duyệt shop, theo dõi đơn, giám sát hỗ trợ và vận hành
                chiến dịch theo nhịp giao diện Shopee, nhưng vẫn tách biệt hoàn toàn với phần customer hiện tại.
              </p>
            </div>

            <div className="admin-banner-actions">
              <button type="button" className="admin-primary-btn">Tạo chiến dịch</button>
              <button type="button" className="admin-secondary-btn">Xuất báo cáo ca trực</button>
            </div>
          </section>

          <section className="admin-summary-grid">
            {summaryCards.map((card) => (
              <article key={card.label} className={`admin-summary-card admin-summary-card-${card.tone}`}>
                <div className="admin-summary-head">
                  <span>{card.label}</span>
                  <div className="admin-summary-icon">{card.icon}</div>
                </div>
                <strong>{card.value}</strong>
                <small>{card.delta}</small>
              </article>
            ))}
          </section>

          <section className="admin-board-grid">
            <section className="admin-panel admin-panel-main">
              <div className="admin-panel-head">
                <div>
                  <p className="admin-panel-kicker">Bảng ưu tiên</p>
                  <h3>Shop cần xử lý ngay</h3>
                </div>
                <div className="admin-panel-actions">
                  <button type="button" className="admin-filter-btn">Lọc mức độ</button>
                  <button type="button" className="admin-filter-btn">Hôm nay</button>
                </div>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Shop</th>
                      <th>Vấn đề</th>
                      <th>Ưu tiên</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moderationQueue.map((item) => (
                      <tr key={item.shop}>
                        <td>
                          <div className="admin-shop-cell">
                            <div className="admin-shop-avatar">{item.shop.charAt(0).toUpperCase()}</div>
                            <div>
                              <strong>{item.shop}</strong>
                              <span>{item.owner} · {item.tag}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="admin-issue-cell">
                            <strong>{item.issue}</strong>
                            <span>{item.risk}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`admin-badge admin-badge-${item.priority.toLowerCase().replace(' ', '-')}`}>
                            {item.priority}
                          </span>
                        </td>
                        <td>
                          <span className="admin-status-link">{item.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="admin-side-stack">
              <section className="admin-panel">
                <div className="admin-panel-head compact">
                  <div>
                    <p className="admin-panel-kicker">Chiến dịch</p>
                    <h3>Lịch vận hành nổi bật</h3>
                  </div>
                </div>
                <div className="admin-campaign-list">
                  {campaigns.map((item) => (
                    <article key={item.title} className="admin-campaign-item">
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.meta}</span>
                      </div>
                      <em>{item.status}</em>
                    </article>
                  ))}
                </div>
              </section>

              <section className="admin-panel">
                <div className="admin-panel-head compact">
                  <div>
                    <p className="admin-panel-kicker">Runtime</p>
                    <h3>Tín hiệu hệ thống</h3>
                  </div>
                </div>
                <div className="admin-signal-list">
                  {systemSignals.map((signal) => (
                    <article key={signal.name} className="admin-signal-item">
                      <div>
                        <strong>{signal.name}</strong>
                        <span>{signal.detail}</span>
                      </div>
                      <em className={`state-${signal.tone}`}>{signal.state}</em>
                    </article>
                  ))}
                </div>
              </section>
            </section>
          </section>

          <section className="admin-lower-grid">
            <section className="admin-panel">
              <div className="admin-panel-head compact">
                <div>
                  <p className="admin-panel-kicker">Traffic mix</p>
                  <h3>Lưu lượng theo khu vực</h3>
                </div>
              </div>

              <div className="admin-region-list">
                {regionalTraffic.map((item) => (
                  <article key={item.region} className="admin-region-item">
                    <div className="admin-region-meta">
                      <div>
                        <strong>{item.region}</strong>
                        <span>Tỉ trọng {item.share}</span>
                      </div>
                      <em className={item.trend.startsWith('-') ? 'down' : 'up'}>{item.trend}</em>
                    </div>
                    <div className="admin-progress">
                      <div style={{ width: item.progress }} />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="admin-panel">
              <div className="admin-panel-head compact">
                <div>
                  <p className="admin-panel-kicker">Nhanh trong ngày</p>
                  <h3>Snapshot vận hành</h3>
                </div>
              </div>

              <div className="admin-mini-stats">
                {quickStats.map((stat) => (
                  <article key={stat.label} className="admin-mini-stat">
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                    <small>{stat.helper}</small>
                  </article>
                ))}
              </div>

              <ul className="admin-checklist">
                <li>Customer frontend vẫn chạy độc lập, không bị sửa.</li>
                <li>Admin dùng mock data riêng, không phụ thuộc backend.</li>
                <li>Layout tối ưu lại theo tinh thần Shopee Seller Center.</li>
                <li>Dễ nối API thật sau này mà không phải thay toàn bộ UI.</li>
              </ul>
            </section>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
