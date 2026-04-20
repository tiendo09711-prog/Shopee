import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createOrdersFromCart, getOrdersByUser } from '../services/order.service'
import { useAuth } from './AuthContext'

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    setOrders(getOrdersByUser(user?.id))
  }, [user])

  const placeOrdersFromCart = (items) => {
    if (!user?.id || !items.length) return []
    const created = createOrdersFromCart(user.id, items)
    setOrders(getOrdersByUser(user.id))
    return created
  }

  const value = useMemo(() => ({ orders, placeOrdersFromCart }), [orders])
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) throw new Error('useOrders must be used within OrderProvider')
  return context
}
