import asyncHandler from '../utils/asyncHandler.js'
import apiResponse from '../utils/apiResponse.js'
import Seller from '../models/Seller.js'
import * as chatService from '../services/chat.service.js'

// GET /chat/threads — lấy threads của user hiện tại (customer hoặc seller)
export const getMyThreads = asyncHandler(async (req, res) => {
  const user = req.user
  if (user.role === 'seller') {
    // Load seller nếu chưa có trong req
    const seller = req.seller || await Seller.findOne({ user: user._id })
    if (seller) {
      const threads = await chatService.getSellerThreads(seller._id)
      return res.json(apiResponse(threads, 'Threads loaded'))
    }
  }
  const threads = await chatService.getCustomerThreads(user._id)
  res.json(apiResponse(threads, 'Threads loaded'))
})

// GET /chat/threads/:threadId — lấy messages của thread
export const getThreadMessages = asyncHandler(async (req, res) => {
  const thread = await chatService.getThreadMessages(req.params.threadId, req.user._id, req.user.role)
  // Mark as read
  await chatService.markThreadRead(req.params.threadId, req.user._id)
  res.json(apiResponse(thread, 'Thread loaded'))
})

// POST /chat/send/:sellerIdOrSlug — customer gửi tin đến seller
export const sendMessage = asyncHandler(async (req, res) => {
  const thread = await chatService.sendMessageToSeller(req.user._id, req.params.sellerIdOrSlug, req.body.content)
  res.status(201).json(apiResponse(thread, 'Message sent'))
})

// POST /chat/threads/:threadId/reply — seller reply
export const sellerReply = asyncHandler(async (req, res) => {
  const thread = await chatService.sellerReply(req.seller._id, req.params.threadId, req.user._id, req.body.content)
  res.json(apiResponse(thread, 'Reply sent'))
})
