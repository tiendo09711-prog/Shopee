import { Router } from 'express'
import apiResponse from '../utils/apiResponse.js'
import adminRoutes from './admin.routes.js'
import authRoutes from './auth.routes.js'
import cartRoutes from './cart.routes.js'
import categoryRoutes from './category.routes.js'
import chatRoutes from './chat.routes.js'
import notificationRoutes from './notification.routes.js'
import orderRoutes from './order.routes.js'
import productRoutes from './product.routes.js'
import refundRoutes from './refund.routes.js'
import reportRoutes from './report.routes.js'
import reviewRoutes from './review.routes.js'
import sellerRoutes from './seller.routes.js'
import uploadRoutes from './upload.routes.js'
import userRoutes from './user.routes.js'

const router = Router()

router.get('/health', (req, res) => {
  res.json(apiResponse({ status: 'ok', uptime: process.uptime() }, 'PShop API is healthy'))
})

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/categories', categoryRoutes)
router.use('/products', productRoutes)
router.use('/cart', cartRoutes)
router.use('/orders', orderRoutes)
router.use('/reviews', reviewRoutes)
router.use('/refunds', refundRoutes)
router.use('/reports', reportRoutes)
router.use('/notifications', notificationRoutes)
router.use('/chat', chatRoutes)
router.use('/uploads', uploadRoutes)
router.use('/', sellerRoutes)
router.use('/admin', adminRoutes)

export default router
