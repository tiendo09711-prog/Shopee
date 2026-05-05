import { Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import MainLayout from '../../layout/MainLayout'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { formatCurrency } from '../../utils/formatCurrency'
import './Cart.css'

function Cart() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { items, selectedItems, selectedCount, selectedTotal, isAllSelected, toggleSelect, toggleSelectAll, updateQuantity, removeFromCart } = useCart()
  const [message, setMessage] = useState('')

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: '/cart' }} />

  const handleCheckout = () => {
    if (!selectedItems.length) {
      alert('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán.')
      return
    }
    navigate('/checkout')
  }

  const handleUpdateQuantity = async (item, nextQuantity) => {
    if (nextQuantity <= 0 && !window.confirm('Bạn muốn xóa sản phẩm này khỏi giỏ hàng?')) return
    const result = await updateQuantity(item.lineId, nextQuantity)
    if (!result.success) setMessage(result.error)
    else setMessage('')
  }

  const handleRemove = async (lineId) => {
    if (!window.confirm('Bạn muốn xóa sản phẩm này khỏi giỏ hàng?')) return
    await removeFromCart(lineId)
    setMessage('')
  }

  return (
    <MainLayout>
      <div className="container page-spacing cart-page">
        <div className="cart-header card">
          <label><input type="checkbox" checked={isAllSelected} onChange={(e) => toggleSelectAll(e.target.checked)} /> Chọn tất cả</label>
          <span>{items.length} sản phẩm</span>
        </div>

        <div className="cart-list">
          {message ? <div className="cart-alert card">{message}</div> : null}
          {items.length === 0 ? (
            <div className="empty-message card">Giỏ hàng đang trống.</div>
          ) : items.map((item) => {
            const stock = item.stock ?? 0
            const isUnavailable = stock <= 0
            return (
              <div key={item.lineId} className={`cart-item card ${isUnavailable ? 'unavailable' : ''}`}>
                <div className="cart-item-main">
                  <input type="checkbox" checked={item.selected} disabled={isUnavailable} onChange={() => toggleSelect(item.lineId)} />
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    {item.variationText ? <p className="cart-item-variation">{item.variationText}</p> : null}
                    <div className="cart-item-price">
                      <span className="current">{formatCurrency(item.price)}</span>
                      <span className="old">{formatCurrency(item.oldPrice)}</span>
                    </div>
                    <small className={isUnavailable ? 'cart-stock-warning' : 'cart-stock-note'}>
                      {isUnavailable ? 'Sản phẩm đã hết hàng hoặc ngừng bán' : `Còn ${stock} sản phẩm`}
                    </small>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button type="button" onClick={() => handleUpdateQuantity(item, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button type="button" disabled={isUnavailable || item.quantity >= stock} onClick={() => handleUpdateQuantity(item, item.quantity + 1)}>+</button>
                  </div>
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                  <button type="button" className="remove-btn" onClick={() => handleRemove(item.lineId)}>Xóa</button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="cart-footer card">
          <div>
            <strong>Đã chọn {selectedCount} sản phẩm</strong>
            <p>Tổng tiền hàng: {formatCurrency(selectedTotal)}</p>
          </div>
          <button type="button" className="checkout-btn" onClick={handleCheckout}>Mua Hàng</button>
        </div>
      </div>
    </MainLayout>
  )
}

export default Cart
