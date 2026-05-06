import { body } from 'express-validator'

export const registerValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone')
    .matches(/^(0|\+84)[0-9]{9,10}$/)
    .withMessage('Valid phone is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn(['customer', 'seller']).withMessage('Role must be customer or seller')
]

export const loginValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email or phone is required'),
  body('password').notEmpty().withMessage('Password is required')
]

export const refreshValidator = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required')
]

export const forgotPasswordValidator = [
  body('email').isEmail().withMessage('Valid email is required')
]

export const resetPasswordValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('token').optional().isString().withMessage('Token must be a string'),
  body('otp').optional().isString().withMessage('OTP must be a string')
]

export const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
]
