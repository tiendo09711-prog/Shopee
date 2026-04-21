import { Link } from 'react-router-dom'
import './SellerShared.css'

function SellerBrand({ subtitle = 'Kênh Người Bán', to = '/seller/dashboard' }) {
  return (
    <Link to={to} className="seller-brand">
      <span className="seller-brand-mark">S</span>
      <span>Shopee</span>
      <span className="seller-brand-subtitle">{subtitle}</span>
    </Link>
  )
}

export default SellerBrand
