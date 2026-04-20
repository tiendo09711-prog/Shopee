import { Link, Navigate, useNavigate } from 'react-router-dom'
import MainLayout from '../../layout/MainLayout'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useOrders } from '../../contexts/OrderContext'
import { formatCurrency } from '../../utils/formatCurrency'
import './Cart.css'

function Cart() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { items, selectedItems, selectedCount, selectedTotal, isAllSelected, updateQuantity, toggleSelect, toggleSelectAll, removeFromCart, removeSelectedItems, clearSelectedItems } = useCart()
  const { placeOrdersFromCart } = useOrders()

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: '/cart' }} />

  const handleDeleteSelected = () => {
    if (!selectedCount) return
    const confirmed = window.confirm(`Bạn muốn xóa ${selectedCount} sản phẩm đã chọn?`)
    if (confirmed) removeSelectedItems()
  }

  const handlePurchase = () => {
    if (!selectedCount) {
      alert('Vui lòng chọn ít nhất 1 sản phẩm')
      return
    }
    placeOrdersFromCart(selectedItems)
    clearSelectedItems()
    alert('Mua thành công')
    navigate('/user/purchase')
  }

  return (
    <MainLayout>
      <div className="container page-spacing">
        <section className="cart-page card">
          <div className="cart-header-row">
            <label className="cart-checkbox-label"><input type="checkbox" checked={isAllSelected} onChange={(e) => toggleSelectAll(e.target.checked)} /><span>Sản Phẩm</span></label>
            <span>Đơn Giá</span><span>Số Lượng</span><span>Số Tiền</span><span>Thao Tác</span>
          </div>
          {items.length === 0 ? (
            <div className="empty-message">Giỏ hàng của bạn đang trống. <Link to="/">Mua ngay</Link></div>
          ) : (
            items.map((item) => (
              <div key={item.id} className={`cart-item-row ${item.selected ? 'selected' : ''}`}>
                <div className="cart-product-info">
                  <input type="checkbox" checked={item.selected} onChange={() => toggleSelect(item.id)} />
                  <img src={item.image} alt={item.name} />
                  <Link to={`/product/${item.slug}`}>{item.name}</Link>
                </div>
                <div><span className="cart-old-price">{formatCurrency(item.oldPrice)}</span> {formatCurrency(item.price)}</div>
                <div className="cart-quantity-box"><button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button><span>{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button></div>
                <div className="cart-subtotal">{formatCurrency(item.price * item.quantity)}</div>
                <button type="button" className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>Xóa</button>
              </div>
            ))
          )}
        </section>

        <section className="cart-summary card">
          <div className="cart-summary-left">
            <label className="cart-checkbox-label"><input type="checkbox" checked={isAllSelected} onChange={(e) => toggleSelectAll(e.target.checked)} /><span>Chọn Tất Cả ({items.length})</span></label>
            <button type="button" className="cart-remove-btn" onClick={handleDeleteSelected}>Xóa</button>
          </div>
          <div className="cart-summary-right">
            <div><strong>Tổng thanh toán ({selectedCount} sản phẩm)</strong><span>{formatCurrency(selectedTotal)}</span></div>
            <button type="button" onClick={handlePurchase}>Mua Hàng</button>
          </div>
        </section>
      </div>
    </MainLayout>
  )
}

export default Cart