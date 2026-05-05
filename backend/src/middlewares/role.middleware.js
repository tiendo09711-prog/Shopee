import ApiError from '../utils/apiError.js'
import Seller from '../models/Seller.js'

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(new ApiError(401, 'Authentication required'))
    if (!roles.includes(req.user.role)) return next(new ApiError(403, 'Permission denied'))
    return next()
  }
}

export const requireAdmin = requireRoles('admin')
export const requireSeller = requireRoles('seller')
export const requireCustomer = requireRoles('customer')

export async function requireApprovedSeller(req, res, next) {
  if (!req.user) return next(new ApiError(401, 'Authentication required'))
  if (req.user.role !== 'seller') return next(new ApiError(403, 'Permission denied'))

  const seller = await Seller.findOne({ user: req.user._id })
  if (!seller) return next(new ApiError(403, 'Seller profile is required'))
  if (seller.status !== 'approved') return next(new ApiError(403, 'Seller is not approved'))

  req.seller = seller
  return next()
}
