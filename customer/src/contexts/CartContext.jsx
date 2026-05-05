import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { addCartItem, getCartByUser, removeCartItem, updateCartItem } from '../services/cart.service'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [cartLoading, setCartLoading] = useState(false)

  useEffect(() => {
    let active = true
    if (!user?.id) {
      setItems([])
      return undefined
    }

    setCartLoading(true)
    getCartByUser(user.id)
      .then((cartItems) => {
        if (active) setItems(cartItems)
      })
      .catch(() => {
        if (active) setItems([])
      })
      .finally(() => {
        if (active) setCartLoading(false)
      })

    return () => {
      active = false
    }
  }, [user])

  const addToCart = async (product, quantity = 1) => {
    if (!user) return { success: false, error: 'Ban can dang nhap de them san pham vao gio hang.' }
    if (!product || product.stock <= 0) return { success: false, error: 'San pham da het hang.' }

    try {
      const nextItems = await addCartItem(product.id, quantity)
      setItems(nextItems)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const updateQuantity = async (lineId, quantity) => {
    const currentItem = items.find((item) => item.lineId === lineId)
    if (!currentItem) return { success: false, error: 'Khong tim thay san pham trong gio hang.' }

    if (quantity <= 0) {
      await removeFromCart(lineId)
      return { success: true, removed: true }
    }

    try {
      const nextItems = await updateCartItem(currentItem.id, { quantity })
      setItems(nextItems)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const toggleSelect = async (lineId) => {
    const item = items.find((entry) => entry.lineId === lineId)
    if (!item) return
    const previousItems = items
    setItems((prev) => prev.map((entry) => entry.lineId === lineId ? { ...entry, selected: !entry.selected } : entry))
    try {
      const nextItems = await updateCartItem(item.id, { selected: !item.selected })
      setItems(nextItems)
    } catch (error) {
      setItems(previousItems)
    }
  }

  const toggleSelectAll = async (checked) => {
    const previousItems = items
    setItems((prev) => prev.map((item) => ({ ...item, selected: checked })))
    try {
      let nextItems = previousItems
      for (const item of previousItems) {
        nextItems = await updateCartItem(item.id, { selected: checked })
      }
      setItems(nextItems)
    } catch (error) {
      setItems(previousItems)
    }
  }

  const removeFromCart = async (lineId) => {
    const item = items.find((entry) => entry.lineId === lineId)
    if (!item) return
    const previousItems = items
    setItems((prev) => prev.filter((entry) => entry.lineId !== lineId))
    try {
      const nextItems = await removeCartItem(item.id)
      setItems(nextItems)
    } catch (error) {
      setItems(previousItems)
    }
  }

  const clearSelectedItems = () => {
    setItems((prev) => prev.filter((item) => !item.selected))
  }

  const value = useMemo(() => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const selectedItems = items.filter((item) => item.selected)
    const selectedCount = selectedItems.length
    const selectedTotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const isAllSelected = items.length > 0 && items.every((item) => item.selected)
    return {
      items,
      cartLoading,
      totalQuantity,
      totalPrice,
      selectedItems,
      selectedCount,
      selectedTotal,
      isAllSelected,
      addToCart,
      updateQuantity,
      toggleSelect,
      toggleSelectAll,
      removeFromCart,
      clearSelectedItems
    }
  }, [items, cartLoading])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
