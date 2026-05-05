import { validationResult } from 'express-validator'
import ApiError from '../utils/apiError.js'

export default function validate(req, res, next) {
  const result = validationResult(req)
  if (result.isEmpty()) return next()

  const errors = result.array().map((item) => ({
    field: item.path,
    message: item.msg
  }))
  return next(new ApiError(400, errors[0]?.message || 'Validation error', errors))
}
