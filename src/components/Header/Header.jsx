import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useLanguage } from '../../contexts/LanguageContext'
import './Header.css'

function Header() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const { totalQuantity } = useCart()
  const { language, changeLanguage, t } = useLanguage()
  const [keyword, setKeyword] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  const avatarFallback = useMemo(() => (user?.name || 'U').slice(0, 1).toUpperCase(), [user])

  const handleSearch = (event) => {
    event.preventDefault()
    const query = keyword.trim()
    navigate(query ? `/?keyword=${encodeURIComponent(query)}` : '/')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header-top">
        <div className="container header-top-inner">
          <div className="header-top-left">
            <span>Kênh Người Bán</span>
            <span>Kết nối</span>
            <span>Tải ứng dụng</span>
          </div>
          <div className="header-top-right">
            <div className="header-dropdown-wrap" onMouseLeave={() => setShowLanguageMenu(false)}>
              <button type="button" className="header-link-button" onMouseEnter={() => setShowLanguageMenu(true)}>🌐 {language === 'vi' ? 'Tiếng Việt' : 'English'}</button>
              {showLanguageMenu && (
                <div className="header-dropdown-menu small-menu">
                  <button type="button" onClick={() => changeLanguage('vi')}>Tiếng Việt</button>
                  <button type="button" onClick={() => changeLanguage('en')}>English</button>
                </div>
              )}
            </div>
            {!isAuthenticated ? (
              <>
                <Link to="/register">{t('register')}</Link>
                <Link to="/login">{t('login')}</Link>
              </>
            ) : (
              <div className="header-dropdown-wrap" onMouseLeave={() => setShowMenu(false)}>
                <button type="button" className="header-user-trigger" onMouseEnter={() => setShowMenu(true)}>
                  {user.avatarThumb ? <img src={user.avatarThumb} alt={user.name} className="header-avatar" /> : <span className="header-avatar header-avatar-fallback">{avatarFallback}</span>}
                  <span className="header-user-name">{user.name}</span>
                </button>
                {showMenu && (
                  <div className="header-dropdown-menu">
                    <Link to="/user/account">{t('account')}</Link>
                    <Link to="/user/purchase">{t('orders')}</Link>
                    <button type="button" onClick={handleLogout}>{t('logout')}</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="header-main">
        <div className="container header-main-inner">
          <Link to="/" className="header-logo" aria-label="Trang chủ">
            <div className="header-logo-mark">S</div>
            <div className="header-logo-text">Shopee</div>
          </Link>

          <form className="header-search" onSubmit={handleSearch}>
            <input type="text" placeholder={t('searchPlaceholder')} value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            <button type="submit">🔍</button>
          </form>

          <Link to="/cart" className="header-cart" aria-label="Giỏ hàng">
            <span className="header-cart-icon">🛒</span>
            {totalQuantity > 0 && <span className="header-cart-count">{totalQuantity}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header