import SellerBrand from '../components/Seller/SellerBrand'
import SellerOnboardingStepper from '../components/Seller/SellerOnboardingStepper'
import { useAuth } from '../contexts/AuthContext'
import '../components/Seller/SellerShared.css'

function SellerOnboardingLayout({ step, children }) {
  const { user } = useAuth()

  return (
    <div className="seller-onboarding-shell">
      <header className="seller-onboarding-header">
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <SellerBrand subtitle="Đăng ký trở thành Người bán Shopee" />
          <div className="seller-header-right">
            <div className="seller-header-avatar">{(user?.name || 'S').slice(0, 1).toUpperCase()}</div>
            <span>{user?.name || user?.email}</span>
          </div>
        </div>
      </header>
      <div className="seller-onboarding-body">
        <SellerOnboardingStepper currentStep={step} />
        <div className="seller-onboarding-content">{children}</div>
      </div>
    </div>
  )
}

export default SellerOnboardingLayout
