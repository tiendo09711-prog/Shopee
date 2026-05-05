import { useMemo, useState } from 'react'
import { getOrders, getProducts, getSellers, pushNotification, saveSellers } from '../../services/adminStore.service'

function AdminSellers() {
  const [sellers, setSellers] = useState(() => getSellers())
  const [status, setStatusFilter] = useState('')
  const products = getProducts()
  const orders = getOrders()
  const filtered = useMemo(() => sellers.filter((seller) => !status || seller.status === status), [sellers, status])
  const persist = (next) => { setSellers(next); saveSellers(next) }
  const setStatus = (seller, status) => {
    const rejectReason = status === 'rejected' ? window.prompt('Lý do từ chối') : ''
    if (status === 'rejected' && !rejectReason) return
    persist(sellers.map((item) => item.id === seller.id ? { ...item, status, rejectReason: rejectReason || item.rejectReason || '', updatedAt: new Date().toISOString() } : item))
    pushNotification(seller.userId, { type: 'seller', title: 'Trạng thái shop được cập nhật', message: `${seller.shopName}: ${status}` })
  }

  return (
    <div className="admin-page">
      <header className="admin-hero"><p className="admin-eyebrow">Seller</p><h1>Quản lý Seller/Gian hàng</h1></header>
      <section className="admin-panel">
        <select className="admin-search-input" value={status} onChange={(e) => setStatusFilter(e.target.value)}><option value="">Tất cả</option><option value="pending_approval">pending_approval</option><option value="approved">approved</option><option value="rejected">rejected</option><option value="locked">locked</option></select>
        <table className="admin-table"><thead><tr><th>Shop</th><th>Email</th><th>Phone</th><th>Status</th><th>Products</th><th>Orders</th><th>Thao tác</th></tr></thead><tbody>{filtered.map((seller) => <tr key={seller.id}><td>{seller.shopName}<br /><small>{seller.rejectReason}</small></td><td>{seller.email}</td><td>{seller.phone || seller.shopInfo?.phone}</td><td>{seller.status}</td><td>{products.filter((p) => p.shopId === seller.id || p.sellerId === seller.id).length}</td><td>{orders.filter((o) => o.shopId === seller.id || o.sellerId === seller.id).length}</td><td><button className="admin-table-btn" onClick={() => setStatus(seller, 'approved')}>Duyệt</button><button className="admin-table-btn" onClick={() => setStatus(seller, 'rejected')}>Từ chối</button><button className="admin-table-btn" onClick={() => setStatus(seller, 'locked')}>Khóa</button><button className="admin-table-btn" onClick={() => setStatus(seller, 'approved')}>Mở</button></td></tr>)}</tbody></table>
      </section>
    </div>
  )
}

export default AdminSellers
