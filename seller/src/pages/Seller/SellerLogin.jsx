import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SellerAuthLayout from '../../layout/SellerAuthLayout'
import { useAuth } from '../../contexts/AuthContext'
import { apiRequest } from '../../services/apiClient'

function SellerLogin() {
  const navigate = useNavigate()
  const { login, isAuthenticated, user } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const loggedInUser = isAuthenticated && user?.email === form.email ? user : await login(form.email, form.password)

      if (loggedInUser.role !== 'seller') {
        throw new Error('Tài khoản này không phải tài khoản người bán. Vui lòng đăng ký tài khoản người bán.')
      }

      // Check if seller has a registered shop
      let sellerData = null
      try {
        sellerData = await apiRequest('/sellers/me')
      } catch {
        // No shop yet — go to onboarding
      }

      if (!sellerData) {
        navigate('/seller/register')
      } else {
        setMessage(`Đăng nhập thành công: ${sellerData.shopName}`)
        setTimeout(() => navigate('/seller/dashboard'), 500)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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
          </div>

          <form className="seller-auth-form" onSubmit={handleSubmit}>
            <input className="seller-input" placeholder="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
            <input className="seller-input" type="password" placeholder="Mật khẩu" value={form.password} onChange={(e) => handleChange('password', e.target.value)} />
            <button className="seller-auth-submit" type="submit" disabled={loading}>
              {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
            </button>
            <Link className="seller-mini-link" to="/seller/register">Chưa có tài khoản người bán? Đăng ký</Link>
            {message ? <div className="status-message text-success">{message}</div> : null}
            {error ? <div className="status-message text-danger">{error}</div> : null}
          </form>
        </div>
      </div>
    </SellerAuthLayout>
  )
}

export default SellerLogin
