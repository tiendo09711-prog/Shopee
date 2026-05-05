import { useEffect, useMemo, useState } from 'react'
import { deleteCategory, getCategories, getProducts, saveCategory, updateCategoryStatus } from '../../services/adminStore.service'

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ name: '', description: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const reload = async () => {
    const [cats, prods] = await Promise.all([getCategories(), getProducts()])
    setCategories(Array.isArray(cats) ? cats : [])
    setProducts(Array.isArray(prods) ? prods : [])
  }

  useEffect(() => {
    reload().catch(() => {}).finally(() => setLoading(false))
  }, [])

  const rows = useMemo(() => categories.map((category) => ({
    ...category,
    productsCount: products.filter((p) => {
      const catId = String(p.category?._id || p.category || p.categoryId || '')
      return catId === String(category._id || category.id)
    }).length,
  })), [categories, products])

  const create = async () => {
    if (!form.name.trim()) return setMessage('Tên danh mục không được để trống.')
    if (categories.some((item) => item.name.toLowerCase() === form.name.trim().toLowerCase())) return setMessage('Tên danh mục đã tồn tại.')
    try {
      await saveCategory({ name: form.name.trim(), description: form.description.trim(), status: 'active' })
      setForm({ name: '', description: '' })
      setMessage('Đã thêm danh mục.')
      await reload()
    } catch (err) {
      setMessage(err.message)
    }
  }

  const toggle = async (category) => {
    try {
      await updateCategoryStatus(category._id || category.id, category.status === 'hidden' ? 'active' : 'hidden')
      await reload()
    } catch (err) {
      setMessage(err.message)
    }
  }

  const remove = async (category) => {
    if (category.productsCount > 0) return setMessage('Không thể xóa danh mục đang có sản phẩm.')
    try {
      await deleteCategory(category._id || category.id)
      setMessage('Đã xóa danh mục.')
      await reload()
    } catch (err) {
      setMessage(err.message)
    }
  }

  if (loading) return <div className="admin-page"><div style={{ padding: 32 }}>Đang tải...</div></div>

  return (
    <div className="admin-page">
      <header className="admin-hero"><p className="admin-eyebrow">UC-16</p><h1>Quản lý danh mục</h1></header>
      <section className="admin-panel">
        <div className="admin-form-row">
          <input className="admin-search-input" placeholder="Tên danh mục" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
          <input className="admin-search-input" placeholder="Mô tả" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
          <button className="admin-primary-btn" onClick={create}>Thêm</button>
        </div>
        {message ? <div className="admin-message">{message}</div> : null}
        <table className="admin-table">
          <thead><tr><th>Tên</th><th>Mô tả</th><th>Trạng thái</th><th>Sản phẩm</th><th>Thao tác</th></tr></thead>
          <tbody>
            {rows.map((category) => (
              <tr key={category._id || category.id}>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>{category.status}</td>
                <td>{category.productsCount}</td>
                <td>
                  <button className="admin-table-btn" onClick={() => toggle(category)}>{category.status === 'hidden' ? 'Hiện' : 'Ẩn'}</button>
                  <button className="admin-table-btn" onClick={() => remove(category)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default AdminCategories
