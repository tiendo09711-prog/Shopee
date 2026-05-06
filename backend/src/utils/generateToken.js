import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function generateAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role, tokenVersion: user.tokenVersion || 0 }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpires
  })
}

export function generateRefreshToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role, type: 'refresh', tokenVersion: user.tokenVersion || 0 }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpires
  })
}
