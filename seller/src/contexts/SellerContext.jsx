import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'
import {
  defaultPickupAddress,
  initialIdentityInfo,
  initialShippingSettings,
  initialTaxInfo,
  sellerDemoStats,
} from '../data/seller.mock'
import { sellerOrdersMock } from '../data/sellerOrders.mock'
import { sellerProductsMock } from '../data/sellerProducts.mock'
import { getStorageValue, setStorageValue } from '../utils/storage'

const SELLERS_KEY = 'pshop_sellers'
const LEGACY_SELLERS_KEY = 'shopee_clone_sellers'
const SellerContext = createContext(null)

function buildDefaultSeller(user) {
  const now = new Date().toISOString()
  return {
    id: `seller_${user.id}`,
    userId: user.id,
    email: user.email,
    sellerPassword: '123456',
    shopName: user.name || user.email.split('@')[0],
    isSeller: true,
    status: 'draft',
    rejectReason: '',
    legalAgreementAccepted: false,
    onboardingStep: 0,
    onboardingCompleted: false,
    shopInfo: {
      shopName: user.name || user.email.split('@')[0],
      email: user.email,
      phone: user.phone || '+84328526559',
    },
    pickupAddress: null,
    shippingSettings: initialShippingSettings,
    identityInfo: initialIdentityInfo,
    taxInfo: initialTaxInfo,
    stats: sellerDemoStats,
    products: sellerProductsMock,
    orders: sellerOrdersMock,
    createdAt: now,
    updatedAt: now,
  }
}

function normalizeSeller(seller) {
  if (!seller) return null
  return {
    ...seller,
    id: seller.id || `seller_${seller.userId}`,
    status: seller.status || (seller.onboardingCompleted ? 'approved' : 'draft'),
    rejectReason: seller.rejectReason || '',
    legalAgreementAccepted: seller.legalAgreementAccepted ?? true,
    createdAt: seller.createdAt || new Date().toISOString(),
    updatedAt: seller.updatedAt || seller.createdAt || new Date().toISOString(),
  }
}

function getSellerMap() {
  const current = getStorageValue(SELLERS_KEY, null)
  if (current && typeof current === 'object') return current
  const legacy = getStorageValue(LEGACY_SELLERS_KEY, null)
  if (legacy && typeof legacy === 'object') {
    const normalizedLegacy = Object.fromEntries(Object.entries(legacy).map(([key, value]) => [key, normalizeSeller(value)]))
    setStorageValue(SELLERS_KEY, normalizedLegacy)
    return normalizedLegacy
  }
  return {
    u_demo: {
      id: 'seller_u_demo',
      userId: 'u_demo',
      email: 'demo@gmail.com',
      sellerPassword: '123456',
      shopName: 'demo_shop',
      isSeller: true,
      status: 'approved',
      rejectReason: '',
      legalAgreementAccepted: true,
      onboardingStep: 5,
      onboardingCompleted: true,
      shopInfo: {
        shopName: 'demo_shop',
        email: 'demo@gmail.com',
        phone: '0123123123',
      },
      pickupAddress: defaultPickupAddress,
      shippingSettings: initialShippingSettings,
      identityInfo: initialIdentityInfo,
      taxInfo: initialTaxInfo,
      stats: sellerDemoStats,
      products: sellerProductsMock,
      orders: sellerOrdersMock,
      createdAt: '2026-04-20T00:00:00.000Z',
      updatedAt: '2026-04-20T00:00:00.000Z',
    },
  }
}

function saveSellerMap(map) {
  setStorageValue(SELLERS_KEY, map)
}

