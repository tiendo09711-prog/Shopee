import { body } from 'express-validator'

export const checkoutValidator = [
  body('shippingAddress.fullName').notEmpty().withMessage('Shipping fullName is required'),
  body('shippingAddress.phone').notEmpty().withMessage('Shipping phone is required'),
  body('shippingAddress.fullAddress').notEmpty().withMessage('Shipping fullAddress is required'),
  body('paymentMethod').isIn(['cod', 'bank_transfer', 'e_wallet', 'card']).withMessage('Invalid payment method')
]
