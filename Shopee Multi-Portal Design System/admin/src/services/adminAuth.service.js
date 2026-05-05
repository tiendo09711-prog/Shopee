import { getStorageValue, removeStorageValue, setStorageValue } from '../utils/storage'

const ADMIN_SESSION_KEY = 'pshop_admin_session'

const defaultAdmin = {
  id: 'admin_default',
  email: 'admin@pshop.vn',
  password: 'admin123456',
  name: 'PShop Admin',
  role: 'admin',
  status: 'active',
}

export function getAdminSession() {
  return getStorageValue(ADMIN_SESSION_KEY, null)
}

export function loginAdmin(email, password) {
  const normalizedEmail = email.toLowerCase().trim()
  if (!normalizedEmail || !password) throw new Error('Vui lòng nhập email và mật khẩu.')
  if (password.length < 8) throw new Error('Mật khẩu admin phải có ít nhất 8 ký tự.')
  if (normalizedEmail !== defaultAdmin.email || password !== defaultAdmin.password) throw new Error('Thông tin đăng nhập admin không đúng.')
  const session = {
    token: `admin_${Date.now()}`,
    user: { id: defaultAdmin.id, email: defaultAdmin.email, name: defaultAdmin.name, role: defaultAdmin.role },
    createdAt: new Date().toISOString(),
  }
  setStorageValue(ADMIN_SESSION_KEY, session)
  return session
}

export function logoutAdmin() {
  removeStorageValue(ADMIN_SESSION_KEY)
}
