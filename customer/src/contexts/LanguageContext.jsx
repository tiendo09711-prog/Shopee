import { createContext, useContext, useMemo, useState } from 'react'
import { getStorageValue, setStorageValue } from '../utils/storage'

const LANG_KEY = 'shopee_clone_language'
const LanguageContext = createContext(null)

const messages = {
  vi: {
    searchPlaceholder: 'Tìm kiếm sản phẩm',
    account: 'Tài khoản của tôi',
    orders: 'Đơn mua',
    logout: 'Đăng xuất',
    login: 'Đăng nhập',
    register: 'Đăng ký',
    language: 'Tiếng Việt',
    english: 'English'
  },
  en: {
    searchPlaceholder: 'Search products',
    account: 'My Account',
    orders: 'Orders',
    logout: 'Log out',
    login: 'Login',
    register: 'Register',
    language: 'Vietnamese',
    english: 'English'
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => getStorageValue(LANG_KEY, 'vi'))
  const changeLanguage = (value) => {
    setLanguage(value)
    setStorageValue(LANG_KEY, value)
  }
  const t = (key) => messages[language]?.[key] || key
  const value = useMemo(() => ({ language, changeLanguage, t }), [language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}