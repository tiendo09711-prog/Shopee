import { createContext, useContext, useMemo, useState } from 'react'
import { getAdminSession, loginAdmin, logoutAdmin } from '../services/adminAuth.service'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(() => getAdminSession())

  const login = (email, password) => {
    const next = loginAdmin(email, password)
    setSession(next)
    return next
  }

  const logout = () => {
    logoutAdmin()
    setSession(null)
  }

  const value = useMemo(() => ({
    session,
    user: session?.user || null,
    isAuthenticated: Boolean(session?.user),
    login,
    logout,
  }), [session])

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return context
}
