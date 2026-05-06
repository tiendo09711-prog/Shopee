import { useEffect, useMemo, useState } from 'react'
import { getUsers, updateUserStatus } from '../../services/adminStore.service'

function AdminCustomers() {
  const [users, setUsers] = useState([])
  const [keyword, setKeyword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const reload = async () => {
    const data = await getUsers()
    setUsers(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    reload().catch((err) => setMessage(`Lỗi tải dữ liệu: ${err.message}`)).finally(() => setLoading(false))
  }, [])

  const customers = useMemo(() => users.filter((user) => {
    const matchRole = user.role !== 'admin'
    const matchKeyword = !keyword || `${user.name} ${user.email} ${user.phone || ''}`.toLowerCase().includes(keyword.toLowerCase())
    return matchRole && matchKeyword
  }), [keyword, users])

  const setStatus = async (user, status) => {
    try {
      await updateUserStatus(user._id || user.id, status)
      setMessage('Đã cập nhật.')
      await reload()
    } catch (err) {
      setMessage(err.message)
    }
  }

  if (loading) return <div className="admin-page"><div style={{ padding: 32 }}>Đang tải...</div></div>

  return (
    <div className="admin-page">
      <header className="admin-hero"><p className="admin-eyebrow">Users</p><h1>Quản lý Customer</h1></header>
      <section className="admin-panel">
        {message ? <div className="admin-message">{message}</div> : null}
        <input className="admin-search-input" placeholder="Search email/name/phone" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <table className="admin-table">
          <thead><tr><th>Tên</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Thao tác</th></tr></thead>
          <tbody>
            {customers.map((user) => (
              <tr key={user._id || user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone || '-'}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  <button className="admin-table-btn" onClick={() => setStatus(user, 'locked')}>Khóa</button>
                  <button className="admin-table-btn" onClick={() => setStatus(user, 'active')}>Mở</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default AdminCustomers
