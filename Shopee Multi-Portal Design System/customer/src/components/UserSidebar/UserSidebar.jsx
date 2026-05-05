import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './UserSidebar.css'

function UserSidebar() {
  const { user } = useAuth()
  const location = useLocation()

  return (
    <aside className="user-sidebar">
      <div className="user-sidebar-top card">
        {user?.avatarThumb ? <img src={user.avatarThumb} alt={user.name} className="user-sidebar-avatar" /> : <div className="user-sidebar-avatar placeholder">👤</div>}
        <div className="user-sidebar-name">{user?.name}</div>
      </div>
      <nav className="user-sidebar-menu card">
        <Link to="/user/account" className={location.pathname === '/user/account' ? 'active' : ''}>Hồ Sơ Của Tôi</Link>
        <Link to="/user/password" className={location.pathname === '/user/password' ? 'active' : ''}>Đổi Mật Khẩu</Link>
        <Link to="/user/purchase" className={location.pathname === '/user/purchase' ? 'active' : ''}>Đơn Mua</Link>
      </nav>
    </aside>
  )
}

export default UserSidebar