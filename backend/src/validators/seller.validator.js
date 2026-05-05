import { body } from 'express-validator'

export const sellerRegisterValidator = [
  body('shopName').notEmpty().withMessage('Shop name is required'),
  body('phone').notEmpty().withMessage('Seller phone is required'),
  body('legalAccepted').equals('true').withMessage('Legal agreement must be accepted')
]
