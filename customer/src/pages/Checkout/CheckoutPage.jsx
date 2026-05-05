import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import MainLayout from '../../layout/MainLayout'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useOrders } from '../../contexts/OrderContext'
import { formatCurrency } from '../../utils/formatCurrency'
import { calculateVoucherDiscount, getPlatformVouchers, getShopVouchers } from '../../services/voucher.service'
import './CheckoutPage.css'

const shippingOptions = [
  { id: 'spx', label: 'SPX Express', fee: 32000 },
  { id: 'ghtk', label: 'Giao Hàng Tiết Kiệm', fee: 28000 },
  { id: 'grab', label: 'GrabExpress', fee: 45000 }
]

const paymentMethods = [
  { id: 'cod', label: 'Thanh toán khi nhận hàng' },
  { id: 'wallet', label: 'ShopeePay' },
  { id: 'spaylater', label: 'SPayLater' },
  { id: 'card', label: 'Thẻ tín dụng/Ghi nợ' }
]

function buildInitialAddresses(user) {
  if (!user?.address && !user?.phone) return []
  return [{
    id: 'profile_address',
    name: user?.name || '',
    phone: user?.phone || '',
    fullAddress: user?.address || '',
    isDefault: true
  }]
}

function createEmptyAddress(user) {
  return {
    name: user?.name || '',
    phone: user?.phone || '',
    fullAddress: ''
  }
}

function CheckoutPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { selectedItems, selectedTotal, clearSelectedItems } = useCart()
  const { placeOrdersFromCheckout } = useOrders()

  const [addresses, setAddresses] = useState(() => buildInitialAddresses(user))
  const [addressId, setAddressId] = useState(() => buildInitialAddresses(user)[0]?.id || '')
  const [showAddressForm, setShowAddressForm] = useState(() => buildInitialAddresses(user).length === 0)
  const [editingAddressId, setEditingAddressId] = useState('')
  const [addressForm, setAddressForm] = useState(() => createEmptyAddress(user))
  const [shippingId, setShippingId] = useState(shippingOptions[0].id)
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id)
  const [selectedVoucherCodes, setSelectedVoucherCodes] = useState([])
  const [notes, setNotes] = useState('')
  const [message, setMessage] = useState('')

  const vouchers = [...getPlatformVouchers(), ...getShopVouchers()]
  const shipping = shippingOptions.find((item) => item.id === shippingId) || shippingOptions[0]
  const voucherResult = calculateVoucherDiscount(selectedTotal, shipping.fee, selectedVoucherCodes)
  const finalTotal = Math.max(0, selectedTotal + shipping.fee - voucherResult.shippingDiscount - voucherResult.discount)
  const activeAddress = addresses.find((item) => item.id === addressId)

  const selectedCount = useMemo(() => selectedItems.reduce((sum, item) => sum + item.quantity, 0), [selectedItems])

  useEffect(() => {
    const nextAddresses = buildInitialAddresses(user)
    setAddresses((prev) => prev.length > 0 ? prev : nextAddresses)
    setAddressId((prev) => prev || nextAddresses[0]?.id || '')
    setShowAddressForm((prev) => prev || nextAddresses.length === 0)
  }, [user])

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: '/checkout' }} />
  if (!selectedItems.length) return <Navigate to="/cart" replace />

  const toggleVoucher = (code) => {
    setSelectedVoucherCodes((prev) => prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code])
  }

  const handleAddressFormChange = (key, value) => {
    setAddressForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleAddAddress = () => {
    setEditingAddressId('')
    setAddressForm(createEmptyAddress(user))
    setShowAddressForm(true)
    setMessage('')
  }

  const handleEditAddress = (address) => {
    setEditingAddressId(address.id)
    setAddressForm({ name: address.name, phone: address.phone, fullAddress: address.fullAddress })
    setShowAddressForm(true)
    setMessage('')
  }

  const handleSaveAddress = () => {
    if (!addressForm.name.trim()) {
      setMessage('Vui lòng nhập tên người nhận.')
      return
    }
    if (!addressForm.phone.trim()) {
      setMessage('Vui lòng nhập số điện thoại nhận hàng.')
      return
    }
    if (!/^(0|\+84)[0-9]{9,10}$/.test(addressForm.phone.trim())) {
      setMessage('Số điện thoại nhận hàng không hợp lệ.')
      return
    }
    if (!addressForm.fullAddress.trim()) {
      setMessage('Vui lòng nhập địa chỉ nhận hàng.')
      return
    }

    const nextAddress = {
      id: editingAddressId || `adr_${Date.now()}`,
      name: addressForm.name.trim(),
      phone: addressForm.phone.trim(),
      fullAddress: addressForm.fullAddress.trim(),
      isDefault: addresses.length === 0
    }
    setAddresses((prev) => editingAddressId
      ? prev.map((item) => item.id === editingAddressId ? nextAddress : item)
      : [...prev, nextAddress])
    setAddressId(nextAddress.id)
    setShowAddressForm(false)
    setEditingAddressId('')
    setMessage('')
  }

  const handlePlaceOrder = async () => {
    try {
      const created = await placeOrdersFromCheckout({
        items: selectedItems,
        address: activeAddress,
        paymentMethod,
        shippingProvider: shipping.label,
        shippingFee: shipping.fee,
        voucherCodes: selectedVoucherCodes,
        discount: voucherResult.discount,
        shippingDiscount: voucherResult.shippingDiscount,
        notes
      })

      if (!created.length) {
        setMessage('Không thể tạo đơn hàng.')
        return
      }

      clearSelectedItems()
      navigate('/user/purchase')
    } catch (error) {
      setMessage(error.message)
      return
    }
  }

  return (
    <MainLayout>
      <div className="container page-spacing checkout-page">
        <div className="checkout-main">
          <section className="card checkout-section">
            <h2>Địa chỉ nhận hàng</h2>
            {message ? <div className="checkout-alert">{message}</div> : null}
            <div className="checkout-address-list">
              {addresses.map((address) => (
                <label key={address.id} className={`checkout-select-card ${addressId === address.id ? 'active' : ''}`}>
                  <input type="radio" name="address" checked={addressId === address.id} onChange={() => setAddressId(address.id)} />
                  <div>
                    <strong>{address.name} · {address.phone}</strong>
                    <p>{address.fullAddress}</p>
                    {address.isDefault ? <span className="checkout-badge">Mặc định</span> : null}
                    <button type="button" className="checkout-inline-btn" onClick={(event) => { event.preventDefault(); handleEditAddress(address) }}>Sửa</button>
                  </div>
                </label>
              ))}
            </div>
            {showAddressForm ? (
              <div className="checkout-address-form">
                <input value={addressForm.name} onChange={(e) => handleAddressFormChange('name', e.target.value)} placeholder="Tên người nhận" />
                <input value={addressForm.phone} onChange={(e) => handleAddressFormChange('phone', e.target.value)} placeholder="Số điện thoại" />
                <textarea value={addressForm.fullAddress} onChange={(e) => handleAddressFormChange('fullAddress', e.target.value)} placeholder="Địa chỉ đầy đủ" />
                <div className="checkout-address-actions">
                  <button type="button" onClick={handleSaveAddress}>{editingAddressId ? 'Lưu địa chỉ' : 'Thêm địa chỉ'}</button>
                  {addresses.length > 0 ? <button type="button" className="secondary" onClick={() => setShowAddressForm(false)}>Hủy</button> : null}
                </div>
              </div>
            ) : (
              <button type="button" className="checkout-add-address-btn" onClick={handleAddAddress}>+ Thêm địa chỉ mới</button>
            )}
          </section>

          <section className="card checkout-section">
            <h2>Sản phẩm thanh toán</h2>
            <div className="checkout-item-list">
              {selectedItems.map((item) => (
                <div key={item.lineId} className="checkout-item-row">
                  <div className="checkout-item-info">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <h4>{item.name}</h4>
                      {item.variationText ? <p>{item.variationText}</p> : null}
                      <small>x{item.quantity}</small>
                    </div>
                  </div>
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="card checkout-section">
            <h2>Vận chuyển</h2>
            <div className="checkout-option-list">
              {shippingOptions.map((option) => (
                <label key={option.id} className={`checkout-select-card ${shippingId === option.id ? 'active' : ''}`}>
                  <input type="radio" name="shipping" checked={shippingId === option.id} onChange={() => setShippingId(option.id)} />
                  <div>
                    <strong>{option.label}</strong>
                    <p>Phí vận chuyển: {formatCurrency(option.fee)}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section className="card checkout-section">
            <h2>Voucher</h2>
            <div className="checkout-option-list">
              {vouchers.map((voucher) => (
                <label key={voucher.code} className={`checkout-select-card ${selectedVoucherCodes.includes(voucher.code) ? 'active' : ''}`}>
                  <input type="checkbox" checked={selectedVoucherCodes.includes(voucher.code)} onChange={() => toggleVoucher(voucher.code)} />
                  <div>
                    <strong>{voucher.code}</strong>
                    <p>{voucher.label} · Tối thiểu {formatCurrency(voucher.minSpend)}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section className="card checkout-section">
            <h2>Thanh toán</h2>
            <div className="checkout-option-list">
              {paymentMethods.map((method) => (
                <label key={method.id} className={`checkout-select-card ${paymentMethod === method.id ? 'active' : ''}`}>
                  <input type="radio" name="payment" checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} />
                  <div>
                    <strong>{method.label}</strong>
                  </div>
                </label>
              ))}
            </div>

            <textarea
              className="checkout-note"
              placeholder="Lời nhắn cho shop / ghi chú giao hàng"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </section>
        </div>

        <aside className="card checkout-summary">
          <h3>Tóm tắt đơn hàng</h3>
          <div className="checkout-summary-row"><span>Số lượng</span><strong>{selectedCount} sản phẩm</strong></div>
          <div className="checkout-summary-row"><span>Tiền hàng</span><strong>{formatCurrency(selectedTotal)}</strong></div>
          <div className="checkout-summary-row"><span>Phí vận chuyển</span><strong>{formatCurrency(shipping.fee)}</strong></div>
          <div className="checkout-summary-row"><span>Giảm giá sản phẩm</span><strong>- {formatCurrency(voucherResult.discount)}</strong></div>
          <div className="checkout-summary-row"><span>Giảm phí ship</span><strong>- {formatCurrency(voucherResult.shippingDiscount)}</strong></div>
          <div className="checkout-summary-row total"><span>Tổng thanh toán</span><strong>{formatCurrency(finalTotal)}</strong></div>
          <button type="button" className="place-order-btn" onClick={handlePlaceOrder}>Đặt hàng</button>
        </aside>
      </div>
    </MainLayout>
  )
}

export default CheckoutPage
