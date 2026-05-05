import { Router } from 'express'
import { authRequired } from '../middlewares/auth.middleware.js'
import { requireCustomer } from '../middlewares/role.middleware.js'
import * as orderController from '../controllers/order.controller.js'

const router = Router()

router.use(authRequired, requireCustomer)
router.post('/checkout', orderController.checkout)
router.get('/my', orderController.listMyOrders)
router.get('/my/:id', orderController.getMyOrder)
router.post('/:id/cancel', orderController.cancelMyOrder)

export default router
