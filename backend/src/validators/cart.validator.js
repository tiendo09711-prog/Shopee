import { body } from 'express-validator'

export const addCartItemValidator = [
  body('productId').notEmpty().withMessage('Product id is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
]
