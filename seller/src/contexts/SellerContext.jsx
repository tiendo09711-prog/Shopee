import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import { apiRequest, removeSellerSession } from '../services/apiClient'
import { defaultPickupAddress, initialIdentityInfo, initialShippingSettings, initialTaxInfo } from '../data/seller.mock'
import { getStorageValue, removeStorageValue, setStorageValue } from '../utils/storage'

const DRAFT_KEY = 'pshop_seller_onboarding_draft'
const SellerContext = createContext(null)

export function SellerProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [seller, setSeller] = useState(null)
  const [sellerLoading, setSellerLoading] = useState(false)
  const [draft, setDraft] = useState(() => getStorageValue(DRAFT_KEY, null))

  const loadSeller = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'seller') {
      setSeller(null)
      return
    }
    try {
      setSellerLoading(true)
      const data = await apiRequest('/sellers/me')
      setSeller(data)
    } catch {
      setSeller(null)
    } finally {
      setSellerLoading(false)
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    loadSeller()
  }, [loadSeller])

  const saveDraft = (key, value) => {
    const next = { ...(draft || {}), [key]: value }
    setDraft(next)
    setStorageValue(DRAFT_KEY, next)
  }

  const registerSeller = useCallback(async (payload = {}) => {
    const data = await apiRequest('/sellers/register-shop', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    setSeller(data)
    removeStorageValue(DRAFT_KEY)
    setDraft(null)
    return data
  }, [])

  const updateShopInfo = (payload) => {
    saveDraft('shopInfo', payload)
    return { ...(draft || {}), shopInfo: payload }
  }

  const savePickupAddress = (payload) => {
    saveDraft('pickupAddress', payload)
    return { ...(draft || {}), pickupAddress: payload }
  }

  const updateShippingSettings = (shippingSettings) => {
    saveDraft('shippingSettings', shippingSettings)
    return { ...(draft || {}), shippingSettings }
  }

  const updateIdentityInfo = (payload) => {
    saveDraft('identityInfo', payload)
    return { ...(draft || {}), identityInfo: payload }
  }

  const updateTaxInfo = (payload) => {
    saveDraft('taxInfo', payload)
    return { ...(draft || {}), taxInfo: payload }
  }

  const completeOnboarding = useCallback(async () => {
    const shopInfo = draft?.shopInfo || {}
    return registerSeller({
      shopName: shopInfo.shopName || user?.name || '',
      email: shopInfo.email || user?.email || '',
      phone: shopInfo.phone || user?.phone || '',
      pickupAddress: draft?.pickupAddress || defaultPickupAddress,
      identityInfo: draft?.identityInfo || initialIdentityInfo,
      taxInfo: draft?.taxInfo || initialTaxInfo,
      legalAccepted: true,
    })
  }, [draft, user, registerSeller])

  const refreshSeller = useCallback(() => loadSeller(), [loadSeller])

  // loginSeller now just validates the user has seller role and a shop
  const loginSeller = useCallback((identifier, password, targetUser = user) => {
    if (!targetUser) throw new Error('Hãy đăng nhập tài khoản trước')
    if (targetUser.role !== 'seller') throw new Error('Tài khoản này chưa được đăng ký làm người bán.')
    if (seller?.status === 'locked') throw new Error('Shop đang bị khóa. Vui lòng liên hệ Admin.')
    if (seller?.status === 'rejected') throw new Error(seller.rejectReason || 'Shop đã bị từ chối duyệt.')
    return seller
  }, [seller, user])

  const value = useMemo(() => ({
    seller,
    sellerLoading,
    draft,
    hasSellerAccount: Boolean(seller),
    isSellerReady: Boolean(seller?.status === 'approved'),
    isSellerPendingApproval: Boolean(seller?.status === 'pending_approval'),
    registerSeller,
    loginSeller,
    refreshSeller,
    updateShopInfo,
    savePickupAddress,
    updateShippingSettings,
    updateIdentityInfo,
    updateTaxInfo,
    completeOnboarding,
    defaultPickupAddress,
  }), [seller, sellerLoading, draft, isAuthenticated, user, registerSeller, loginSeller, refreshSeller, completeOnboarding])

  return <SellerContext.Provider value={value}>{children}</SellerContext.Provider>
}

export function useSeller() {
  const context = useContext(SellerContext)
  if (!context) throw new Error('useSeller must be used within SellerProvider')
  return context
}
