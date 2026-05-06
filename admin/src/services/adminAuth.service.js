import { API_BASE_URL, apiRequest, getAdminSession, removeAdminSession, setAdminSession } from './apiClient'

export { getAdminSession, removeAdminSession }

export async function loginAdmin(email, password) {
  const normalizedEmail = email.toLowerCase().trim()
  if (!normalizedEmail || !password) throw new Error('Vui lòng nhập email và mật khẩu.')

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: normalizedEmail, password }),
  })
  const payload = await response.json().catch(() => ({}))

  if (!response.ok || payload.success === false) {
    if (response.status === 401) {
      throw new Error('Email hoặc mật khẩu admin không đúng. Tài khoản demo: admin@pshop.vn / admin123456')
    }
    throw new Error(payload.message || 'Không thể đăng nhập admin.')
  }

  const data = payload.data
  if (data.user?.role !== 'admin') {
    throw new Error('Tài khoản này không có quyền admin.')
  }

  setAdminSession(data)
  return data
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
