import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SellerOnboardingLayout from '../../layout/SellerOnboardingLayout'
import { useSeller } from '../../contexts/SellerContext'

function SellerOnboardingIdentity() {
  const navigate = useNavigate()
  const { seller, updateIdentityInfo } = useSeller()
  const [form, setForm] = useState(seller?.identityInfo)

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <SellerOnboardingLayout step={2}>
      <div className="seller-simple-form">
        <input className="seller-input" value={form.businessType} onChange={(e) => handleChange('businessType', e.target.value)} placeholder="Loại hình kinh doanh" />
        <input className="seller-input" value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} placeholder="Họ và tên" />
        <input className="seller-input" value={form.idNumber} onChange={(e) => handleChange('idNumber', e.target.value)} placeholder="Số CCCD/CMND" />
        <input className="seller-input" type="date" value={form.issueDate} onChange={(e) => handleChange('issueDate', e.target.value)} />
        <input className="seller-input" value={form.issuePlace} onChange={(e) => handleChange('issuePlace', e.target.value)} placeholder="Nơi cấp" />
      </div>
      <div className="seller-form-actions" style={{ justifyContent: 'space-between' }}>
        <button type="button" className="seller-outline-btn" onClick={() => navigate('/seller/onboarding/shipping')}>Quay lại</button>
        <button type="button" className="seller-primary-btn" onClick={() => { updateIdentityInfo(form); navigate('/seller/onboarding/tax') }}>Tiếp theo</button>
      </div>
    </SellerOnboardingLayout>
  )
}

export default SellerOnboardingIdentity
