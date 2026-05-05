import apiResponse from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import * as refundService from '../services/refund.service.js'

export const createRefund = asyncHandler(async (req, res) => {
  const refund = await refundService.createRefund(req.user, req.body)
  res.status(201).json(apiResponse(refund, 'Refund request created successfully'))
})

export const listMyRefunds = asyncHandler(async (req, res) => {
  const refunds = await refundService.listMyRefunds(req.user._id)
  res.json(apiResponse(refunds, 'Refunds loaded successfully'))
})
