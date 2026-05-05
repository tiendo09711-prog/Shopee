import { useState } from 'react'
import { createReport, REPORT_TYPES } from '../../services/report.service'

function parseEvidence(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

function ReportOrderModal({ order, reporterId, onClose, onSuccess }) {
  const [form, setForm] = useState({
    targetType: 'order',
    type: REPORT_TYPES[0].value,
    reason: '',
    description: '',
    evidence: ''
  })
  const [message, setMessage] = useState('')

  const targetId = form.targetType === 'seller' ? order.shopId : order.id

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const report = await createReport(reporterId, {
        ...form,
        targetId,
        evidence: parseEvidence(form.evidence)
      })
      onSuccess(report)
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="purchase-modal-backdrop">
      <form className="purchase-modal card" onSubmit={handleSubmit}>
        <h2>Báo cáo vấn đề</h2>
        <select value={form.targetType} onChange={(e) => setForm((prev) => ({ ...prev, targetType: e.target.value }))}>
          <option value="order">Đơn hàng</option>
          <option value="seller">Người bán</option>
        </select>
        <select value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}>
          {REPORT_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
        </select>
        <input value={form.reason} onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))} placeholder="Lý do báo cáo" />
        <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Mô tả chi tiết" />
        <input value={form.evidence} onChange={(e) => setForm((prev) => ({ ...prev, evidence: e.target.value }))} placeholder="Minh chứng, cách nhau bằng dấu phẩy" />
        {message ? <div className="purchase-modal-error">{message}</div> : null}
        <div className="purchase-modal-actions">
          <button type="submit">Gửi báo cáo</button>
          <button type="button" className="secondary" onClick={onClose}>Đóng</button>
        </div>
      </form>
    </div>
  )
}

export default ReportOrderModal
