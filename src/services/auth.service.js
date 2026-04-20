import { getStorageValue, setStorageValue } from '../utils/storage'

const USERS_KEY = 'shopee_clone_users'

const defaultUsers = [
  {
    id: 'u_demo',
    email: 'demo@gmail.com',
    password: '123456',
    name: 'hihihi1111',
    phone: '0123123123',
    address: '123123123123',
    birthDay: '1',
    birthMonth: '1',
    birthYear: '1990',
    avatar: '',
    avatarThumb: ''
  }
]

function getUsers() {
  const users = getStorageValue(USERS_KEY, null)
  if (users && Array.isArray(users) && users.length > 0) return users
  setStorageValue(USERS_KEY, defaultUsers)
  return defaultUsers
}

function saveUsers(users) {
  setStorageValue(USERS_KEY, users)
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone || '',
    address: user.address || '',
    birthDay: user.birthDay || '1',
    birthMonth: user.birthMonth || '1',
    birthYear: user.birthYear || '1990',
    avatar: user.avatar || '',
    avatarThumb: user.avatarThumb || user.avatar || ''
  }
}

export function loginUser(email, password) {
  const users = getUsers()
  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase().trim() && item.password === password)
  if (!user) throw new Error('Email hoặc mật khẩu chưa đúng')
  return publicUser(user)
}

export function registerUser({ email, password, confirmPassword }) {
  const users = getUsers()
  const normalizedEmail = email.toLowerCase().trim()
  if (!normalizedEmail) throw new Error('Email không được để trống')
  if (password.length < 6) throw new Error('Mật khẩu phải có ít nhất 6 ký tự')
  if (password !== confirmPassword) throw new Error('Mật khẩu nhập lại chưa khớp')
  if (users.find((item) => item.email.toLowerCase() === normalizedEmail)) throw new Error('Email này đã được đăng ký')

  const name = normalizedEmail.split('@')[0]
  const newUser = { id: `u_${Date.now()}`, email: normalizedEmail, password, name, phone: '', address: '', birthDay: '1', birthMonth: '1', birthYear: '1990', avatar: '', avatarThumb: '' }
  saveUsers([...users, newUser])
  return publicUser(newUser)
}

export function updateUserProfile(userId, payload) {
  const users = getUsers()
  const nextUsers = users.map((item) => item.id === userId ? { ...item, ...payload } : item)
  saveUsers(nextUsers)
  return publicUser(nextUsers.find((item) => item.id === userId))
}

export function changeUserPassword(userId, currentPassword, newPassword, confirmPassword) {
  const users = getUsers()
  const target = users.find((item) => item.id === userId)
  if (!target) throw new Error('Không tìm thấy tài khoản')
  if (target.password !== currentPassword) throw new Error('Mật khẩu hiện tại chưa đúng')
  if (newPassword.length < 6) throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự')
  if (newPassword !== confirmPassword) throw new Error('Mật khẩu nhập lại chưa khớp')
  target.password = newPassword
  saveUsers(users)
  return true
}