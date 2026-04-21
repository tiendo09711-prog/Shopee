import SellerSidebar from '../components/Seller/SellerSidebar'
import SellerTopBar from '../components/Seller/SellerTopBar'
import '../components/Seller/SellerShared.css'

function SellerDashboardLayout({ children, rightbar }) {
  return (
    <div className="seller-dashboard-shell">
      <SellerTopBar />
      <div className="seller-dashboard-main">
        <SellerSidebar />
        <div>{children}</div>
        <aside className="seller-rightbar">{rightbar}</aside>
      </div>
    </div>
  )
}

export default SellerDashboardLayout
