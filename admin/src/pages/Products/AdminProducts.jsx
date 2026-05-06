import { useEffect, useMemo, useState } from 'react'
import { approveProduct, getCategories, getProducts, getSellers, rejectProduct, saveProduct, updateProductStatus } from '../../services/adminStore.service'

const emptyForm = {
  name: '',
  sku: '',
  sellerId: '',
  categoryId: '',
  description: '',
  price: '',
  stock: '',
  imagesText: '',
  status: 'active',
}

function splitImages(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean)
}

function AdminProducts({ onlyPending = false }) {
  const [products, setProducts] = useState([])
  const [sellers, setSellers] = useState([])
  const [categories, setCategories] = useState([])
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const reload = async () => {
    const query = onlyPending ? { status: 'pending_review' } : {}
    const [prods, sels, cats] = await Promise.all([getProducts(query), getSellers(), getCategories()])
    setProducts(Array.isArray(prods) ? prods : [])
    setSellers(Array.isArray(sels) ? sels : [])
    setCategories(Array.isArray(cats) ? cats : [])
  }

  useEffect(() => {
    setLoading(true)
    reload().catch((err) => setMessage(err.message)).finally(() => setLoading(false))
  }, [onlyPending])

  const filtered = useMemo(() => products.filter((product) => {
    const seller = sellers.find((s) => String(s._id || s.id) === String(product.seller?._id || product.seller || product.sellerId || ''))
    const text = `${product.name} ${product.sku || ''} ${seller?.shopName || ''}`.toLowerCase()
    const matchStatus = onlyPending ? true : (!status || product.status === status)
    return (!keyword || text.includes(keyword.toLowerCase())) && matchStatus
  }), [keyword, onlyPending, products, sellers, status])

  const resetForm = () => {
    setEditingId('')
    setForm(emptyForm)
  }

  const edit = (product) => {
    setEditingId(product._id || product.id)
    setForm({
      name: product.name || '',
      sku: product.sku || '',
      sellerId: product.seller?._id || product.seller || '',
      categoryId: product.category?._id || product.category || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      imagesText: (product.images || []).join(', '),
      status: product.status || 'active',
    })
    setMessage('')
  }

  const submit = async () => {
    try {
      await saveProduct({
        id: editingId || undefined,
        ...form,
        seller: form.sellerId,
        category: form.categoryId,
        price: Number(form.price),
        stock: Number(form.stock),
        images: splitImages(form.imagesText),
      })
      setMessage(editingId ? 'Đã cập nhật sản phẩm.' : 'Đã tạo sản phẩm.')
      resetForm()
      await reload()
    } catch (err) {
      setMessage(err.message)
    }
  }

  const setProductStatus = async (product, nextStatus) => {
    const id = product._id || product.id
    try {
      if (nextStatus === 'active') {
        await approveProduct(id)
      } else if (nextStatus === 'rejected') {
        const reason = window.prompt('Nhập lý do từ chối')
        if (!reason) return
        await rejectProduct(id, reason)
      } else {
        await updateProductStatus(id, nextStatus)
      }
      setMessage('Đã cập nhật.')
      await reload()
    } catch (err) {
      setMessage(err.message)
    }
  }

  if (loading) return <div className="admin-page"><div style={{ padding: 32 }}>Đang tải...</div></div>

  return (
    <div className="admin-page">
      <header className="admin-hero"><p className="admin-eyebrow">UC-17</p><h1>{onlyPending ? 'Duyệt sản phẩm Seller' : 'Quản lý sản phẩm'}</h1></header>
      <section className="admin-panel">
        {message ? <div className="admin-message">{message}</div> : null}
        {!onlyPending ? (
          <>
            <div className="admin-form-row">
              <input className="admin-search-input" placeholder="Tên sản phẩm" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
              <input className="admin-search-input" placeholder="SKU" value={form.sku} onChange={(e) => setForm((prev) => ({ ...prev, sku: e.target.value }))} />
              <select className="admin-search-input" value={form.sellerId} onChange={(e) => setForm((prev) => ({ ...prev, sellerId: e.target.value }))}>
                <option value="">Chọn seller</option>
                {sellers.map((seller) => <option key={seller._id || seller.id} value={seller._id || seller.id}>{seller.shopName}</option>)}
              </select>
              <select className="admin-search-input" value={form.categoryId} onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))}>
                <option value="">Chọn danh mục</option>
                {categories.map((category) => <option key={category._id || category.id} value={category._id || category.id}>{category.name}</option>)}
              </select>
            </div>
            <div className="admin-form-row">
              <input className="admin-search-input" type="number" placeholder="Giá" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} />
              <input className="admin-search-input" type="number" placeholder="Kho" value={form.stock} onChange={(e) => setForm((prev) => ({ ...prev, stock: e.target.value }))} />
              <select className="admin-search-input" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
                <option value="active">active</option>
                <option value="hidden">hidden</option>
                <option value="draft">draft</option>
              </select>
            </div>
            <div className="admin-form-row">
              <input className="admin-search-input" placeholder="URL ảnh, cách nhau bằng dấu phẩy" value={form.imagesText} onChange={(e) => setForm((prev) => ({ ...prev, imagesText: e.target.value }))} />
              <input className="admin-search-input" placeholder="Mô tả" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
              <button className="admin-primary-btn" onClick={submit}>{editingId ? 'Lưu' : 'Thêm'}</button>
              {editingId ? <button className="admin-table-btn" onClick={resetForm}>Hủy</button> : null}
            </div>
          </>
        ) : null}
        <div className="admin-form-row">
          <input className="admin-search-input" placeholder="Tìm tên/SKU/shop" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          {!onlyPending ? (
            <select className="admin-search-input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Tất cả</option>
              <option value="active">active</option>
              <option value="pending_review">pending_review</option>
              <option value="hidden">hidden</option>
              <option value="rejected">rejected</option>
            </select>
          ) : null}
        </div>
        <table className="admin-table">
          <thead><tr><th>Sản phẩm</th><th>SKU</th><th>Shop</th><th>Giá</th><th>Kho</th><th>Trạng thái</th><th>Thao tác</th></tr></thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product._id || product.id}>
                <td>{product.name}{product.rejectReason ? <small><br />{product.rejectReason}</small> : null}</td>
                <td>{product.sku}</td>
                <td>{product.seller?.shopName || ''}</td>
                <td>{Number(product.price || 0).toLocaleString('vi-VN')}đ</td>
                <td>{product.stock}</td>
                <td>{product.status}</td>
                <td>
                  {!onlyPending ? <button className="admin-table-btn" onClick={() => edit(product)}>Sửa</button> : null}
                  <button className="admin-table-btn" onClick={() => setProductStatus(product, 'active')}>Duyệt</button>
                  <button className="admin-table-btn" onClick={() => setProductStatus(product, 'rejected')}>Từ chối</button>
                  <button className="admin-table-btn" onClick={() => setProductStatus(product, product.status === 'hidden' ? 'active' : 'hidden')}>
                    {product.status === 'hidden' ? 'Hiện' : 'Ẩn'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default AdminProducts
