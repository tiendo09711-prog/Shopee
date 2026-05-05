import apiResponse from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import * as cartService from '../services/cart.service.js'

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id)
  res.json(apiResponse(cart, 'Cart loaded successfully'))
})

export const addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addItem(req.user._id, req.body)
  res.status(201).json(apiResponse(cart, 'Cart item added successfully'))
})

export const updateItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateItem(req.user._id, req.params.productId, req.body)
  res.json(apiResponse(cart, 'Cart item updated successfully'))
})

export const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user._id, req.params.productId)
  res.json(apiResponse(cart, 'Cart item removed successfully'))
})

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user._id)
  res.json(apiResponse(cart, 'Cart cleared successfully'))
})
