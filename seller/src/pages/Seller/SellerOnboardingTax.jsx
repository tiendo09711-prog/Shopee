import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SellerOnboardingLayout from '../../layout/SellerOnboardingLayout'
import { useSeller } from '../../contexts/SellerContext'

function SellerOnboardingTax() {
  const navigate = useNavigate()
  const { seller, updateTaxInfo, completeOnboarding } = useSeller()
  const [form, setForm] = useState(seller?.taxInfo)

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <SellerOnboardingLayout step={3}>
      <div className="seller-simple-form">
        <input className="seller-input" value={form.taxCode} onChange={(e) => handleChange('taxCode', e.target.value)} placeholder="Mã số thuế" />
        <input className="seller-input" value={form.companyName} onChange={(e) => handleChange('companyName', e.target.value)} placeholder="Tên doanh nghiệp / hộ kinh doanh" />
        <input className="seller-input" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="Email thuế" />
        <textarea className="seller-textarea" value={form.address} onChange={(e) => handleChange('address', e.target.value)} placeholder="Địa chỉ thuế" />
      </div>
      <div className="seller-form-actions" style={{ justifyContent: 'space-between' }}>
        <button type="button" className="seller-outline-btn" onClick={() => navigate('/seller/onboarding/identity')}>Quay lại</button>
        <button type="button" className="seller-primary-btn" onClick={() => { updateTaxInfo(form); completeOnboarding(); navigate('/seller/onboarding/done') }}>Tiếp theo</button>
      </div>
    </SellerOnboardingLayout>
  )
}

export default SellerOnboardingTax
