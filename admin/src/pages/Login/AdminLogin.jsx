import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login, loading } = useAdminAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return null
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setSubmitting(true)
    try {
      await login(form.email, form.password)
      navigate(location.state?.from || '/dashboard')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-brand" style={{ marginBottom: 12 }}>
          <div className="admin-brand-mark">P</div>
          <div><strong>PShop Admin</strong><span>Đăng nhập quản trị</span></div>
        </div>
        <input className="admin-search-input" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email admin" />
        <input className="admin-search-input" type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} placeholder="Mật khẩu" />
        <button type="submit" className="admin-primary-btn" disabled={submitting}>{submitting ? 'Đang xử lý...' : 'Đăng nhập'}</button>
        {message ? <div className="admin-error">{message}</div> : null}
      </form>
    </div>
  )
}

export default AdminLogin