export function SellerProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [sellerMap, setSellerMap] = useState(() => getSellerMap())

  useEffect(() => {
    saveSellerMap(sellerMap)
  }, [sellerMap])

  const seller = user ? normalizeSeller(sellerMap[user.id]) : null

  const registerSeller = (payload = {}, targetUser = user) => {
    if (!targetUser) throw new Error('Bạn cần đăng nhập tài khoản mua trước')
    const nextSeller = {
      ...buildDefaultSeller(targetUser),
      shopName: payload.shopName || targetUser.name || targetUser.email.split('@')[0],
      phone: payload.phone || targetUser.phone || '',
      pickupAddress: payload.pickupAddress || null,
      identityInfo: payload.identityInfo || initialIdentityInfo,
      taxInfo: payload.taxInfo || initialTaxInfo,
      legalAgreementAccepted: Boolean(payload.legalAgreementAccepted),
      shopInfo: {
        shopName: payload.shopName || targetUser.name || targetUser.email.split('@')[0],
        email: payload.email || targetUser.email,
        phone: payload.phone || targetUser.phone || '',
      },
    }
    setSellerMap((prev) => ({ ...prev, [targetUser.id]: nextSeller }))
    return nextSeller
  }

  const ensureSeller = () => {
    if (!user) throw new Error('Bạn cần đăng nhập')
    if (seller) return seller
    return registerSeller()
  }

  const loginSeller = (identifier, password, targetUser = user) => {
    if (!targetUser) throw new Error('Hãy đăng nhập tài khoản mua trước')
    const currentSeller = sellerMap[targetUser.id]
    if (!currentSeller) throw new Error('Tài khoản này chưa đăng ký bán hàng')
    if (currentSeller.status === 'locked') throw new Error('Shop đang bị khóa. Vui lòng liên hệ Admin.')
    if (currentSeller.status === 'rejected') throw new Error(currentSeller.rejectReason || 'Shop đã bị từ chối duyệt.')
    const matchedIdentifier = [currentSeller.email, currentSeller.shopName, targetUser.email, targetUser.name]
      .filter(Boolean)
      .some((item) => item.toLowerCase() === identifier.trim().toLowerCase())

    if (!matchedIdentifier || currentSeller.sellerPassword !== password) {
      throw new Error('Thông tin đăng nhập người bán chưa đúng')
    }

    return currentSeller
  }

  const updateShopInfo = (payload) => {
    const current = ensureSeller()
    const next = {
      ...current,
      shopInfo: { ...current.shopInfo, ...payload },
      shopName: payload.shopName || current.shopName,
      email: payload.email || current.email,
      phone: payload.phone || current.phone,
      onboardingStep: Math.max(current.onboardingStep, 1),
      updatedAt: new Date().toISOString(),
    }
    setSellerMap((prev) => ({ ...prev, [user.id]: next }))
    return next
  }

  const savePickupAddress = (payload) => {
    const current = ensureSeller()
    const next = {
      ...current,
      pickupAddress: payload,
      onboardingStep: Math.max(current.onboardingStep, 1),
      updatedAt: new Date().toISOString(),
    }
    setSellerMap((prev) => ({ ...prev, [user.id]: next }))
    return next
  }

  const updateShippingSettings = (shippingSettings) => {
    const current = ensureSeller()
    const next = {
      ...current,
      shippingSettings,
      onboardingStep: Math.max(current.onboardingStep, 2),
      updatedAt: new Date().toISOString(),
    }
    setSellerMap((prev) => ({ ...prev, [user.id]: next }))
    return next
  }

  const updateIdentityInfo = (payload) => {
    const current = ensureSeller()
    const next = {
      ...current,
      identityInfo: { ...current.identityInfo, ...payload },
      onboardingStep: Math.max(current.onboardingStep, 3),
      updatedAt: new Date().toISOString(),
    }
    setSellerMap((prev) => ({ ...prev, [user.id]: next }))
    return next
  }

  const updateTaxInfo = (payload) => {
    const current = ensureSeller()
    const next = {
      ...current,
      taxInfo: { ...current.taxInfo, ...payload },
      onboardingStep: Math.max(current.onboardingStep, 4),
      updatedAt: new Date().toISOString(),
    }
    setSellerMap((prev) => ({ ...prev, [user.id]: next }))
    return next
  }

  const completeOnboarding = () => {
    const current = ensureSeller()
    const next = {
      ...current,
      onboardingStep: 5,
      onboardingCompleted: true,
      status: current.status === 'approved' ? 'approved' : 'pending_approval',
      updatedAt: new Date().toISOString(),
    }
    setSellerMap((prev) => ({ ...prev, [user.id]: next }))
    return next
  }

  const value = useMemo(
    () => ({
      seller,
      hasSellerAccount: Boolean(seller),
      isSellerReady: Boolean(seller?.onboardingCompleted && seller?.status === 'approved'),
      isSellerPendingApproval: Boolean(seller?.status === 'pending_approval'),
      registerSeller,
      loginSeller,
      ensureSeller,
      updateShopInfo,
      savePickupAddress,
      updateShippingSettings,
      updateIdentityInfo,
      updateTaxInfo,
      completeOnboarding,
      defaultPickupAddress,
    }),
    [seller, isAuthenticated, user],
  )

  return <SellerContext.Provider value={value}>{children}</SellerContext.Provider>
}

export function useSeller() {
  const context = useContext(SellerContext)
  if (!context) throw new Error('useSeller must be used within SellerProvider')
  return context
}
