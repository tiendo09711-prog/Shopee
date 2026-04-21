import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createOrdersFromCheckout, getOrdersByUser, updateOrderStatus } from '../services/order.service'
import { useAuth } from './AuthContext'
import { useNotifications } from './NotificationContext'

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    setOrders(getOrdersByUser(user?.id))
  }, [user])

  const placeOrdersFromCheckout = (payload) => {
    if (!user?.id || !payload?.items?.length) return []
    const created = createOrdersFromCheckout(user.id, payload)
    setOrders(getOrdersByUser(user.id))
    addNotification({
      type: 'order',
      title: 'Đặt hàng thành công',
      message: `Bạn vừa tạo ${created.length} đơn hàng mới.`
    })
    return created
  }

  const changeOrderStatus = (orderId, status, title = 'Cập nhật đơn hàng') => {
    if (!user?.id) return null
    const updated = updateOrderStatus(user.id, orderId, status)
    setOrders(getOrdersByUser(user.id))
    if (updated) {
      addNotification({
        type: 'order',
        title,
        message: `Đơn ${updated.name} đã chuyển sang trạng thái ${updated.status}.`
      })
    }
    return updated
  }

  const value = useMemo(() => ({
    orders,
    placeOrdersFromCheckout,
    changeOrderStatus
  }), [orders])

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) throw new Error('useOrders must be used within OrderProvider')
  return context
}