import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SellerAuthLayout from '../../layout/SellerAuthLayout'
import { useAuth } from '../../contexts/AuthContext'
import { useSeller } from '../../contexts/SellerContext'

function SellerLogin() {
  const navigate = useNavigate()
  const { login, isAuthenticated, user } = useAuth()
  const { loginSeller, hasSellerAccount, isSellerReady } = useSeller()
  const [form, setForm] = useState({ email: 'demo@gmail.com', password: '123456' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const targetUser = !isAuthenticated || user?.email !== form.email ? login(form.email, form.password) : user
      const sellerAccount = loginSeller(form.email, form.password, targetUser)
      setMessage(`Đăng nhập thành công: ${sellerAccount.shopName}`)
      if (sellerAccount.onboardingCompleted && sellerAccount.status !== 'approved') navigate('/seller/onboarding/waiting')
      else navigate(sellerAccount.onboardingCompleted ? '/seller/dashboard' : '/seller/onboarding/welcome')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <SellerAuthLayout>
      <div className="seller-auth-panel">
        <div className="seller-auth-hero">
          <h2>Bán hàng chuyên nghiệp</h2>
          <p>Quản lý shop của bạn một cách hiệu quả hơn trên Shopee với Shopee - Kênh Người bán.</p>
          <div className="seller-auth-illustration" />
        </div>

        <div className="seller-auth-card">
          <div className="seller-auth-card-header">
            <h1>Đăng nhập</h1>
            <div className="seller-qr-badge">Đăng nhập với mã QR</div>
          </div>

          <form className="seller-auth-form" onSubmit={handleSubmit}>
            <input className="seller-input" placeholder="Email/Số điện thoại/Tên đăng nhập" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
            <input className="seller-input" type="password" placeholder="Mật khẩu" value={form.password} onChange={(e) => handleChange('password', e.target.value)} />
            <button className="seller-auth-submit" type="submit">ĐĂNG NHẬP</button>
            <Link className="seller-mini-link" to="/seller/register">Chưa có tài khoản người bán? Đăng ký</Link>
            <div className="seller-auth-socials">
              <button type="button" className="seller-auth-social">Facebook</button>
              <button type="button" className="seller-auth-social">Google</button>
            </div>
            <div className="seller-auth-footer">Demo: buyer + seller dùng tài khoản <strong>demo@gmail.com / 123456</strong>. Seller mới hoàn tất onboarding sẽ chờ Admin duyệt trước khi vào dashboard.</div>
            {message ? <div className="status-message text-success">{message}</div> : null}
            {error ? <div className="status-message text-danger">{error}</div> : null}
            {!hasSellerAccount ? <div className="status-message">Tài khoản mua hiện tại chưa là người bán.</div> : null}
            {isSellerReady ? <div className="status-message">Tài khoản này đã hoàn tất onboarding.</div> : null}
          </form>
        </div>
      </div>
    </SellerAuthLayout>
  )
}

export default SellerLogin
