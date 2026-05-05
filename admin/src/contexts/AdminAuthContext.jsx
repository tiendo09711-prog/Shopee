import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getAdminSession, loginAdmin, logoutAdmin } from '../services/adminAuth.service'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const existing = getAdminSession()
    if (existing?.user) setSession(existing)
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const next = await loginAdmin(email, password)
    setSession(next)
    return next
  }

  const logout = async () => {
    await logoutAdmin()
    setSession(null)
  }

  const value = useMemo(() => ({
    session,
    loading,
    user: session?.user || null,
    isAuthenticated: Boolean(session?.user),
    login,
    logout,
  }), [session, loading])

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return context
}
