import ApiError from '../utils/apiError.js'
import User from '../models/User.js'

function sanitizeUser(user) {
  const json = user.toJSON ? user.toJSON() : user
  delete json.password
  delete json.refreshTokens
  return json
}

export async function getProfile(user) {
  return sanitizeUser(user)
}

export async function updateProfile(userId, payload) {
  const user = await User.findById(userId)
  if (!user) throw new ApiError(404, 'User not found')

  if (payload.email && payload.email !== user.email) {
    const normalizedEmail = String(payload.email).toLowerCase().trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new ApiError(400, 'Email is invalid', [{ field: 'email', message: 'Email is invalid' }])
    }
    const emailExists = await User.exists({ _id: { $ne: userId }, email: normalizedEmail })
    if (emailExists) throw new ApiError(409, 'Email already exists', [{ field: 'email', message: 'Email already exists' }])
    user.email = normalizedEmail
  }

  if (payload.phone && payload.phone !== user.phone) {
    if (!/^(0|\+84)[0-9]{9,10}$/.test(String(payload.phone).trim())) {
      throw new ApiError(400, 'Phone is invalid', [{ field: 'phone', message: 'Phone is invalid' }])
    }
    const phoneExists = await User.exists({ _id: { $ne: userId }, phone: payload.phone })
    if (phoneExists) throw new ApiError(409, 'Phone already exists', [{ field: 'phone', message: 'Phone already exists' }])
  }

  user.name = payload.name ?? user.name
  user.phone = payload.phone ?? user.phone
  user.avatar = payload.avatar ?? user.avatar

  if (payload.address || payload.fullAddress) {
    const fullAddress = payload.fullAddress || payload.address
    const currentDefault = user.addresses.find((item) => item.isDefault)
    if (currentDefault) {
      currentDefault.fullName = payload.name || currentDefault.fullName || user.name
      currentDefault.phone = payload.phone || currentDefault.phone || user.phone
      currentDefault.fullAddress = fullAddress
      currentDefault.detail = payload.address || currentDefault.detail
    } else {
      user.addresses.push({
        fullName: payload.name || user.name,
        phone: payload.phone || user.phone,
        fullAddress,
        detail: payload.address || fullAddress,
        isDefault: true
      })
    }
  }

  await user.save()
  return sanitizeUser(user)
}

export async function updateAvatar(userId, avatarPath) {
  const user = await User.findByIdAndUpdate(userId, { avatar: avatarPath }, { new: true })
  if (!user) throw new ApiError(404, 'User not found')
  return sanitizeUser(user)
}
