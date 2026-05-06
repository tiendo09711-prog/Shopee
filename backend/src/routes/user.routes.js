import { Router } from 'express'
import { authRequired } from '../middlewares/auth.middleware.js'
import upload from '../middlewares/upload.middleware.js'
import * as userController from '../controllers/user.controller.js'

const router = Router()

router.get('/me', authRequired, userController.getProfile)
router.patch('/me', authRequired, userController.updateProfile)
router.patch('/me/avatar', authRequired, upload.single('avatar'), userController.updateAvatar)

export default router
