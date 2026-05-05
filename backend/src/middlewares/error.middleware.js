import ApiError from '../utils/apiError.js'

export function notFoundMiddleware(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}

export function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || 500
  const isProduction = process.env.NODE_ENV === 'production'
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
    errors: error.errors || [],
    ...(isProduction ? {} : { stack: error.stack })
  })
}
