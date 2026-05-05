import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function generateAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpires
  })
}

export function generateRefreshToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role, type: 'refresh' }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpires
  })
}
