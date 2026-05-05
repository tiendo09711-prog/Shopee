import { apiRequest, getAdminSession, removeAdminSession, setAdminSession } from './apiClient'

export { getAdminSession }

export async function loginAdmin(email, password) {
  const normalizedEmail = email.toLowerCase().trim()
  if (!normalizedEmail || !password) throw new Error('Vui lòng nhập email và mật khẩu.')

  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: normalizedEmail, password }),
  })

  if (data.user?.role !== 'admin') {
    throw new Error('Tài khoản này không có quyền admin.')
  }

  setAdminSession(data)
  return { token: data.accessToken, user: data.user }
}

export async function logoutAdmin() {
  try {
    const session = getAdminSession()
    if (session?.refreshToken) {
      await apiRequest('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      })
    }
  } finally {
    removeAdminSession()
  }
}
