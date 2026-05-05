import asyncHandler from '../utils/asyncHandler.js'
import apiResponse from '../utils/apiResponse.js'
import * as authService from '../services/auth.service.js'

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body)
  res.status(201).json(apiResponse(user, 'Register successfully'))
})

export const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body, req)
  res.json(apiResponse(data, 'Login successfully'))
})

export const refresh = asyncHandler(async (req, res) => {
  const data = await authService.refresh(req.body.refreshToken, req)
  res.json(apiResponse(data, 'Token refreshed successfully'))
})

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id, req.body.refreshToken)
  res.json(apiResponse(null, 'Logout successfully'))
})

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user)
  res.json(apiResponse(user, 'User profile'))
})

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user._id, req.body)
  res.json(apiResponse(null, 'Password changed successfully'))
})

export const forgotPassword = asyncHandler(async (req, res) => {
  const data = await authService.forgotPassword(req.body.email, req)
  res.json(apiResponse(data, 'Password reset token generated'))
})

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body)
  res.json(apiResponse(null, 'Password reset successfully'))
})
