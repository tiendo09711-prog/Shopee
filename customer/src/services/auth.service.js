import { apiRequest, resolveApiAssetUrl } from './apiClient'
import { removeStorageValue, setStorageValue } from '../utils/storage'

export const SESSIONS_KEY = 'pshop_sessions'

function normalizeUser(user = {}) {
  const defaultAddress = user.addresses?.find((item) => item.isDefault) || user.addresses?.[0]
  return {
    ...user,
    id: user._id || user.id,
    address: defaultAddress?.fullAddress || user.address || '',
    avatar: resolveApiAssetUrl(user.avatar || ''),
    avatarThumb: resolveApiAssetUrl(user.avatar || user.avatarThumb || ''),
    birthDay: user.birthDay || '1',
    birthMonth: user.birthMonth || '1',
    birthYear: user.birthYear || '1990'
  }
}

function saveSession(data, remember = false) {
  const session = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    token: data.accessToken,
    user: normalizeUser(data.user),
    remember,
    createdAt: new Date().toISOString()
  }
  setStorageValue(SESSIONS_KEY, session)
  return session
}

export function getCurrentSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSIONS_KEY) || 'null')
    if (!session?.user) return null
    return {
      ...session,
      user: normalizeUser(session.user)
    }
  } catch (error) {
    return null
  }
}

export function clearSession() {
  removeStorageValue(SESSIONS_KEY)
}

export async function loginUser(email, password, options = {}) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, rememberMe: Boolean(options.remember) })
  })
  return saveSession(data, Boolean(options.remember)).user
}

export async function registerUser({ name, email, phone, password, confirmPassword, role = 'customer' }) {
  if (password !== confirmPassword) throw new Error('Mật khẩu nhập lại chưa khớp')
  const user = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, phone, password, role })
  })
  return normalizeUser(user)
}

export async function loadCurrentUser() {
  const user = await apiRequest('/auth/me')
  const session = getCurrentSession()
  if (session) setStorageValue(SESSIONS_KEY, { ...session, user: normalizeUser(user) })
  return normalizeUser(user)
}

export async function updateUserProfile(userId, payload) {
  const user = await apiRequest('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload)
  })
  const session = getCurrentSession()
  if (session) setStorageValue(SESSIONS_KEY, { ...session, user: normalizeUser(user) })
  return normalizeUser(user)
}

export async function uploadUserAvatar(file) {
  const formData = new FormData()
  formData.append('avatar', file)
  const user = await apiRequest('/users/me/avatar', {
    method: 'PATCH',
    body: formData
  })
  const session = getCurrentSession()
  if (session) setStorageValue(SESSIONS_KEY, { ...session, user: normalizeUser(user) })
  return normalizeUser(user)
}

export async function changeUserPassword(userId, currentPassword, newPassword, confirmPassword) {
  if (newPassword !== confirmPassword) throw new Error('Mật khẩu nhập lại chưa khớp')
  await apiRequest('/auth/change-password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword })
  })
  clearSession()
  return true
}

export async function requestPasswordReset(email) {
  const data = await apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  })
  return { email, devOtp: data.otp, devToken: data.resetToken, ...data }
}

export async function resetPasswordWithToken(email, token, newPassword, confirmPassword) {
  if (newPassword !== confirmPassword) throw new Error('Mật khẩu nhập lại chưa khớp')
  await apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otp: token, token, newPassword })
  })
  return true
}

export async function logoutUser() {
  const session = getCurrentSession()
  if (session?.refreshToken) {
    await apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: session.refreshToken })
    }).catch(() => null)
  }
  clearSession()
}
