const summaryCards = [
  { label: 'GMV Hôm Nay', value: '1.248B', delta: '+12.4%', tone: 'hot' },
  { label: 'Đơn Cần Duyệt', value: '284', delta: '+18 đơn', tone: 'warn' },
  { label: 'Shop Bị Gắn Cờ', value: '19', delta: '-4 shop', tone: 'cool' },
  { label: 'Ticket Hỗ Trợ', value: '63', delta: '9 quá SLA', tone: 'neutral' },
]

const moderationQueue = [
  { shop: 'trendlab.vn', owner: 'Nguyen Minh', issue: 'Ảnh sản phẩm nhạy cảm', priority: 'Cao', status: 'Chờ duyệt' },
  { shop: 'gearzone.pro', owner: 'Pham Quang', issue: 'Tăng giá bất thường', priority: 'Trung bình', status: 'Đang kiểm tra' },
  { shop: 'nhabepxinh', owner: 'Le Anh', issue: 'Tỉ lệ hủy đơn vượt ngưỡng', priority: 'Cao', status: 'Cần gọi lại' },
  { shop: 'freshbox.daily', owner: 'Tran Vy', issue: 'Phản hồi giao trễ', priority: 'Thấp', status: 'Theo dõi' },
]

const systemSignals = [
  { name: 'API Gateway', state: 'Ổn định', detail: 'P95 182ms' },
  { name: 'Search Index', state: 'Cần chú ý', detail: '1 shard đang lag' },
  { name: 'Payment Webhook', state: 'Ổn định', detail: 'Retry rate 0.3%' },
  { name: 'Fraud Stream', state: 'Bận tải', detail: 'Backlog 248 events' },
]

const regionalTraffic = [
  { region: 'Hồ Chí Minh', share: '34%', trend: '+5.2%' },
  { region: 'Hà Nội', share: '28%', trend: '+2.1%' },
  { region: 'Đà Nẵng', share: '9%', trend: '+1.6%' },
  { region: 'Cần Thơ', share: '6%', trend: '-0.8%' },
]

function App() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark">S</div>
          <div>
            <strong>Shopee Admin</strong>
            <span>Control tower for ops</span>
          </div>
        </div>

        <nav className="admin-nav">
          <a className="active" href="#dashboard">Dashboard</a>
          <a href="#moderation">Moderation</a>
          <a href="#orders">Orders</a>
          <a href="#shops">Shops</a>
          <a href="#support">Support</a>
          <a href="#settings">Settings</a>
        </nav>

        <div className="admin-sidebar-card">
          <p>Phiên trực hiện tại</p>
          <strong>Ops Morning Shift</strong>
          <span>08:00 - 17:00 ICT</span>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-hero" id="dashboard">
          <div>
            <p className="admin-eyebrow">Admin portal</p>
            <h1>Bảng điều phối vận hành đa hệ</h1>
            <p className="admin-hero-copy">
              Giao diện admin này dùng mock data để bạn có khung quản trị riêng,
              không phụ thuộc backend và không đụng logic customer hiện tại.
            </p>
          </div>

          <div className="admin-hero-actions">
            <button type="button" className="admin-primary-btn">Tạo chiến dịch kiểm tra</button>
            <button type="button" className="admin-ghost-btn">Xuất báo cáo ca trực</button>
          </div>
        </header>

        <section className="admin-summary-grid">
          {summaryCards.map((card) => (
            <article key={card.label} className={`admin-card admin-card-${card.tone}`}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <small>{card.delta}</small>
            </article>
          ))}
        </section>

        <section className="admin-content-grid">
          <section className="admin-panel admin-panel-wide" id="moderation">
            <div className="admin-panel-head">
              <div>
                <p className="admin-panel-kicker">Moderation queue</p>
                <h2>Shop cần xử lý ưu tiên</h2>
              </div>
              <button type="button" className="admin-ghost-btn">Lọc theo mức độ</button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Shop</th>
                    <th>Chủ shop</th>
                    <th>Vấn đề</th>
                    <th>Ưu tiên</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {moderationQueue.map((item) => (
                    <tr key={item.shop}>
                      <td>{item.shop}</td>
                      <td>{item.owner}</td>
                      <td>{item.issue}</td>
                      <td><span className="admin-badge">{item.priority}</span></td>
                      <td>{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <p className="admin-panel-kicker">System health</p>
                <h2>Tín hiệu runtime</h2>
              </div>
            </div>

            <div className="admin-signal-list">
              {systemSignals.map((signal) => (
                <article key={signal.name} className="admin-signal-item">
                  <div>
                    <strong>{signal.name}</strong>
                    <span>{signal.detail}</span>
                  </div>
                  <em>{signal.state}</em>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <p className="admin-panel-kicker">Traffic mix</p>
                <h2>Lưu lượng theo khu vực</h2>
              </div>
            </div>

            <div className="admin-region-list">
              {regionalTraffic.map((item) => (
                <article key={item.region} className="admin-region-item">
                  <div>
                    <strong>{item.region}</strong>
                    <span>Tỉ trọng {item.share}</span>
                  </div>
                  <em>{item.trend}</em>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div>
                <p className="admin-panel-kicker">Ops note</p>
                <h2>Checklist frontend mock</h2>
              </div>
            </div>

            <ul className="admin-checklist">
              <li>Customer tiếp tục chạy độc lập ở cổng 5173.</li>
              <li>Seller center tách riêng ở cổng 5174.</li>
              <li>Admin console này chạy ở cổng 5175 với dữ liệu giả lập.</li>
              <li>Không cần backend để demo luồng giao diện quản trị.</li>
            </ul>
          </section>
        </section>
      </main>
    </div>
  )
}

export default App
