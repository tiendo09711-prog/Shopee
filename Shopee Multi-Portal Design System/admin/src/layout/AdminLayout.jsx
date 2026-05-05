import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../contexts/AdminAuthContext'

const navItems = [
  { path: '/dashboard', label: 'Tổng quan' },
  { path: '/categories', label: 'Danh mục' },
  { path: '/products', label: 'Sản phẩm' },
  { path: '/products/pending', label: 'Duyệt sản phẩm' },
  { path: '/orders', label: 'Đơn hàng' },
  { path: '/customers', label: 'Customer' },
  { path: '/sellers', label: 'Seller / shop' },
  { path: '/reports', label: 'Reports' },
  { path: '/settings', label: 'Cài đặt' },
]

function AdminLayout() {
  const navigate = useNavigate()
  const { user, logout } = useAdminAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-mark">P</div>
          <div>
            <strong>PShop Admin</strong>
            <span>{user?.email}</span>
          </div>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => (isActive ? 'active' : '')}>{item.label}</NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-card">
          <p>Phiên admin</p>
          <strong>{user?.name}</strong>
          <button type="button" className="admin-table-btn" onClick={handleLogout}>Đăng xuất</button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
