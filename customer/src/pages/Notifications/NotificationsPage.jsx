import { Navigate } from 'react-router-dom'
import MainLayout from '../../layout/MainLayout'
import { useAuth } from '../../contexts/AuthContext'
import { useNotifications } from '../../contexts/NotificationContext'
import './NotificationsPage.css'

function NotificationsPage() {
  const { isAuthenticated } = useAuth()
  const { notifications, markAllRead } = useNotifications()

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: '/notifications' }} />

  return (
    <MainLayout>
      <div className="container page-spacing notifications-page">
        <div className="card notifications-header">
          <div>
            <h1>Thông báo của tôi</h1>
            <p>Cập nhật đơn hàng, khuyến mãi và phản hồi từ shop</p>
          </div>
          <button type="button" onClick={markAllRead}>Đánh dấu đã đọc</button>
        </div>

        <div className="notifications-list">
          {notifications.length === 0 ? (
            <div className="empty-message card">Chưa có thông báo nào.</div>
          ) : notifications.map((item) => (
            <article key={item.id} className={`card notification-item ${item.read ? 'read' : 'unread'}`}>
              <strong>{item.title}</strong>
              <p>{item.message}</p>
              <small>{new Date(item.createdAt).toLocaleString('vi-VN')}</small>
            </article>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

export default NotificationsPage