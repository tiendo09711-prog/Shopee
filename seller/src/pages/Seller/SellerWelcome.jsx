import { useNavigate } from 'react-router-dom'
import SellerOnboardingLayout from '../../layout/SellerOnboardingLayout'

function SellerWelcome() {
  const navigate = useNavigate()

  return (
    <SellerOnboardingLayout step={0}>
      <div style={{ minHeight: '58vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div>
          <div style={{ width: 240, height: 240, margin: '0 auto 26px', borderRadius: '50%', background: 'linear-gradient(180deg,#fff1ec,#ffe0d7)', display: 'grid', placeItems: 'center', color: '#ee4d2d', fontSize: 56 }}>🧾</div>
          <h1 style={{ fontWeight: 500, marginBottom: 12 }}>Chào mừng đến với Shopee!</h1>
          <p style={{ color: '#666', fontSize: 18, lineHeight: 1.5, marginBottom: 28 }}>Vui lòng cung cấp thông tin để thành lập tài khoản người bán trên Shopee</p>
          <button type="button" className="seller-primary-btn" style={{ width: 160 }} onClick={() => navigate('/seller/onboarding/shop-info')}>Bắt đầu đăng ký</button>
        </div>
      </div>
    </SellerOnboardingLayout>
  )
}

export default SellerWelcome
