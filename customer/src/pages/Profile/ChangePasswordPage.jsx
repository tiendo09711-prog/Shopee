import { Navigate, useState } from 'react'
import MainLayout from '../../layout/MainLayout'
import UserSidebar from '../../components/UserSidebar/UserSidebar'
import { useAuth } from '../../contexts/AuthContext'
import './ChangePasswordPage.css'

function ChangePasswordPage() {
  const { isAuthenticated, changePassword } = useAuth()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [message, setMessage] = useState('')

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: '/user/password' }} />

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await changePassword(form.currentPassword, form.newPassword, form.confirmPassword)
      setMessage('Đổi mật khẩu thành công')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <MainLayout>
      <div className="container page-spacing user-page-layout">
        <UserSidebar />
        <form className="user-page-main change-password-card card" onSubmit={handleSubmit}>
          <h1>Đổi Mật Khẩu</h1>
          <p>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
          <div className="change-password-fields">
            <div className="profile-row"><label>Mật khẩu</label><input type="password" value={form.currentPassword} onChange={(e) => setForm((prev) => ({ ...prev, currentPassword: e.target.value }))} placeholder="Đổi Mật Khẩu" /></div>
            <div className="profile-row"><label>Mật khẩu Mới</label><input type="password" value={form.newPassword} onChange={(e) => setForm((prev) => ({ ...prev, newPassword: e.target.value }))} placeholder="Mật khẩu Mới" /></div>
            <div className="profile-row"><label>Nhập lại</label><input type="password" value={form.confirmPassword} onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} placeholder="Nhập lại" /></div>
          </div>
          {message ? <div className={message.includes('thành công') ? 'status-message text-success' : 'status-message text-danger'}>{message}</div> : null}
          <button type="submit" className="profile-save-btn">Gửi</button>
        </form>
      </div>
    </MainLayout>
  )
}

export default ChangePasswordPage
