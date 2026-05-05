import apiResponse from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import * as productService from '../services/product.service.js'

export const listPublicProducts = asyncHandler(async (req, res) => {
  const data = await productService.listPublicProducts(req.query)
  res.json(apiResponse(data, 'Products loaded successfully'))
})

export const getPublicProduct = asyncHandler(async (req, res) => {
  const product = await productService.getPublicProductBySlugOrId(req.params.slugOrId)
  res.json(apiResponse(product, 'Product loaded successfully'))
})

export const listProductReviews = asyncHandler(async (req, res) => {
  const data = await productService.listProductReviews(req.params.productIdOrSlug, req.query)
  res.json(apiResponse(data, 'Reviews loaded successfully'))
})
