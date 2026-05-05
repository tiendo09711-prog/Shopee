const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const SESSION_KEY = 'pshop_seller_session'

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

export function getSellerSession() {
  return getSession()
}

export function setSellerSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function removeSellerSession() {
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

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || 'Không thể kết nối API')
  }

  return normalizeDoc(payload.data)
}
