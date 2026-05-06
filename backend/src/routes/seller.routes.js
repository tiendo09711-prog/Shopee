import { Router } from 'express'
import { authRequired } from '../middlewares/auth.middleware.js'
import { requireApprovedSeller, requireSeller } from '../middlewares/role.middleware.js'
import * as sellerController from '../controllers/seller.controller.js'

const router = Router()

router.post('/sellers/register-shop', authRequired, requireSeller, sellerController.registerShop)
router.get('/sellers/me', authRequired, requireSeller, sellerController.getMe)
router.patch('/sellers/me', authRequired, requireSeller, sellerController.updateMe)
router.get('/sellers/me/status', authRequired, requireSeller, sellerController.getStatus)

router.get('/seller/products', authRequired, requireApprovedSeller, sellerController.listProducts)
router.post('/seller/products', authRequired, requireApprovedSeller, sellerController.createProduct)
router.get('/seller/products/:id', authRequired, requireApprovedSeller, sellerController.getProduct)
router.patch('/seller/products/:id', authRequired, requireApprovedSeller, sellerController.updateProduct)
router.delete('/seller/products/:id', authRequired, requireApprovedSeller, sellerController.deleteProduct)
router.patch('/seller/products/:id/status', authRequired, requireApprovedSeller, sellerController.updateProductStatus)

router.get('/seller/orders', authRequired, requireApprovedSeller, sellerController.listOrders)
router.get('/seller/orders/:id', authRequired, requireApprovedSeller, sellerController.getOrder)
router.patch('/seller/orders/:id/status', authRequired, requireApprovedSeller, sellerController.updateOrderStatus)

router.get('/seller/stats/dashboard', authRequired, requireApprovedSeller, sellerController.dashboard)

export default router
