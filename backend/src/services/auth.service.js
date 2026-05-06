import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import ApiError from '../utils/apiError.js'
import User from '../models/User.js'
import PasswordResetToken from '../models/PasswordResetToken.js'
import { env } from '../config/env.js'
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js'

const MAX_FAILED_LOGIN = 5
const RESET_LIMIT_PER_HOUR = 3

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function parseExpiresToMs(value, fallbackMs) {
  const match = String(value || '').match(/^(\d+)([smhd])$/)
  if (!match) return fallbackMs

  const amount = Number(match[1])
  const unit = match[2]
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  }
  return amount * multipliers[unit]
}

function sanitizeUser(user) {
  const json = user.toJSON ? user.toJSON() : user
  delete json.password
  delete json.refreshTokens
  return json
}

function buildAuthPayload(user, refreshToken) {
  return {
    accessToken: generateAccessToken(user),
    refreshToken,
    user: sanitizeUser(user)
  }
}

async function attachRefreshToken(user, refreshToken, req) {
  const expiresAt = new Date(Date.now() + parseExpiresToMs(env.jwtRefreshExpires, 7 * 24 * 60 * 60 * 1000))
  const tokenHash = hashToken(refreshToken)

  user.refreshTokens = [
    ...(user.refreshTokens || []).filter((item) => !item.expiresAt || item.expiresAt > new Date()),
    {
      tokenHash,
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || '',
      createdAt: new Date(),
      expiresAt
    }
  ]
  await user.save()
}

export async function register({ name, email, phone, password, role }) {
  const normalizedEmail = String(email || '').toLowerCase().trim()
  const normalizedPhone = String(phone || '').trim()

  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { phone: normalizedPhone }]
  })

  if (existingUser?.email === normalizedEmail) {
    throw new ApiError(409, 'Email already exists', [{ field: 'email', message: 'Email already exists' }])
  }

  if (existingUser?.phone === normalizedPhone) {
    throw new ApiError(409, 'Phone already exists', [{ field: 'phone', message: 'Phone already exists' }])
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    phone: normalizedPhone,
    password,
    role
  })

  return sanitizeUser(user)
}

export async function login({ email, password }, req) {
  const identifier = String(email || '').trim()
  const normalizedEmail = identifier.toLowerCase()
  const user = await User.findOne({
    $or: [
      { email: normalizedEmail },
      { phone: identifier }
    ]
  }).select('+password +refreshTokens')

  if (!user) throw new ApiError(401, 'Invalid email or password')
  if (user.status !== 'active') throw new ApiError(403, 'Account is not active')

  const passwordMatched = await user.comparePassword(password)

  if (!passwordMatched) {
    user.failedLoginCount += 1
    if (user.failedLoginCount >= MAX_FAILED_LOGIN) {
      user.status = 'locked'
      user.lockedReason = 'Too many failed login attempts'
    }
    await user.save()
    throw new ApiError(user.status === 'locked' ? 403 : 401, user.status === 'locked' ? 'Account locked after too many failed attempts' : 'Invalid email or password')
  }

  user.failedLoginCount = 0
  user.lockedReason = ''
  user.lastLoginAt = new Date()
  const refreshToken = generateRefreshToken(user)
  await attachRefreshToken(user, refreshToken, req)

  return buildAuthPayload(user, refreshToken)
}

export async function refresh(refreshToken, req) {
  let payload
  try {
    payload = jwt.verify(refreshToken, env.jwtRefreshSecret)
  } catch (error) {
    throw new ApiError(401, 'Invalid refresh token')
  }

  if (payload.type !== 'refresh') throw new ApiError(401, 'Invalid refresh token')

  const user = await User.findById(payload.sub).select('+refreshTokens')
  if (!user || user.status !== 'active') throw new ApiError(401, 'Invalid refresh token')
  if (payload.tokenVersion !== undefined && Number(payload.tokenVersion) !== Number(user.tokenVersion || 0)) {
    throw new ApiError(401, 'Invalid refresh token')
  }

  const tokenHash = hashToken(refreshToken)
  const storedToken = (user.refreshTokens || []).find((item) => item.tokenHash === tokenHash && (!item.expiresAt || item.expiresAt > new Date()))
  if (!storedToken) throw new ApiError(401, 'Invalid refresh token')

  user.refreshTokens = user.refreshTokens.filter((item) => item.tokenHash !== tokenHash)
  const nextRefreshToken = generateRefreshToken(user)
  await attachRefreshToken(user, nextRefreshToken, req)

  return buildAuthPayload(user, nextRefreshToken)
}

