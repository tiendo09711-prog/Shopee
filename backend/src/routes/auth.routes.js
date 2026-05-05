import { Router } from 'express'
import { authRequired } from '../middlewares/auth.middleware.js'
import validate from '../middlewares/validate.middleware.js'
import {
  changePasswordValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshValidator,
  registerValidator,
  resetPasswordValidator
} from '../validators/auth.validator.js'
import * as authController from '../controllers/auth.controller.js'

const router = Router()

router.post('/register', registerValidator, validate, authController.register)
router.post('/login', loginValidator, validate, authController.login)
router.post('/refresh', refreshValidator, validate, authController.refresh)
router.post('/logout', authRequired, authController.logout)
router.post('/forgot-password', forgotPasswordValidator, validate, authController.forgotPassword)
router.post('/reset-password', resetPasswordValidator, validate, authController.resetPassword)
router.get('/me', authRequired, authController.me)
router.patch('/change-password', authRequired, changePasswordValidator, validate, authController.changePassword)

export default router
