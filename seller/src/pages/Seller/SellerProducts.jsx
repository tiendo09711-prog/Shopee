import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { useSeller } from '../../contexts/SellerContext'
import { deleteSellerProduct, getSellerProducts, toggleSellerProductVisibility } from '../../services/sellerProduct.service'
import { formatCurrency } from '../../utils/formatCurrency'

const statusLabels = {
  draft: 'Nháp',
  pending_review: 'Chờ duyệt',
  active: 'Đang bán',
  hidden: 'Đã ẩn',
  rejected: 'Bị từ chối',
}

function SellerProducts() {
  const { seller } = useSeller()
  const [products, setProducts] = useState([])
  const [filters, setFilters] = useState({ keyword: '', status: '', sort: 'createdDesc', page: 1 })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const pageSize = 8

  const reload = async () => {
    if (!seller?.id) return
    setLoading(true)
    try {
      const data = await getSellerProducts(seller.id, {})
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (seller?.id) reload()
  }, [seller])

  const filteredProducts = useMemo(() => {
    let result = [...products]
    const keyword = filters.keyword.trim().toLowerCase()
    if (keyword) result = result.filter((p) => `${p.name} ${p.sku || ''}`.toLowerCase().includes(keyword))
    if (filters.status) result = result.filter((p) => p.status === filters.status)
    if (filters.sort === 'priceAsc') result.sort((a, b) => a.price - b.price)
    else if (filters.sort === 'priceDesc') result.sort((a, b) => b.price - a.price)
    else if (filters.sort === 'stockAsc') result.sort((a, b) => a.stock - b.stock)
    else result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return result
  }, [filters, products])

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize))
  const currentPage = Math.min(filters.page, pageCount)
  const pageProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const patchFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }))

  const handleToggle = async (product) => {
    try {
      await toggleSellerProductVisibility(seller.id, product._id || product.id, product.status)
      await reload()
    } catch (err) {
      setMessage(err.message)
    }
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Bạn muốn xóa sản phẩm này?')) return
    try {
      await deleteSellerProduct(seller.id, productId)
      await reload()
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <SellerDashboardLayout rightbar={<div><h3>Gợi ý</h3><p className="seller-muted">Sản phẩm đăng bán sẽ chuyển sang chờ Admin duyệt trước khi hiển thị.</p></div>}>
      <section className="seller-panel">
        <div className="seller-page-head">
          <h1 className="seller-page-title">Quản lý sản phẩm</h1>
          <Link className="seller-primary-btn" to="/seller/products/new">+ Thêm sản phẩm</Link>
        </div>
        {message ? <div className="status-message text-danger">{message}</div> : null}
        {loading ? <div>Đang tải...</div> : null}
        <div className="seller-toolbar">
          <input className="seller-input" placeholder="Tìm tên/SKU" value={filters.keyword} onChange={(e) => patchFilter('keyword', e.target.value)} />
          <select className="seller-input" value={filters.status} onChange={(e) => patchFilter('status', e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            {Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
          <select className="seller-input" value={filters.sort} onChange={(e) => patchFilter('sort', e.target.value)}>
            <option value="createdDesc">Mới nhất</option>
            <option value="priceAsc">Giá tăng dần</option>
            <option value="priceDesc">Giá giảm dần</option>
            <option value="stockAsc">Tồn kho thấp</option>
          </select>
        </div>
        <table className="seller-table">
          <thead>
            <tr><th>Sản phẩm</th><th>SKU</th><th>Kho</th><th>Giá</th><th>Trạng thái</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            {pageProducts.length === 0 ? (
              <tr><td colSpan="6">Chưa có sản phẩm phù hợp.</td></tr>
            ) : pageProducts.map((product) => (
              <tr key={product._id || product.id}>
                <td>{product.name}{product.rejectReason ? <div className="seller-muted">Lý do: {product.rejectReason}</div> : null}</td>
                <td>{product.sku}</td>
                <td>{product.stock}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{statusLabels[product.status] || product.status}</td>
                <td>
                  <div className="seller-row-actions">
                    <Link to={`/seller/products/${product._id || product.id}`}>Xem</Link>
                    <Link to={`/seller/products/${product._id || product.id}/edit`}>Sửa</Link>
                    {['active', 'hidden'].includes(product.status) ? (
                      <button type="button" onClick={() => handleToggle(product)}>{product.status === 'hidden' ? 'Đăng lại' : 'Ẩn'}</button>
                    ) : null}
                    <button type="button" onClick={() => handleDelete(product._id || product.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="seller-pagination">
          <button type="button" disabled={currentPage <= 1} onClick={() => patchFilter('page', currentPage - 1)}>Trước</button>
          <span>Trang {currentPage}/{pageCount}</span>
          <button type="button" disabled={currentPage >= pageCount} onClick={() => patchFilter('page', currentPage + 1)}>Sau</button>
        </div>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerProducts
