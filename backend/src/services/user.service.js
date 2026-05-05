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

  if (payload.phone && payload.phone !== user.phone) {
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
