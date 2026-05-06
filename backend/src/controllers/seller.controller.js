import apiResponse from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import * as sellerService from '../services/seller.service.js'

export const registerShop = asyncHandler(async (req, res) => {
  const seller = await sellerService.registerShop(req.user, req.body)
  res.status(201).json(apiResponse(seller, 'Seller shop registered successfully'))
})

export const getMe = asyncHandler(async (req, res) => {
  const seller = await sellerService.getMySeller(req.user._id)
  res.json(apiResponse(seller, 'Seller loaded successfully'))
})

export const updateMe = asyncHandler(async (req, res) => {
  const seller = await sellerService.updateMySeller(req.user._id, req.body)
  res.json(apiResponse(seller, 'Seller updated successfully'))
})

export const getStatus = asyncHandler(async (req, res) => {
  const seller = await sellerService.getMySeller(req.user._id)
  res.json(apiResponse({ status: seller.status, rejectReason: seller.rejectReason }, 'Seller status loaded successfully'))
})

export const listProducts = asyncHandler(async (req, res) => {
  const products = await sellerService.listProducts(req.seller._id, req.query)
  res.json(apiResponse(products, 'Seller products loaded successfully'))
})

export const createProduct = asyncHandler(async (req, res) => {
  const product = await sellerService.saveProduct(req.seller, req.body, req.body.mode || 'draft')
  res.status(201).json(apiResponse(product, 'Seller product saved successfully'))
})

export const getProduct = asyncHandler(async (req, res) => {
  const product = await sellerService.getProduct(req.seller._id, req.params.id)
  res.json(apiResponse(product, 'Seller product loaded successfully'))
})

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await sellerService.saveProduct(req.seller, req.body, req.body.mode || 'draft', req.params.id)
  res.json(apiResponse(product, 'Seller product updated successfully'))
})

export const deleteProduct = asyncHandler(async (req, res) => {
  const result = await sellerService.deleteProduct(req.seller._id, req.params.id)
  res.json(apiResponse(result, 'Seller product deleted successfully'))
})

export const updateProductStatus = asyncHandler(async (req, res) => {
  const product = await sellerService.updateProductStatus(req.seller._id, req.params.id, req.body.status)
  res.json(apiResponse(product, 'Seller product status updated successfully'))
})

export const listOrders = asyncHandler(async (req, res) => {
  const orders = await sellerService.listOrders(req.seller._id, req.query)
  res.json(apiResponse(orders, 'Seller orders loaded successfully'))
})

export const getOrder = asyncHandler(async (req, res) => {
  const order = await sellerService.getOrder(req.seller._id, req.params.id)
  res.json(apiResponse(order, 'Seller order loaded successfully'))
})

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await sellerService.changeOrderStatus(req.seller, req.user, req.params.id, req.body.status, req.body.note)
  res.json(apiResponse(order, 'Seller order status updated successfully'))
})

export const dashboard = asyncHandler(async (req, res) => {
  const range = req.query.range || '30'
  const data = await sellerService.getDashboard(req.seller._id, range, req.query)
  res.json(apiResponse(data, 'Seller dashboard loaded successfully'))
})
