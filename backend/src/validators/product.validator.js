import { body } from 'express-validator'

export const productValidator = [
  body('name').notEmpty().isLength({ max: 255 }).withMessage('Product name is required and max 255 characters'),
  body('sku').notEmpty().withMessage('SKU is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be at least 0'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required')
]
