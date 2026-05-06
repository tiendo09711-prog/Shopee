import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SellerAuthLayout from '../../layout/SellerAuthLayout'
import { useAuth } from '../../contexts/AuthContext'
import { useSeller } from '../../contexts/SellerContext'
import { apiRequest } from '../../services/apiClient'
import { categories as fallbackCategories } from '../../data/categories.mock'

function calculateAge(birthDate) {
  const dob = new Date(birthDate)
  if (Number.isNaN(dob.getTime())) return 0

  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1
  }

  return age
}

function SellerRegister() {
  const navigate = useNavigate()
  const auth = useAuth()
  const { registerSeller } = useSeller()
  const [step, setStep] = useState('account')
  const [categories, setCategories] = useState(fallbackCategories)
  const [registeredUser, setRegisteredUser] = useState(null)
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
    sellerFullName: '',
    birthDate: '',
    saleCategory: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    apiRequest('/categories')
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.items || []
        if (mounted && list.length) setCategories(list)
      })
      .catch(() => {
        if (mounted) setCategories(fallbackCategories)
      })
    return () => {
      mounted = false
    }
  }, [])

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleAccountSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (!form.shopName.trim()) throw new Error('Vui lòng nhập tên shop')
      if (!form.email.trim()) throw new Error('Vui lòng nhập email')
      if (!form.phone.trim()) throw new Error('Vui lòng nhập số điện thoại')
      if (form.password.length < 8) throw new Error('Mật khẩu phải có ít nhất 8 ký tự')
      if (form.password !== form.confirmPassword) throw new Error('Mật khẩu nhập lại không khớp')
      if (!form.legalAgreementAccepted) throw new Error('Bạn cần đồng ý điều khoản kinh doanh/pháp lý')

      setLoading(true)
      await auth.register({
        name: form.shopName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      })
      const loggedInUser = await auth.login(form.email.trim(), form.password)
      setRegisteredUser(loggedInUser)
      setStep('seller-info')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSellerInfoSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (!form.sellerFullName.trim()) throw new Error('Vui lòng nhập họ tên người bán')
      if (!form.birthDate) throw new Error('Vui lòng chọn ngày tháng năm sinh')
      if (calculateAge(form.birthDate) < 18) throw new Error('Người bán phải đủ 18 tuổi trở lên')
      if (!form.saleCategory) throw new Error('Vui lòng chọn loại mặt hàng sẽ bán')

      const selectedCategory = categories.find((category) => String(category._id || category.id || category.slug || category.name) === form.saleCategory)

      setLoading(true)
      await registerSeller({
        shopName: form.shopName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        pickupAddress: form.pickupAddress ? { detail: form.pickupAddress, fullName: form.sellerFullName.trim(), phone: form.phone.trim() } : null,
        identityInfo: { summary: form.identityInfo, fullName: form.sellerFullName.trim() },
        taxInfo: { summary: form.taxInfo },
        legalAccepted: true,
        sellerFullName: form.sellerFullName.trim(),
        birthDate: form.birthDate,
        saleCategory: selectedCategory ? {
          id: selectedCategory._id || selectedCategory.id || selectedCategory.slug,
          name: selectedCategory.name,
          slug: selectedCategory.slug,
        } : null,
      }, registeredUser)

      navigate('/seller/dashboard', { replace: true })
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
          <h2>Đăng ký trở thành người bán Shopee</h2>
          <p>Tạo tài khoản người bán demo nhanh, không cần đi qua quy trình xác thực 5 bước.</p>
          <div className="seller-auth-illustration" />
        </div>

        <div className="seller-auth-card">
          <div className="seller-auth-card-header">
            <h1>{step === 'account' ? 'Đăng ký' : 'Thông tin người bán'}</h1>
          </div>

          {step === 'account' ? (
            <form className="seller-auth-form" onSubmit={handleAccountSubmit}>
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
              <button className="seller-auth-submit" type="submit" disabled={loading}>{loading ? 'ĐANG XỬ LÝ...' : 'TẠO TÀI KHOẢN NGƯỜI BÁN'}</button>
              <Link className="seller-mini-link" to="/seller/login">Đã có tài khoản? Quay lại đăng nhập</Link>
              {error ? <div className="status-message text-danger">{error}</div> : null}
            </form>
          ) : (
            <form className="seller-auth-form" onSubmit={handleSellerInfoSubmit}>
              <input className="seller-input" placeholder="Họ tên người bán" value={form.sellerFullName} onChange={(e) => handleChange('sellerFullName', e.target.value)} />
              <input className="seller-input" type="date" value={form.birthDate} onChange={(e) => handleChange('birthDate', e.target.value)} />
              <select className="seller-input" value={form.saleCategory} onChange={(e) => handleChange('saleCategory', e.target.value)}>
                <option value="">Loại mặt hàng sẽ bán</option>
                {categories.map((category) => {
                  const value = category._id || category.id || category.slug || category.name
                  return <option key={value} value={value}>{category.name}</option>
                })}
              </select>
              <button className="seller-auth-submit" type="submit" disabled={loading}>{loading ? 'ĐANG HOÀN TẤT...' : 'HOÀN TẤT ĐĂNG KÝ'}</button>
              <button className="seller-mini-link" type="button" onClick={() => setStep('account')}>Quay lại form đăng ký</button>
              {error ? <div className="status-message text-danger">{error}</div> : null}
            </form>
          )}
        </div>
      </div>
    </SellerAuthLayout>
  )
}

export default SellerRegister
