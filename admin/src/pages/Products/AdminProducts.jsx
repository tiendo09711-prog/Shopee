import { useMemo, useState } from 'react'
import { getProducts, getSellers, pushNotification, saveProducts } from '../../services/adminStore.service'

function AdminProducts({ onlyPending = false }) {
  const [products, setProducts] = useState(() => getProducts())
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('')
  const sellers = getSellers()

  const filtered = useMemo(() => products.filter((product) => {
    const seller = sellers.find((item) => item.id === product.sellerId || item.id === product.shopId)
    const text = `${product.name} ${product.sku || ''} ${seller?.shopName || product.shopId || ''}`.toLowerCase()
    const matchStatus = onlyPending ? product.status === 'pending_review' : (!status || product.status === status)
    return (!keyword || text.includes(keyword.toLowerCase())) && matchStatus
  }), [keyword, onlyPending, products, sellers, status])

  const persist = (next) => { setProducts(next); saveProducts(next) }
  const setProductStatus = (product, nextStatus) => {
    const rejectReason = nextStatus === 'rejected' ? window.prompt('Nhập lý do từ chối') : ''
    if (nextStatus === 'rejected' && !rejectReason) return
    persist(products.map((item) => item.id === product.id ? { ...item, status: nextStatus, rejectReason: rejectReason || item.rejectReason || '', updatedAt: new Date().toISOString() } : item))
    pushNotification(product.sellerId, { type: 'product', title: 'Sản phẩm được cập nhật', message: `${product.name}: ${nextStatus}` })
  }

  return (
    <div className="admin-page">
      <header className="admin-hero"><p className="admin-eyebrow">UC-17</p><h1>{onlyPending ? 'Duyệt sản phẩm Seller' : 'Quản lý sản phẩm'}</h1></header>
      <section className="admin-panel">
        <div className="admin-form-row"><input className="admin-search-input" placeholder="Tìm tên/SKU/shop" value={keyword} onChange={(e) => setKeyword(e.target.value)} />{!onlyPending ? <select className="admin-search-input" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Tất cả</option><option value="active">active</option><option value="pending_review">pending_review</option><option value="hidden">hidden</option><option value="rejected">rejected</option></select> : null}</div>
        <table className="admin-table"><thead><tr><th>Sản phẩm</th><th>SKU</th><th>Shop</th><th>Giá</th><th>Kho</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>{filtered.map((product) => <tr key={product.id}><td>{product.name}<br />{product.rejectReason ? <small>{product.rejectReason}</small> : null}</td><td>{product.sku}</td><td>{product.shopId}</td><td>{Number(product.price || 0).toLocaleString('vi-VN')}đ</td><td>{product.stock}</td><td>{product.status}</td><td><button className="admin-table-btn" onClick={() => setProductStatus(product, 'active')}>Duyệt</button><button className="admin-table-btn" onClick={() => setProductStatus(product, 'rejected')}>Từ chối</button><button className="admin-table-btn" onClick={() => setProductStatus(product, product.status === 'hidden' ? 'active' : 'hidden')}>{product.status === 'hidden' ? 'Hiện' : 'Ẩn'}</button></td></tr>)}</tbody></table>
      </section>
    </div>
  )
}

export default AdminProducts
