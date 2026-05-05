const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
const SESSION_KEY = 'pshop_sessions'

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch (error) {
    return null
  }
}

export function getApiBaseUrl() {
  return API_BASE_URL
}

export async function apiRequest(path, options = {}) {
  const session = getSession()
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
    ...(options.headers || {})
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok || payload.success === false) {
    const message = payload.message || 'Không thể kết nối API'
    throw new Error(message)
  }

  return payload.data
}
