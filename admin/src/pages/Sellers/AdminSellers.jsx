import { useEffect, useMemo, useState } from 'react'
import { approveSeller, getSellers, rejectSeller, updateSellerStatus } from '../../services/adminStore.service'

function AdminSellers() {
  const [sellers, setSellers] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const reload = async () => {
    const data = await getSellers()
    setSellers(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    reload().catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => sellers.filter((s) => !statusFilter || s.status === statusFilter), [sellers, statusFilter])

  const setStatus = async (seller, status) => {
    const id = seller._id || seller.id
    try {
      if (status === 'approved') {
        await approveSeller(id)
      } else if (status === 'rejected') {
        const reason = window.prompt('Lý do từ chối')
        if (!reason) return
        await rejectSeller(id, reason)
      } else {
        await updateSellerStatus(id, status)
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
      <header className="admin-hero"><p className="admin-eyebrow">Seller</p><h1>Quản lý Seller/Gian hàng</h1></header>
      <section className="admin-panel">
        {message ? <div className="admin-message">{message}</div> : null}
        <select className="admin-search-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Tất cả</option>
          <option value="pending_approval">pending_approval</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
          <option value="locked">locked</option>
        </select>
        <table className="admin-table">
          <thead><tr><th>Shop</th><th>Email</th><th>Status</th><th>Thao tác</th></tr></thead>
          <tbody>
            {filtered.map((seller) => (
              <tr key={seller._id || seller.id}>
                <td>{seller.shopName}<br /><small>{seller.rejectReason}</small></td>
                <td>{seller.user?.email || seller.email}</td>
                <td>{seller.status}</td>
                <td>
                  <button className="admin-table-btn" onClick={() => setStatus(seller, 'approved')}>Duyệt</button>
                  <button className="admin-table-btn" onClick={() => setStatus(seller, 'rejected')}>Từ chối</button>
                  <button className="admin-table-btn" onClick={() => setStatus(seller, 'locked')}>Khóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default AdminSellers
