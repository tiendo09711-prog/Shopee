import { Router } from 'express'
import { authRequired } from '../middlewares/auth.middleware.js'
import { requireCustomer } from '../middlewares/role.middleware.js'
import * as cartController from '../controllers/cart.controller.js'

const router = Router()

router.use(authRequired, requireCustomer)
router.get('/', cartController.getCart)
router.post('/items', cartController.addItem)
router.patch('/items/:productId', cartController.updateItem)
router.patch('/items/:productId/select', cartController.updateItem)
router.delete('/items/:productId', cartController.removeItem)
router.delete('/', cartController.clearCart)

export default router
