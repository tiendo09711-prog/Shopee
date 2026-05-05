import { apiRequest, removeSellerSession, setSellerSession } from './apiClient'

export async function loginUser(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setSellerSession(data)
  return data.user
}

export async function registerUser({ email, password, name, phone }) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name, phone, role: 'seller' }),
  })
}

export async function logoutUser(refreshToken) {
  try {
    if (refreshToken) {
      await apiRequest('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      })
    }
  } finally {
    removeSellerSession()
  }
}

export async function updateUserProfile(payload) {
  return apiRequest('/users/me', { method: 'PATCH', body: JSON.stringify(payload) })
}

export async function changeUserPassword(currentPassword, newPassword) {
  return apiRequest('/auth/change-password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}

export async function getCurrentUser() {
  return apiRequest('/auth/me')
}
