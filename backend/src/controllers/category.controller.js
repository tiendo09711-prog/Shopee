import apiResponse from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import * as categoryService from '../services/category.service.js'

export const listPublicCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.listPublicCategories()
  res.json(apiResponse(categories, 'Categories loaded successfully'))
})
