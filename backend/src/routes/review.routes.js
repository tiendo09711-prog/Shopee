import { Router } from 'express'
import { authRequired } from '../middlewares/auth.middleware.js'
import { requireCustomer } from '../middlewares/role.middleware.js'
import * as reviewController from '../controllers/review.controller.js'

const router = Router()

router.post('/', authRequired, requireCustomer, reviewController.createReview)

export default router
