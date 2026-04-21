import { useNavigate } from 'react-router-dom'
import SellerOnboardingLayout from '../../layout/SellerOnboardingLayout'

function SellerOnboardingDone() {
  const navigate = useNavigate()

  return (
    <SellerOnboardingLayout step={4}>
      <div style={{ minHeight: '58vh', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
        <div>
          <div style={{ width: 120, height: 120, margin: '0 auto 22px', borderRadius: '50%', background: '#ecfff2', display: 'grid', placeItems: 'center', fontSize: 52 }}>✓</div>
          <h1 style={{ marginBottom: 12, fontWeight: 500 }}>Hoàn tất đăng ký người bán</h1>
          <p className="seller-muted" style={{ marginBottom: 28 }}>Bạn có thể bỏ qua kiểm duyệt chi tiết ở bản frontend mock và vào thẳng dashboard.</p>
          <button type="button" className="seller-primary-btn" style={{ width: 180 }} onClick={() => navigate('/seller/dashboard')}>Vào Kênh Người Bán</button>
        </div>
      </div>
    </SellerOnboardingLayout>
  )
}

export default SellerOnboardingDone
