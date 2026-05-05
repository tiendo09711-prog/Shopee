import apiResponse from '../utils/apiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import * as reviewService from '../services/review.service.js'

export const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(req.user, req.body)
  res.status(201).json(apiResponse(review, 'Review created successfully'))
})
