import { Router } from 'express'
import { authRequired } from '../middlewares/auth.middleware.js'
import { requireApprovedSeller, requireSeller } from '../middlewares/role.middleware.js'
import * as chatController from '../controllers/chat.controller.js'

const router = Router()

// Tất cả route đều cần đăng nhập
router.use(authRequired)

// Customer & Seller đều dùng được
// Seller phải approved để lấy threads (gắn req.seller), customer thì không cần
router.get('/threads', chatController.getMyThreads)
router.get('/threads/:threadId', chatController.getThreadMessages)

// Chỉ customer dùng (gửi tin đến seller)
router.post('/send/:sellerIdOrSlug', chatController.sendMessage)

// Chỉ seller dùng (reply vào thread) - requireApprovedSeller gắn req.seller
router.post('/threads/:threadId/reply', requireApprovedSeller, chatController.sellerReply)

export default router