export async function logout(userId, refreshToken) {
  const user = await User.findById(userId).select('+refreshTokens')
  if (!user) return true

  user.tokenVersion = Number(user.tokenVersion || 0) + 1
  if (refreshToken) {
    const tokenHash = hashToken(refreshToken)
    user.refreshTokens = (user.refreshTokens || []).filter((item) => item.tokenHash !== tokenHash)
  } else {
    user.refreshTokens = []
  }
  await user.save()
  return true
}

export async function getMe(user) {
  return sanitizeUser(user)
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await User.findById(userId).select('+password +refreshTokens')
  if (!user) throw new ApiError(404, 'User not found')

  const matched = await user.comparePassword(currentPassword)
  if (!matched) throw new ApiError(400, 'Current password is incorrect')

  const samePassword = await user.comparePassword(newPassword)
  if (samePassword) throw new ApiError(400, 'New password must be different from current password')

  user.password = newPassword
  user.tokenVersion = Number(user.tokenVersion || 0) + 1
  user.refreshTokens = []
  await user.save()
  return true
}

export async function forgotPassword(email, req) {
  const normalizedEmail = String(email || '').toLowerCase().trim()
  const user = await User.findOne({ email: normalizedEmail }).select('+password')
  if (!user) throw new ApiError(404, 'Email does not exist')
  if (user.status !== 'active') throw new ApiError(403, 'Account is not active')

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  const recentCount = await PasswordResetToken.countDocuments({
    user: user._id,
    createdAt: { $gte: oneHourAgo }
  })

  if (recentCount >= RESET_LIMIT_PER_HOUR) {
    throw new ApiError(429, 'Password reset request limit reached')
  }

  const resetToken = crypto.randomBytes(32).toString('hex')
  const otp = String(crypto.randomInt(100000, 999999))

  await PasswordResetToken.create({
    user: user._id,
    tokenHash: hashToken(resetToken),
    otpHash: hashToken(otp),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    requestIp: req.ip || ''
  })

  // In production this should be replaced by the configured mail transport.
  // Keeping the token out of normal UI prevents leaking reset credentials.
  console.info(`[password-reset] email=${normalizedEmail} otp=${otp} token=${resetToken}`)

  return {
    delivery: 'console',
    ...(env.nodeEnv === 'production' ? {} : { resetToken, otp }),
    expiresInMinutes: 15
  }
}

export async function resetPassword({ email, token, otp, newPassword }) {
  if (!token && !otp) throw new ApiError(400, 'Token or OTP is required')

  const normalizedEmail = String(email || '').toLowerCase().trim()
  const user = await User.findOne({ email: normalizedEmail }).select('+password +refreshTokens')
  if (!user) throw new ApiError(404, 'Email does not exist')

  const query = {
    user: user._id,
    usedAt: { $exists: false },
    expiresAt: { $gt: new Date() }
  }

  if (token) query.tokenHash = hashToken(token)
  if (otp) query.otpHash = hashToken(otp)

  const resetRequest = await PasswordResetToken.findOne(query).sort({ createdAt: -1 })
  if (!resetRequest) throw new ApiError(400, 'Invalid or expired reset token')

  const samePassword = await user.comparePassword(newPassword)
  if (samePassword) throw new ApiError(400, 'New password must be different from old password')

  user.password = newPassword
  user.failedLoginCount = 0
  user.lockedReason = ''
  user.tokenVersion = Number(user.tokenVersion || 0) + 1
  user.refreshTokens = []
  await user.save()

  resetRequest.usedAt = new Date()
  await resetRequest.save()
  return true
}
