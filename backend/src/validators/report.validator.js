import { body } from 'express-validator'

export const reportValidator = [
  body('targetType').isIn(['order', 'product', 'seller', 'review']).withMessage('Invalid target type'),
  body('targetId').notEmpty().withMessage('Target id is required'),
  body('type').isIn(['product_violation', 'seller_behavior', 'delivery_issue', 'counterfeit', 'offensive_content', 'other']).withMessage('Invalid report type'),
  body('reason').notEmpty().withMessage('Report reason is required')
]
