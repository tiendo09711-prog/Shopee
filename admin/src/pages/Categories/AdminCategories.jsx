import { useMemo, useState } from 'react'
import { getCategories, getProducts, saveCategories } from '../../services/adminStore.service'

function AdminCategories() {
  const [categories, setCategories] = useState(() => getCategories())
  const [form, setForm] = useState({ name: '', description: '' })
  const [message, setMessage] = useState('')
  const products = getProducts()

  const rows = useMemo(() => categories.map((category) => ({
    ...category,
    productsCount: products.filter((product) => product.categoryId === category.id || product.category === category.id).length,
  })), [categories, products])

  const persist = (next) => { setCategories(next); saveCategories(next) }
  const create = () => {
    if (!form.name.trim()) return setMessage('Tên danh mục không được để trống.')
    if (categories.some((item) => item.name.toLowerCase() === form.name.trim().toLowerCase())) return setMessage('Tên danh mục đã tồn tại.')
    persist([{ id: `cat_${Date.now()}`, name: form.name.trim(), description: form.description.trim(), status: 'active' }, ...categories])
    setForm({ name: '', description: '' }); setMessage('Đã thêm danh mục.')
  }
  const toggle = (id) => persist(categories.map((item) => item.id === id ? { ...item, status: item.status === 'hidden' ? 'active' : 'hidden' } : item))
  const remove = (category) => {
    if (category.productsCount > 0) return setMessage('Không thể xóa danh mục đang có sản phẩm.')
    persist(categories.filter((item) => item.id !== category.id))
  }

  return (
    <div className="admin-page">
      <header className="admin-hero"><p className="admin-eyebrow">UC-16</p><h1>Quản lý danh mục</h1></header>
      <section className="admin-panel">
        <div className="admin-form-row"><input className="admin-search-input" placeholder="Tên danh mục" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} /><input className="admin-search-input" placeholder="Mô tả" value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} /><button className="admin-primary-btn" onClick={create}>Thêm</button></div>
        {message ? <div className="admin-message">{message}</div> : null}
        <table className="admin-table"><thead><tr><th>Tên</th><th>Mô tả</th><th>Trạng thái</th><th>Sản phẩm</th><th>Thao tác</th></tr></thead><tbody>{rows.map((category) => <tr key={category.id}><td>{category.name}</td><td>{category.description}</td><td>{category.status}</td><td>{category.productsCount}</td><td><button className="admin-table-btn" onClick={() => toggle(category.id)}>{category.status === 'hidden' ? 'Hiện' : 'Ẩn'}</button><button className="admin-table-btn" onClick={() => remove(category)}>Xóa</button></td></tr>)}</tbody></table>
      </section>
    </div>
  )
}

export default AdminCategories
