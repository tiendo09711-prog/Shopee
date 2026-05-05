import { body } from 'express-validator'

export const reviewValidator = [
  body('orderId').notEmpty().withMessage('Order id is required'),
  body('productId').notEmpty().withMessage('Product id is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
]
