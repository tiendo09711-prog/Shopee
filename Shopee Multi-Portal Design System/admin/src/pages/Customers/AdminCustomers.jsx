import { useMemo, useState } from 'react'
import { getOrders, getUsers, saveUsers } from '../../services/adminStore.service'

function AdminCustomers() {
  const [users, setUsers] = useState(() => getUsers())
  const [keyword, setKeyword] = useState('')
  const orders = getOrders()
  const customers = useMemo(() => users.filter((user) => user.role !== 'admin' && (!keyword || `${user.name} ${user.email} ${user.phone}`.toLowerCase().includes(keyword.toLowerCase()))), [keyword, users])
  const persist = (next) => { setUsers(next); saveUsers(next) }
  const setStatus = (user, status) => persist(users.map((item) => item.id === user.id ? { ...item, status, updatedAt: new Date().toISOString() } : item))

  return (
    <div className="admin-page">
      <header className="admin-hero"><p className="admin-eyebrow">Users</p><h1>Quản lý Customer</h1></header>
      <section className="admin-panel">
        <input className="admin-search-input" placeholder="Search email/name/phone" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <table className="admin-table"><thead><tr><th>Tên</th><th>Email</th><th>Phone</th><th>Status</th><th>Đơn</th><th>Thao tác</th></tr></thead><tbody>{customers.map((user) => <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td>{user.phone}</td><td>{user.status}</td><td>{orders.filter((order) => order.customerId === user.id).length}</td><td><button className="admin-table-btn" onClick={() => setStatus(user, 'locked')}>Khóa</button><button className="admin-table-btn" onClick={() => setStatus(user, 'active')}>Mở</button></td></tr>)}</tbody></table>
      </section>
    </div>
  )
}

export default AdminCustomers
