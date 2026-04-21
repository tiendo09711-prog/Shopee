import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import SellerBrand from './SellerBrand'
import './SellerShared.css'

function SellerTopBar() {
  const { user } = useAuth()
  const avatar = useMemo(() => (user?.name || 'S').slice(0, 1).toUpperCase(), [user])

  return (
    <header className="seller-dashboard-header">
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <SellerBrand />
        <div className="seller-header-right">
          <Link to="/seller/notifications" className="seller-mini-link">🔔</Link>
          <Link to="/seller/support" className="seller-mini-link">🎧</Link>
          <div className="seller-header-avatar">{avatar}</div>
          <span>{user?.name || user?.email || 'seller'}</span>
        </div>
      </div>
    </header>
  )
}

export default SellerTopBar
