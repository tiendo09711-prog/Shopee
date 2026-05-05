import { useState } from 'react'
import { defaultPickupAddress } from '../../data/seller.mock'
import './SellerShared.css'

function PickupAddressModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState(defaultPickupAddress)

  if (!isOpen) return null

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="seller-modal-backdrop">
      <div className="seller-modal">
        <div className="seller-modal-header">
          <h2 style={{ margin: 0, fontWeight: 500 }}>Thêm Địa Chỉ Mới</h2>
          <button className="icon-button" type="button" onClick={onClose}>✕</button>
        </div>

        <div className="seller-modal-grid">
          <div>
            <label>Họ &amp; Tên</label>
            <input className="seller-input" value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} />
          </div>
          <div>
            <label>Số điện thoại</label>
            <input className="seller-input" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Tỉnh/Thành phố/Quận/Huyện/Phường/Xã</label>
            <input className="seller-input" value={form.region} onChange={(e) => handleChange('region', e.target.value)} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Địa chỉ chi tiết</label>
            <textarea className="seller-textarea" value={form.detail} onChange={(e) => handleChange('detail', e.target.value)} />
          </div>
        </div>

        <div className="seller-modal-actions">
          <button type="button" className="seller-outline-btn" onClick={onClose}>Hủy</button>
          <button type="button" className="seller-primary-btn" onClick={() => onSave(form)}>Lưu</button>
        </div>
      </div>
    </div>
  )
}

export default PickupAddressModal
