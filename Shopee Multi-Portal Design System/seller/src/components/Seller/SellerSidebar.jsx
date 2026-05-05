import { NavLink } from 'react-router-dom'
import { sellerSidebarSections } from '../../data/seller.mock'
import './SellerShared.css'

function SellerSidebar() {
  return (
    <aside className="seller-sidebar">
      {sellerSidebarSections.map((section) => (
        <div key={section.title} className="seller-sidebar-section">
          <div className="seller-sidebar-title">{section.title}</div>
          {section.items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/seller/dashboard' || item.path === '/seller/products' || item.path === '/seller/orders' || item.path === '/seller/shipping' || item.path === '/seller/finance' || item.path === '/seller/data' || item.path === '/seller/support'}
              className={({ isActive }) => `seller-sidebar-link${isActive ? ' active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      ))}
    </aside>
  )
}

export default SellerSidebar
