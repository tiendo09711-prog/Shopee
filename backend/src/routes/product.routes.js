import { Router } from 'express'
import * as productController from '../controllers/product.controller.js'

const router = Router()

router.get('/', productController.listPublicProducts)
router.get('/:productIdOrSlug/reviews', productController.listProductReviews)
router.get('/:slugOrId', productController.getPublicProduct)

export default router
