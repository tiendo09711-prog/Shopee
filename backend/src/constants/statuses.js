export const USER_STATUSES = Object.freeze(['active', 'locked', 'inactive'])
export const SELLER_STATUSES = Object.freeze(['draft', 'pending_approval', 'approved', 'rejected', 'locked'])
export const CATEGORY_STATUSES = Object.freeze(['active', 'hidden'])
export const PRODUCT_STATUSES = Object.freeze(['draft', 'pending_review', 'active', 'hidden', 'rejected', 'out_of_stock'])
export const ORDER_STATUSES = Object.freeze([
  'pending',
  'confirmed',
  'processing',
  'shipping',
  'delivered',
  'completed',
  'cancelled',
  'return_requested',
  'refunded'
])
export const PAYMENT_METHODS = Object.freeze(['cod', 'bank_transfer', 'e_wallet', 'card'])
export const PAYMENT_STATUSES = Object.freeze(['unpaid', 'paid', 'failed', 'refunded'])
export const REVIEW_STATUSES = Object.freeze(['visible', 'hidden'])
export const REFUND_STATUSES = Object.freeze(['requested', 'approved', 'rejected', 'refunded'])
export const REPORT_TARGET_TYPES = Object.freeze(['order', 'product', 'seller', 'review'])
export const REPORT_TYPES = Object.freeze(['product_violation', 'seller_behavior', 'delivery_issue', 'counterfeit', 'offensive_content', 'other'])
export const REPORT_STATUSES = Object.freeze(['open', 'reviewing', 'resolved', 'rejected'])
export const REPORT_PRIORITIES = Object.freeze(['low', 'medium', 'high'])
export const NOTIFICATION_TYPES = Object.freeze(['order', 'product', 'seller', 'system', 'refund', 'report'])
