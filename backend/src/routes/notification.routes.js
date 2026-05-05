import { Router } from 'express'
import { authRequired } from '../middlewares/auth.middleware.js'
import * as notificationController from '../controllers/notification.controller.js'

const router = Router()

router.use(authRequired)
router.get('/', notificationController.listMyNotifications)
router.patch('/:id/read', notificationController.markRead)

export default router
