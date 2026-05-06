import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import User from '../models/User.js'
import ApiError from '../utils/apiError.js'
import asyncHandler from '../utils/asyncHandler.js'

export const authRequired = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  if (!token) throw new ApiError(401, 'Authentication required')

  const payload = jwt.verify(token, env.jwtAccessSecret)
  const user = await User.findById(payload.sub)
  if (!user) throw new ApiError(401, 'Invalid token')
  if (user.status !== 'active') throw new ApiError(403, 'Account is not active')
  if (payload.tokenVersion !== undefined && Number(payload.tokenVersion) !== Number(user.tokenVersion || 0)) {
    throw new ApiError(401, 'Token has been revoked')
  }

  req.user = user
  next()
})
