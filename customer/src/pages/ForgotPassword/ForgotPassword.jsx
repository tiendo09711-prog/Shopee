import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import '../Login/AuthPage.css'

function ForgotPassword() {
  const navigate = useNavigate()
  const { requestPasswordReset, resetPassword } = useAuth()
  const [step, setStep] = useState('request')
  const [form, setForm] = useState({
    email: '',
    token: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState('')
  const [resetToken, setResetToken] = useState('')

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleRequestReset = async (event) => {
    event.preventDefault()
    try {
      const result = await requestPasswordReset(form.email)
      setResetToken(result.resetToken)
      setForm((prev) => ({ ...prev, email: result.email, token: result.resetToken }))
      setStep('reset')
      setMessage(`OTP da duoc tao. Ma co hieu luc ${result.expiresInMinutes} phut.`)
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()
    try {
      await resetPassword(form.email, form.token, form.newPassword, form.confirmPassword)
      setMessage('Dat lai mat khau thanh cong. Vui long dang nhap lai.')
      setTimeout(() => navigate('/login'), 700)
    } catch (error) {
      setMessage(error.message)
    }
  }

  const isSuccess = message.toLowerCase().includes('thanh cong') || message.toLowerCase().includes('otp')

  return (
    <div className="auth-page">
      <div className="auth-header"><Link to="/" className="auth-header-logo">Shopee</Link><span>Quên mật khẩu</span></div>
      <div className="auth-content container">
        <div className="auth-highlight">
          <h1>Khôi phục quyền truy cập</h1>
          <p>Flow này gọi API PShop để tạo OTP/token, có giới hạn tối đa 3 lần reset trong 1 giờ cho mỗi email.</p>
        </div>

        {step === 'request' ? (
          <form className="auth-form card" onSubmit={handleRequestReset}>
            <h2>Quên mật khẩu</h2>
            <input type="email" placeholder="Email đã đăng ký" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
            <button type="submit">GỬI OTP</button>
            {message ? <div className="status-message text-danger">{message}</div> : null}
            <div className="auth-footer">Đã nhớ mật khẩu? <Link to="/login">Đăng nhập</Link></div>
          </form>
        ) : (
          <form className="auth-form card" onSubmit={handleResetPassword}>
            <h2>Đặt lại mật khẩu</h2>
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
            <input type="text" placeholder="OTP/token" value={form.token} onChange={(e) => handleChange('token', e.target.value)} />
            {resetToken ? <div className="auth-token-hint">OTP: <strong>{resetToken}</strong></div> : null}
            <input type="password" placeholder="Mật khẩu mới" value={form.newPassword} onChange={(e) => handleChange('newPassword', e.target.value)} />
            <input type="password" placeholder="Nhập lại mật khẩu mới" value={form.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} />
            <button type="submit">ĐẶT LẠI MẬT KHẨU</button>
            {message ? <div className={`status-message ${isSuccess ? 'text-success' : 'text-danger'}`}>{message}</div> : null}
            <div className="auth-footer"><button type="button" className="auth-text-button" onClick={() => setStep('request')}>Gửi lại OTP</button></div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
