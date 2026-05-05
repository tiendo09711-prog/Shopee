import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './AuthPage.css'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [message, setMessage] = useState('')

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await login(form.email, form.password, { remember: form.remember })
      navigate(location.state?.from || '/')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-header"><Link to="/" className="auth-header-logo">Shopee</Link><span>Đăng nhập</span></div>
      <div className="auth-content container">
        <div className="auth-highlight">
          <h1>Đăng nhập để tiếp tục mua sắm</h1>
          <p>Tài khoản được xác thực qua API PShop và dữ liệu MongoDB.</p>
        </div>
        <form className="auth-form card" onSubmit={handleSubmit}>
          <h2>Đăng nhập</h2>
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
          <input type="password" placeholder="Mật khẩu" value={form.password} onChange={(e) => handleChange('password', e.target.value)} />
          <div className="auth-options-row">
            <label className="auth-checkbox">
              <input type="checkbox" checked={form.remember} onChange={(e) => handleChange('remember', e.target.checked)} />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>
          <button type="submit">ĐĂNG NHẬP</button>
          {message ? <div className="status-message text-danger">{message}</div> : null}
          <div className="auth-helper">Demo: <strong>customer@pshop.vn</strong> / <strong>customer123456</strong></div>
          <div className="auth-footer">Bạn mới biết đến Shopee? <Link to="/register">Đăng ký</Link></div>
        </form>
      </div>
    </div>
  )
}

export default Login
