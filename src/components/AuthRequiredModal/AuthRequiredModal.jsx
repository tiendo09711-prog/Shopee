import { Link } from 'react-router-dom'
import './AuthRequiredModal.css'

function AuthRequiredModal({ open, onClose }) {
  if (!open) return null

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(event) => event.stopPropagation()}>
        <div className="auth-modal-header">
          <span></span>
          <button type="button" onClick={onClose}>✕</button>
        </div>
        <div className="auth-modal-body">
          <img src="/assets/login-illustration.svg" alt="Đăng nhập để tiếp tục" className="auth-modal-image" />
          <h3>Đăng nhập để mua hàng</h3>
          <p>Vui lòng đăng nhập hoặc đăng ký tài khoản để thêm sản phẩm vào giỏ hàng và tiếp tục mua sắm.</p>
          <div className="auth-modal-actions">
            <Link to="/register" className="auth-outline-btn">ĐĂNG KÝ</Link>
            <Link to="/login" className="auth-filled-btn">ĐĂNG NHẬP</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthRequiredModal
