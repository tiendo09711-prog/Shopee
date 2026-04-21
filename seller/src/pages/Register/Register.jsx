import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import '../Login/AuthPage.css'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [message, setMessage] = useState('')

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (event) => {
    event.preventDefault()
    try {
      register(form)
      navigate('/login')
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-header"><Link to="/" className="auth-header-logo">Shopee</Link><span>Đăng ký</span></div>
      <div className="auth-content container">
        <div className="auth-highlight">
          <h1>Tạo tài khoản mới</h1>
          <p>Form đăng ký đang tách riêng service xử lý nên sau này chỉ cần nối backend là dùng lại được ngay.</p>
        </div>
        <form className="auth-form card" onSubmit={handleSubmit}>
          <h2>Đăng ký</h2>
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
          <input type="password" placeholder="Mật khẩu" value={form.password} onChange={(e) => handleChange('password', e.target.value)} />
          <input type="password" placeholder="Nhập lại mật khẩu" value={form.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} />
          <button type="submit">ĐĂNG KÝ</button>
          {message ? <div className="status-message text-danger">{message}</div> : null}
          <div className="auth-footer">Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link></div>
        </form>
      </div>
    </div>
  )
}

export default Register
