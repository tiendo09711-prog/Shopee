import { body } from 'express-validator'

export const refundValidator = [
  body('orderId').notEmpty().withMessage('Order id is required'),
  body('reason').notEmpty().withMessage('Refund reason is required')
]
