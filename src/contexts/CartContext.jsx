import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCartByUser, saveCartByUser } from '../services/cart.service'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(getCartByUser(user?.id).map((item) => ({ ...item, selected: item.selected ?? false })))
  }, [user])

  useEffect(() => {
    if (user?.id) saveCartByUser(user.id, items)
  }, [items, user])

  const addToCart = (product, quantity = 1) => {
    if (!user) return false
    setItems((prev) => {
      const existed = prev.find((item) => item.id === product.id)
      if (existed) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
      }
      return [{ id: product.id, slug: product.slug, name: product.name, image: product.images[0], price: product.price, oldPrice: product.oldPrice || product.price, quantity, selected: false }, ...prev]
    })
    return true
  }

  const updateQuantity = (productId, quantity) => {
    setItems((prev) => prev.map((item) => item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item))
  }

  const toggleSelect = (productId) => setItems((prev) => prev.map((item) => item.id === productId ? { ...item, selected: !item.selected } : item))
  const toggleSelectAll = (checked) => setItems((prev) => prev.map((item) => ({ ...item, selected: checked })))
  const removeFromCart = (productId) => setItems((prev) => prev.filter((item) => item.id !== productId))
  const removeSelectedItems = () => setItems((prev) => prev.filter((item) => !item.selected))
  const clearSelectedItems = () => setItems((prev) => prev.filter((item) => !item.selected))

  const value = useMemo(() => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const selectedItems = items.filter((item) => item.selected)
    const selectedCount = selectedItems.length
    const selectedTotal = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const isAllSelected = items.length > 0 && items.every((item) => item.selected)
    return { items, totalQuantity, totalPrice, selectedItems, selectedCount, selectedTotal, isAllSelected, addToCart, updateQuantity, toggleSelect, toggleSelectAll, removeFromCart, removeSelectedItems, clearSelectedItems }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}