import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { useSeller } from '../../contexts/SellerContext'
import { getSellerProductById, saveSellerProduct } from '../../services/sellerProduct.service'
import { uploadImages } from '../../services/upload.service'

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
  const [editingProduct, setEditingProduct] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [form, setForm] = useState({
    name: '', sku: '', categoryId: '', description: '', price: '', stock: '', imagesText: '',
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [imageFiles, setImageFiles] = useState([])

  useEffect(() => {
    // Load categories from backend
    fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/categories`)
      .then((r) => r.json())
      .then((payload) => { if (payload.data) setCategories(Array.isArray(payload.data) ? payload.data : []) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!productId || !seller?.id) return
    setLoading(true)
    getSellerProductById(seller.id, productId)
      .then((product) => {
        if (!product) { setNotFound(true); return }
        setEditingProduct(product)
        setForm({
          name: product.name || '',
          sku: product.sku || '',
          categoryId: product.category?._id || product.category || product.categoryId || '',
          description: product.description || '',
          price: product.price || '',
          stock: product.stock || '',
          imagesText: imagesToText(product.images),
        })
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [productId, seller])

  if (productId && notFound) return <Navigate to="/seller/products" replace />

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (mode) => {
    setLoading(true)
    setMessage('')
    try {
      const uploadedImages = imageFiles.length ? await uploadImages(imageFiles) : []
      const saved = await saveSellerProduct(seller, {
        _id: editingProduct?._id || editingProduct?.id,
        name: form.name,
        sku: form.sku,
        categoryId: form.categoryId,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        images: [...textToImages(form.imagesText), ...uploadedImages],
      }, mode)
      setMessage(mode === 'publish' ? 'Sản phẩm đã chuyển sang chờ Admin duyệt.' : 'Đã lưu nháp sản phẩm.')
      setTimeout(() => navigate(`/seller/products/${saved._id || saved.id}`), 500)
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
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
            {categories.map((category) => <option key={category._id || category.id} value={category._id || category.id}>{category.name}</option>)}
          </select>
          <textarea className="seller-textarea" value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Mô tả sản phẩm" />
          <input className="seller-input" type="number" value={form.price} onChange={(e) => handleChange('price', e.target.value)} placeholder="Giá" />
          <input className="seller-input" type="number" value={form.stock} onChange={(e) => handleChange('stock', e.target.value)} placeholder="Tồn kho" />
          <textarea className="seller-textarea" value={form.imagesText} onChange={(e) => handleChange('imagesText', e.target.value)} placeholder="URL ảnh sản phẩm, cách nhau bằng dấu phẩy" />
          <input className="seller-input" type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files || []))} />
        </div>
        {message ? <div className={message.includes('duyệt') || message.includes('Đã lưu') ? 'status-message text-success' : 'status-message text-danger'}>{message}</div> : null}
        <div className="seller-form-actions">
          <button type="button" className="seller-outline-btn" onClick={() => handleSubmit('draft')} disabled={loading}>Lưu nháp</button>
          <button type="button" className="seller-primary-btn" onClick={() => handleSubmit('publish')} disabled={loading}>Đăng bán</button>
        </div>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerProductForm
