import { NavLink, Outlet } from 'react-router-dom'
import { adminSections } from '../adminData'

function AdminLayout() {
    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <div className="admin-brand-mark">S</div>
                    <div>
                        <strong>Shopee Admin</strong>
                        <span>Hệ quản trị dành riêng cho admin</span>
                    </div>
                </div>

                <nav className="admin-nav">
                    {adminSections.map((item) => (
                        <NavLink
                            key={item.key}
                            to={item.path}
                            className={({ isActive }) => (isActive ? 'active' : '')}
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-card">
                    <p>Phiên trực hiện tại</p>
                    <strong>Ca vận hành buổi sáng</strong>
                    <span>08:00 - 17:00 ICT</span>
                </div>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout