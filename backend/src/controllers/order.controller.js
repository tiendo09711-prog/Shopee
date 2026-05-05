import apiResponse from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import * as orderService from '../services/order.service.js'

export const checkout = asyncHandler(async (req, res) => {
  const orders = await orderService.checkout(req.user, req.body)
  res.status(201).json(apiResponse(orders, 'Checkout successfully'))
})

export const listMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.listMyOrders(req.user._id, req.query)
  res.json(apiResponse(orders, 'Orders loaded successfully'))
})

export const getMyOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getMyOrder(req.user._id, req.params.id)
  res.json(apiResponse(order, 'Order loaded successfully'))
})

export const cancelMyOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelMyOrder(req.user, req.params.id, req.body.reason)
  res.json(apiResponse(order, 'Order cancelled successfully'))
})
