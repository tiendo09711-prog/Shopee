import { Router } from 'express'
import { authRequired } from '../middlewares/auth.middleware.js'
import { requireAdmin } from '../middlewares/role.middleware.js'
import * as adminController from '../controllers/admin.controller.js'

const router = Router()

router.use(authRequired, requireAdmin)
router.get('/stats/dashboard', adminController.dashboard)
router.get('/categories', adminController.listCategories)
router.post('/categories', adminController.createCategory)
router.patch('/categories/:id', adminController.updateCategory)
router.delete('/categories/:id', adminController.deleteCategory)
router.get('/products', adminController.listProducts)
router.post('/products', adminController.createProduct)
router.get('/products/pending', adminController.pendingProducts)
router.patch('/products/:id', adminController.updateProduct)
router.patch('/products/:id/approve', adminController.approveProduct)
router.patch('/products/:id/reject', adminController.rejectProduct)
router.get('/orders', adminController.listOrders)
router.patch('/orders/:id/status', adminController.updateOrder)
router.get('/users', adminController.listUsers)
router.patch('/users/:id/status', adminController.updateUserStatus)
router.get('/sellers', adminController.listSellers)
router.patch('/sellers/:id/approve', adminController.approveSeller)
router.patch('/sellers/:id/reject', adminController.rejectSeller)
router.patch('/sellers/:id/status', adminController.updateSellerStatus)
router.get('/reports', adminController.listReports)
router.patch('/reports/:id/status', adminController.updateReport)
router.get('/refunds', adminController.listRefunds)

export default router
