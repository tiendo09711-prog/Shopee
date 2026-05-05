import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  changeUserPassword,
  clearSession,
  getCurrentSession,
  loadCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
  resetPasswordWithToken,
  updateUserProfile
} from '../services/auth.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentSession()?.user || null)
  const [authLoading, setAuthLoading] = useState(Boolean(getCurrentSession()?.accessToken))

  useEffect(() => {
    let active = true
    if (!getCurrentSession()?.accessToken) {
      setAuthLoading(false)
      return undefined
    }

    loadCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser)
      })
      .catch(() => {
        clearSession()
        if (active) setUser(null)
      })
      .finally(() => {
        if (active) setAuthLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const login = async (email, password, options) => {
    const loggedInUser = await loginUser(email, password, options)
    setUser(loggedInUser)
    return loggedInUser
  }

  const register = (payload) => registerUser(payload)

  const logout = async () => {
    setUser(null)
    await logoutUser()
  }

  const updateProfile = async (payload) => {
    const updatedUser = await updateUserProfile(user.id, payload)
    setUser(updatedUser)
    return updatedUser
  }

  const changePassword = async (currentPassword, newPassword, confirmPassword) => {
    await changeUserPassword(user.id, currentPassword, newPassword, confirmPassword)
    setUser(null)
    return true
  }

  const value = useMemo(() => ({
    user,
    authLoading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
    resetPassword: resetPasswordWithToken
  }), [user, authLoading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
