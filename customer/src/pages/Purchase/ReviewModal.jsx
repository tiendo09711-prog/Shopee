import { useMemo, useState } from 'react'
import { createReview, hasReviewedOrderItem } from '../../services/review.service'
import { uploadImages } from '../../services/upload.service'

function parseImages(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

function ReviewModal({ order, customer, onClose, onSuccess }) {
  const reviewableItems = useMemo(() => order.items.filter((item) => !item.reviewed && !hasReviewedOrderItem(order.id, item.orderItemId)), [order])
  const [form, setForm] = useState({
    orderItemId: reviewableItems[0]?.orderItemId || '',
    rating: 5,
    comment: '',
    images: '',
    video: '',
    anonymous: false
  })
  const [files, setFiles] = useState([])
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const uploadedImages = files.length ? await uploadImages(files) : []
      const review = await createReview(order, form.orderItemId, customer, {
        ...form,
        images: [...parseImages(form.images), ...uploadedImages]
      })
      onSuccess(review)
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="purchase-modal-backdrop">
      <form className="purchase-modal card" onSubmit={handleSubmit}>
        <h2>Đánh giá sản phẩm</h2>
        {reviewableItems.length === 0 ? (
          <div className="purchase-modal-error">Bạn đã đánh giá tất cả sản phẩm trong đơn này.</div>
        ) : (
          <>
            <select value={form.orderItemId} onChange={(e) => setForm((prev) => ({ ...prev, orderItemId: e.target.value }))}>
              {reviewableItems.map((item) => <option key={item.orderItemId} value={item.orderItemId}>{item.name}</option>)}
            </select>
            <select value={form.rating} onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}>
              {[5, 4, 3, 2, 1].map((star) => <option key={star} value={star}>{star} sao</option>)}
            </select>
            <textarea value={form.comment} onChange={(e) => setForm((prev) => ({ ...prev, comment: e.target.value }))} placeholder="Chia sẻ trải nghiệm của bạn" />
            <input value={form.images} onChange={(e) => setForm((prev) => ({ ...prev, images: e.target.value }))} placeholder="Ảnh, cách nhau bằng dấu phẩy" />
            <input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
            <input value={form.video} onChange={(e) => setForm((prev) => ({ ...prev, video: e.target.value }))} placeholder="Video URL (tuỳ chọn)" />
            <label className="purchase-modal-check">
              <input type="checkbox" checked={form.anonymous} onChange={(e) => setForm((prev) => ({ ...prev, anonymous: e.target.checked }))} />
              <span>Đánh giá ẩn danh</span>
            </label>
          </>
        )}
        {message ? <div className="purchase-modal-error">{message}</div> : null}
        <div className="purchase-modal-actions">
          {reviewableItems.length > 0 ? <button type="submit">Gửi đánh giá</button> : null}
          <button type="button" className="secondary" onClick={onClose}>Đóng</button>
        </div>
      </form>
    </div>
  )
}

export default ReviewModal
