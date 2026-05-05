import apiResponse from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import * as userService from '../services/user.service.js'

export const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user)
  res.json(apiResponse(user, 'Profile loaded successfully'))
})

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body)
  res.json(apiResponse(user, 'Profile updated successfully'))
})
