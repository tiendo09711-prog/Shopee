import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { getWishlistIdsByUser, getWishlistProductsByUser, toggleWishlistProduct } from '../services/wishlist.service'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlistIds, setWishlistIds] = useState([])
  const [wishlistProducts, setWishlistProducts] = useState([])

  useEffect(() => {
    if (!user?.id) {
      setWishlistIds([])
      setWishlistProducts([])
      return
    }
    setWishlistIds(getWishlistIdsByUser(user.id))
    setWishlistProducts(getWishlistProductsByUser(user.id))
  }, [user])

  const toggleWishlist = (productId) => {
    if (!user?.id) return false
    const next = toggleWishlistProduct(user.id, productId)
    setWishlistIds(next)
    setWishlistProducts(getWishlistProductsByUser(user.id))
    return true
  }

  const value = useMemo(() => ({
    wishlistIds,
    wishlistProducts,
    isWishlisted: (productId) => wishlistIds.includes(productId),
    toggleWishlist
  }), [wishlistIds, wishlistProducts])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}