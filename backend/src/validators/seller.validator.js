import { body } from 'express-validator'

export const sellerRegisterValidator = [
  body('shopName').notEmpty().withMessage('Shop name is required'),
  body('phone').notEmpty().withMessage('Seller phone is required'),
  body('legalAccepted').custom((value) => value === true || value === 'true').withMessage('Legal agreement must be accepted'),
  body('sellerFullName').notEmpty().withMessage('Seller full name is required'),
  body('birthDate').isISO8601().withMessage('Valid birth date is required'),
  body('saleCategory.name').notEmpty().withMessage('Sale category is required')
]
