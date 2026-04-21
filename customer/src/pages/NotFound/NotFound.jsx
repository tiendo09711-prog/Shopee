import { Link } from 'react-router-dom'
import MainLayout from '../../layout/MainLayout'

function NotFound() {
  return (
    <MainLayout>
      <div className="container page-spacing"><div className="empty-message">Trang bạn tìm không tồn tại. <Link to="/">Quay về trang chủ</Link></div></div>
    </MainLayout>
  )
}

export default NotFound
