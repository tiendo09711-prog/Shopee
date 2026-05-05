import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { changeUserPassword, getCurrentUser, loginUser, logoutUser, registerUser, updateUserProfile } from '../services/auth.service'
import { getSellerSession, removeSellerSession } from '../services/apiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getSellerSession()
    if (session?.user) {
      setUser(session.user)
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const loggedInUser = await loginUser(email, password)
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const register = useCallback(async (payload) => registerUser(payload), [])

  const logout = useCallback(async () => {
    const session = getSellerSession()
    await logoutUser(session?.refreshToken)
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (payload) => {
    const updatedUser = await updateUserProfile(payload)
    setUser(updatedUser)
    return updatedUser
  }, [])

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    return changeUserPassword(currentPassword, newPassword)
  }, [])

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, register, logout, updateProfile, changePassword }),
    [user, loading, login, register, logout, updateProfile, changePassword],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
