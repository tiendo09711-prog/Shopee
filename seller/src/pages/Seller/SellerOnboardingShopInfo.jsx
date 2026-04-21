import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PickupAddressModal from '../../components/Seller/PickupAddressModal'
import SellerOnboardingLayout from '../../layout/SellerOnboardingLayout'
import { useSeller } from '../../contexts/SellerContext'

function SellerOnboardingShopInfo() {
  const navigate = useNavigate()
  const { seller, updateShopInfo, savePickupAddress } = useSeller()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    shopName: seller?.shopInfo?.shopName || seller?.shopName || '',
    email: seller?.shopInfo?.email || seller?.email || '',
    phone: seller?.shopInfo?.phone || '',
  })

  const pickupAddress = seller?.pickupAddress

  const handleSave = () => updateShopInfo(form)
  const handleNext = () => {
    updateShopInfo(form)
    navigate('/seller/onboarding/shipping')
  }

  return (
    <SellerOnboardingLayout step={0}>
      <div className="seller-form-section">
        <div className="seller-form-row">
          <label className="seller-form-label"><span className="seller-required">*</span>Tên Shop</label>
          <div>
            <input className="seller-input" maxLength={30} value={form.shopName} onChange={(e) => setForm((prev) => ({ ...prev, shopName: e.target.value }))} />
          </div>
        </div>
        <div className="seller-form-row">
          <label className="seller-form-label"><span className="seller-required">*</span>Địa chỉ lấy hàng</label>
          <div>
            {!pickupAddress ? (
              <button type="button" className="seller-outline-btn" onClick={() => setShowModal(true)}>+ Thêm</button>
            ) : (
              <div className="seller-address-card">
                <div><strong>{pickupAddress.fullName}</strong> | {pickupAddress.phone}</div>
                <div>{pickupAddress.detail}</div>
                <div>{pickupAddress.ward}</div>
                <div>{pickupAddress.district}</div>
                <div>{pickupAddress.city}</div>
                <a href="#" onClick={(e) => { e.preventDefault(); setShowModal(true) }}>Chỉnh sửa</a>
              </div>
            )}
          </div>
        </div>
        <div className="seller-form-row">
          <label className="seller-form-label"><span className="seller-required">*</span>Email</label>
          <div>
            <input className="seller-input" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
          </div>
        </div>
        <div className="seller-form-row">
          <label className="seller-form-label"><span className="seller-required">*</span>Số điện thoại</label>
          <div>
            <input className="seller-input" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
          </div>
        </div>
      </div>
      <div className="seller-form-actions">
        <button type="button" className="seller-outline-btn" onClick={handleSave}>Lưu</button>
        <button type="button" className="seller-primary-btn" onClick={handleNext}>Tiếp theo</button>
      </div>
      <PickupAddressModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={(data) => {
          savePickupAddress(data)
          setShowModal(false)
        }}
      />
    </SellerOnboardingLayout>
  )
}

export default SellerOnboardingShopInfo
