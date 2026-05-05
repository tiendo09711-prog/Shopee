import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import '../Login/AuthPage.css'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  })
  const [message, setMessage] = useState('')

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await register(form)
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
          <p>Thông tin tài khoản dùng contract chung để Customer, Seller và Admin có thể đọc cùng một shape dữ liệu.</p>
        </div>
        <form className="auth-form card" onSubmit={handleSubmit}>
          <h2>Đăng ký</h2>
          <input type="text" placeholder="Họ tên" value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
          <input type="tel" placeholder="Số điện thoại" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
          <input type="password" placeholder="Mật khẩu" value={form.password} onChange={(e) => handleChange('password', e.target.value)} />
          <input type="password" placeholder="Nhập lại mật khẩu" value={form.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} />
          <select className="auth-select" value={form.role} onChange={(e) => handleChange('role', e.target.value)}>
            <option value="customer">Khách hàng</option>
            <option value="seller">Người bán</option>
          </select>
          <button type="submit">ĐĂNG KÝ</button>
          {message ? <div className="status-message text-danger">{message}</div> : null}
          <div className="auth-footer">Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link></div>
        </form>
      </div>
    </div>
  )
}

export default Register
