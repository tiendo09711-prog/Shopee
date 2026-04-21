import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SellerAuthLayout from '../../layout/SellerAuthLayout'
import { useAuth } from '../../contexts/AuthContext'
import { useSeller } from '../../contexts/SellerContext'

function SellerRegister() {
  const navigate = useNavigate()
  const auth = useAuth()
  const { registerSeller } = useSeller()
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    try {
      auth.register(form)
      const loggedInUser = auth.login(form.email, form.password)
      registerSeller({ email: form.email }, loggedInUser)
      navigate('/seller/onboarding/welcome')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <SellerAuthLayout>
      <div className="seller-auth-panel">
        <div className="seller-auth-hero">
          <h2>Đăng ký trở thành người bán Shopee</h2>
          <p>Tạo shop, cấu hình vận chuyển, hoàn thiện hồ sơ và bắt đầu bán trên giao diện seller center giống Shopee.</p>
          <div className="seller-auth-illustration" />
        </div>

        <div className="seller-auth-card">
          <div className="seller-auth-card-header">
            <h1>Đăng ký</h1>
          </div>

          <form className="seller-auth-form" onSubmit={handleSubmit}>
            <input className="seller-input" placeholder="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
            <input className="seller-input" type="password" placeholder="Mật khẩu" value={form.password} onChange={(e) => handleChange('password', e.target.value)} />
            <input className="seller-input" type="password" placeholder="Nhập lại mật khẩu" value={form.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} />
            <button className="seller-auth-submit" type="submit">TẠO TÀI KHOẢN NGƯỜI BÁN</button>
            <Link className="seller-mini-link" to="/seller/login">Đã có tài khoản? Quay lại đăng nhập</Link>
            {error ? <div className="status-message text-danger">{error}</div> : null}
          </form>
        </div>
      </div>
    </SellerAuthLayout>
  )
}

export default SellerRegister
