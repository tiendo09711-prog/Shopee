import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SellerAuthLayout from '../../layout/SellerAuthLayout'
import { useAuth } from '../../contexts/AuthContext'
import { useSeller } from '../../contexts/SellerContext'

function SellerRegister() {
  const navigate = useNavigate()
  const auth = useAuth()
  const { registerSeller } = useSeller()
  const [form, setForm] = useState({
    shopName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    pickupAddress: '',
    identityInfo: '',
    taxInfo: '',
    legalAgreementAccepted: false,
  })
  const [error, setError] = useState('')

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    try {
      if (!form.shopName.trim()) throw new Error('Vui lòng nhập tên shop')
      if (!form.phone.trim()) throw new Error('Vui lòng nhập số điện thoại')
      if (!form.legalAgreementAccepted) throw new Error('Bạn cần đồng ý điều khoản kinh doanh/pháp lý')
      auth.register(form)
      const loggedInUser = auth.login(form.email, form.password)
      registerSeller({
        shopName: form.shopName,
        email: form.email,
        phone: form.phone,
        pickupAddress: form.pickupAddress ? { detail: form.pickupAddress, fullName: form.shopName, phone: form.phone } : null,
        identityInfo: { summary: form.identityInfo },
        taxInfo: { summary: form.taxInfo },
        legalAgreementAccepted: form.legalAgreementAccepted,
      }, loggedInUser)
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
            <input className="seller-input" placeholder="Tên shop" value={form.shopName} onChange={(e) => handleChange('shopName', e.target.value)} />
            <input className="seller-input" placeholder="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
            <input className="seller-input" placeholder="Số điện thoại" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
            <input className="seller-input" placeholder="Địa chỉ lấy hàng tạm thời" value={form.pickupAddress} onChange={(e) => handleChange('pickupAddress', e.target.value)} />
            <input className="seller-input" placeholder="Thông tin định danh/CCCD mock" value={form.identityInfo} onChange={(e) => handleChange('identityInfo', e.target.value)} />
            <input className="seller-input" placeholder="Thông tin thuế mock" value={form.taxInfo} onChange={(e) => handleChange('taxInfo', e.target.value)} />
            <input className="seller-input" type="password" placeholder="Mật khẩu" value={form.password} onChange={(e) => handleChange('password', e.target.value)} />
            <input className="seller-input" type="password" placeholder="Nhập lại mật khẩu" value={form.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} />
            <label className="seller-check-row">
              <input type="checkbox" checked={form.legalAgreementAccepted} onChange={(e) => handleChange('legalAgreementAccepted', e.target.checked)} />
              <span>Tôi đồng ý điều khoản kinh doanh và pháp lý của PShop</span>
            </label>
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
