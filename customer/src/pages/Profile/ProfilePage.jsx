import { Navigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import MainLayout from '../../layout/MainLayout'
import UserSidebar from '../../components/UserSidebar/UserSidebar'
import { useAuth } from '../../contexts/AuthContext'
import './ProfilePage.css'

function ProfilePage() {
  const { user, isAuthenticated, updateProfile } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birthDay: user?.birthDay || '1',
    birthMonth: user?.birthMonth || '1',
    birthYear: user?.birthYear || '1990',
    avatar: user?.avatar || '',
    avatarThumb: user?.avatarThumb || ''
  })

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: '/user/account' }} />

  const avatarPreview = useMemo(() => form.avatarThumb || form.avatar || '', [form])
  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      handleChange('avatar', reader.result)
      handleChange('avatarThumb', reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      await updateProfile(form)
      alert('Lưu hồ sơ thành công')
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <MainLayout>
      <div className="container page-spacing user-page-layout">
        <UserSidebar />
        <form className="user-page-main profile-card card" onSubmit={handleSubmit}>
          <h1>Hồ Sơ Của Tôi</h1>
          <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
          <div className="profile-grid">
            <div className="profile-form-fields">
              <div className="profile-row"><label>Email</label><span>{user.email}</span></div>
              <div className="profile-row"><label>Họ Tên</label><input value={form.name} onChange={(e) => handleChange('name', e.target.value)} /></div>
              <div className="profile-row"><label>Số điện thoại</label><input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} /></div>
              <div className="profile-row"><label>Địa chỉ</label><input value={form.address} onChange={(e) => handleChange('address', e.target.value)} /></div>
              <div className="profile-row"><label>Ngày sinh</label>
                <div className="birthday-row">
                  <select value={form.birthDay} onChange={(e) => handleChange('birthDay', e.target.value)}>{Array.from({ length: 31 }, (_, i) => <option key={i + 1}>{i + 1}</option>)}</select>
                  <select value={form.birthMonth} onChange={(e) => handleChange('birthMonth', e.target.value)}>{Array.from({ length: 12 }, (_, i) => <option key={i + 1}>{i + 1}</option>)}</select>
                  <select value={form.birthYear} onChange={(e) => handleChange('birthYear', e.target.value)}>{Array.from({ length: 60 }, (_, i) => <option key={1990 - i}>{1990 - i}</option>)}</select>
                </div>
              </div>
            </div>
            <div className="profile-avatar-box">
              <div className="profile-avatar-preview">{avatarPreview ? <img src={avatarPreview} alt={form.name} /> : '👤'}</div>
              <label className="upload-btn">Chọn Ảnh<input type="file" accept="image/*" onChange={handleFileChange} hidden /></label>
              <small>Dung lượng file tối đa 1 MB. Phải là định dạng ảnh.</small>
            </div>
          </div>
          <button type="submit" className="profile-save-btn">Lưu lại</button>
        </form>
      </div>
    </MainLayout>
  )
}

export default ProfilePage
