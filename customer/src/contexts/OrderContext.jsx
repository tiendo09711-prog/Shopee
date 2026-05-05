import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createOrdersFromCheckout, getOrdersByUser, updateOrderStatus } from '../services/order.service'
import { useAuth } from './AuthContext'
import { useNotifications } from './NotificationContext'

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  const reloadOrders = async () => {
    if (!user?.id) {
      setOrders([])
      return []
    }
    setOrdersLoading(true)
    try {
      const nextOrders = await getOrdersByUser(user.id)
      setOrders(nextOrders)
      return nextOrders
    } finally {
      setOrdersLoading(false)
    }
  }

  useEffect(() => {
    reloadOrders().catch(() => setOrders([]))
  }, [user])

  const placeOrdersFromCheckout = async (payload) => {
    if (!user?.id || !payload?.items?.length) return []
    const created = await createOrdersFromCheckout(user.id, payload)
    await reloadOrders()
    addNotification({
      type: 'order',
      title: 'Đặt hàng thành công',
      message: `Bạn vừa tạo ${created.length} đơn hàng mới.`
    })
    return created
  }

  const changeOrderStatus = async (orderId, status, title = 'Cập nhật đơn hàng') => {
    if (!user?.id) return null
    const updated = await updateOrderStatus(user.id, orderId, status)
    await reloadOrders()
    if (updated) {
      addNotification({
        type: 'order',
        title,
        message: `Đơn ${updated.orderCode || updated.name} đã chuyển sang trạng thái ${updated.status}.`
      })
    }
    return updated
  }

  const value = useMemo(() => ({
    orders,
    ordersLoading,
    reloadOrders,
    placeOrdersFromCheckout,
    changeOrderStatus
  }), [orders, ordersLoading])

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) throw new Error('useOrders must be used within OrderProvider')
  return context
}
