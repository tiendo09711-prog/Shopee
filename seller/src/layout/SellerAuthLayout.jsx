import SellerBrand from '../components/Seller/SellerBrand'
import '../components/Seller/SellerShared.css'

function SellerAuthLayout({ children }) {
  return (
    <div className="seller-auth-shell">
      <header className="seller-auth-header">
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <SellerBrand to="/seller/login" />
          <a href="#" className="seller-help-link" style={{ marginLeft: 'auto' }}>Bạn cần giúp đỡ?</a>
        </div>
      </header>
      <div className="seller-auth-body">
        <div className="container">{children}</div>
      </div>
    </div>
  )
}

export default SellerAuthLayout
