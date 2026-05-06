import { Router } from 'express'
import apiResponse from '../utils/apiResponse.js'
import ApiError from '../utils/apiError.js'
import { authRequired } from '../middlewares/auth.middleware.js'
import upload from '../middlewares/upload.middleware.js'

const router = Router()

router.post('/images', authRequired, upload.array('images', 8), (req, res) => {
  if (!req.files?.length) throw new ApiError(400, 'At least one image is required')
  res.status(201).json(apiResponse(req.files.map((file) => `/uploads/${file.filename}`), 'Images uploaded'))
})

export default router
