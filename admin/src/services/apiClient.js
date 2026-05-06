const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const SESSION_KEY = 'pshop_admin_session'

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

export function getAdminSession() {
  return getSession()
}

export function setAdminSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function removeAdminSession() {
  localStorage.removeItem(SESSION_KEY)
}

// Map MongoDB _id → id for compatibility with existing pages
function normalizeDoc(doc) {
  if (!doc) return doc
  if (Array.isArray(doc)) return doc.map(normalizeDoc)
  if (typeof doc !== 'object') return doc
  const result = { ...doc }
  if (result._id && !result.id) result.id = String(result._id)
  return result
}

export async function apiRequest(path, options = {}) {
  const session = getSession()
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
    ...(options.headers || {}),
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  const payload = await response.json().catch(() => ({}))

  // Token hết hạn hoặc không hợp lệ → xóa session và về trang login
  if (response.status === 401) {
    removeAdminSession()
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login'
    }
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
  }

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || 'Không thể kết nối API')
  }

  return normalizeDoc(payload.data)
}

export function formatCurrency(value = 0) {
  return Number(value || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}
