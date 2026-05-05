import { useEffect, useMemo, useState } from 'react'
import { approveProduct, getProducts, getSellers, rejectProduct, updateProductStatus } from '../../services/adminStore.service'

function AdminProducts({ onlyPending = false }) {
  const [products, setProducts] = useState([])
  const [sellers, setSellers] = useState([])
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const reload = async () => {
    const query = onlyPending ? { status: 'pending_review' } : {}
    const [prods, sels] = await Promise.all([getProducts(query), getSellers()])
    setProducts(Array.isArray(prods) ? prods : [])
    setSellers(Array.isArray(sels) ? sels : [])
  }

  useEffect(() => {
    reload().catch(() => {}).finally(() => setLoading(false))
  }, [onlyPending])

  const filtered = useMemo(() => products.filter((product) => {
    const seller = sellers.find((s) => {
      const sid = String(s._id || s.id)
      const psid = String(product.seller?._id || product.seller || product.sellerId || '')
      return sid === psid
    })
    const text = `${product.name} ${product.sku || ''} ${seller?.shopName || ''}`.toLowerCase()
    const matchStatus = onlyPending ? true : (!status || product.status === status)
    return (!keyword || text.includes(keyword.toLowerCase())) && matchStatus
  }), [keyword, onlyPending, products, sellers, status])

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
