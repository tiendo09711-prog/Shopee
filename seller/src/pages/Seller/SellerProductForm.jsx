import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { useSeller } from '../../contexts/SellerContext'
import { categories } from '../../data/categories.mock'
import { getSellerProductById, saveSellerProduct } from '../../services/sellerProduct.service'

function imagesToText(images = []) {
  return images.join(', ')
}

function textToImages(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

function SellerProductForm() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { seller } = useSeller()
  const editingProduct = productId ? getSellerProductById(seller.id, productId) : null
  const [form, setForm] = useState({
    name: '',
    sku: '',
    categoryId: '',
    description: '',
    price: '',
    stock: '',
    imagesText: '',
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name || '',
        sku: editingProduct.sku || '',
        categoryId: editingProduct.categoryId || '',
        description: editingProduct.description || '',
        price: editingProduct.price || '',
        stock: editingProduct.stock || '',
        imagesText: imagesToText(editingProduct.images),
      })
    }
  }, [editingProduct])

  if (productId && !editingProduct) return <Navigate to="/seller/products" replace />

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (mode) => {
    try {
      const saved = saveSellerProduct(seller, {
        id: editingProduct?.id,
        name: form.name,
        sku: form.sku,
        categoryId: form.categoryId,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        images: textToImages(form.imagesText),
      }, mode)
      setMessage(mode === 'publish' ? 'Sản phẩm đã chuyển sang chờ Admin duyệt.' : 'Đã lưu nháp sản phẩm.')
      setTimeout(() => navigate(`/seller/products/${saved.id}`), 500)
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <SellerDashboardLayout>
      <section className="seller-panel">
        <h1 className="seller-page-title">{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h1>
        <div className="seller-simple-form">
          <input className="seller-input" value={form.name} maxLength={255} onChange={(e) => handleChange('name', e.target.value)} placeholder="Tên sản phẩm" />
          <input className="seller-input" value={form.sku} onChange={(e) => handleChange('sku', e.target.value)} placeholder="SKU" />
          <select className="seller-input" value={form.categoryId} onChange={(e) => handleChange('categoryId', e.target.value)}>
            <option value="">Chọn danh mục</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <textarea className="seller-textarea" value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Mô tả sản phẩm" />
          <input className="seller-input" type="number" value={form.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="Giá" />
          <input className="seller-input" type="number" value={form.stock} onChange={(e) => handleChange('stock', e.target.value)} placeholder="Tồn kho" />
          <textarea className="seller-textarea" value={form.imagesText} onChange={(e) => handleChange('imagesText', e.target.value)} placeholder="Ảnh sản phẩm, cách nhau bằng dấu phẩy" />
        </div>
        {message ? <div className={message.includes('lỗi') || message.includes('không') || message.includes('Vui lòng') ? 'status-message text-danger' : 'status-message text-success'}>{message}</div> : null}
        <div className="seller-form-actions">
          <button type="button" className="seller-outline-btn" onClick={() => handleSubmit('draft')}>Lưu nháp</button>
          <button type="button" className="seller-primary-btn" onClick={() => handleSubmit('publish')}>Đăng bán</button>
        </div>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerProductForm
