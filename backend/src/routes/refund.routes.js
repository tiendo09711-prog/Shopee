import { Router } from 'express'
import { authRequired } from '../middlewares/auth.middleware.js'
import { requireCustomer } from '../middlewares/role.middleware.js'
import * as refundController from '../controllers/refund.controller.js'

const router = Router()

router.use(authRequired, requireCustomer)
router.post('/', refundController.createRefund)
router.get('/my', refundController.listMyRefunds)

export default router
