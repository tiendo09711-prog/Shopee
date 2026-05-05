import { useState } from 'react'
import { requestRefund } from '../../services/refund.service'

const reasons = ['Sản phẩm lỗi/hư hỏng', 'Không đúng mô tả', 'Giao thiếu hàng', 'Hàng giả/nghi ngờ hàng giả', 'Lý do khác']

function parseImages(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

function RefundRequestModal({ order, customerId, onClose, onSuccess }) {
  const [form, setForm] = useState({ reason: reasons[0], description: '', images: '' })
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const refund = await requestRefund(order, customerId, { ...form, images: parseImages(form.images) })
      onSuccess(refund)
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="purchase-modal-backdrop">
      <form className="purchase-modal card" onSubmit={handleSubmit}>
        <h2>Yêu cầu hoàn tiền/trả hàng</h2>
        <select value={form.reason} onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))}>
          {reasons.map((reason) => <option key={reason} value={reason}>{reason}</option>)}
        </select>
        <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Mô tả vấn đề" />
        <input value={form.images} onChange={(e) => setForm((prev) => ({ ...prev, images: e.target.value }))} placeholder="Ảnh minh chứng, cách nhau bằng dấu phẩy" />
        {message ? <div className="purchase-modal-error">{message}</div> : null}
        <div className="purchase-modal-actions">
          <button type="submit">Gửi yêu cầu</button>
          <button type="button" className="secondary" onClick={onClose}>Đóng</button>
        </div>
      </form>
    </div>
  )
}

export default RefundRequestModal
