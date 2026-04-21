import { createContext, useContext, useMemo, useState } from 'react'
import { changeUserPassword, loginUser, registerUser, updateUserProfile } from '../services/auth.service'
import { getStorageValue, removeStorageValue, setStorageValue } from '../utils/storage'

const USER_KEY = 'shopee_clone_current_user'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStorageValue(USER_KEY, null))

  const login = (email, password) => {
    const loggedInUser = loginUser(email, password)
    setUser(loggedInUser)
    setStorageValue(USER_KEY, loggedInUser)
    return loggedInUser
  }

  const register = (payload) => registerUser(payload)

  const logout = () => {
    setUser(null)
    removeStorageValue(USER_KEY)
  }

  const updateProfile = (payload) => {
    const updatedUser = updateUserProfile(user.id, payload)
    setUser(updatedUser)
    setStorageValue(USER_KEY, updatedUser)
    return updatedUser
  }

  const changePassword = (currentPassword, newPassword, confirmPassword) => {
    changeUserPassword(user.id, currentPassword, newPassword, confirmPassword)
    return true
  }

  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), login, register, logout, updateProfile, changePassword }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}