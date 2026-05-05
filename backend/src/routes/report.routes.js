import { Router } from 'express'
import { authRequired } from '../middlewares/auth.middleware.js'
import { requireCustomer } from '../middlewares/role.middleware.js'
import * as reportController from '../controllers/report.controller.js'

const router = Router()

router.use(authRequired, requireCustomer)
router.post('/', reportController.createReport)
router.get('/my', reportController.listMyReports)

export default router
