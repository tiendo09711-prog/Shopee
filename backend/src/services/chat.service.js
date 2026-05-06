import ApiError from '../utils/apiError.js'
import ChatThread from '../models/ChatThread.js'
import Seller from '../models/Seller.js'

// Lấy tất cả threads của customer
export async function getCustomerThreads(userId) {
  return ChatThread.find({ customer: userId })
    .populate('seller', 'shopName logo slug')
    .select('-messages')
    .sort({ lastMessageAt: -1 })
    .lean()
}

// Lấy tất cả threads của seller
export async function getSellerThreads(sellerId) {
  return ChatThread.find({ seller: sellerId })
    .populate('customer', 'name email avatar')
    .select('-messages')
    .sort({ lastMessageAt: -1 })
    .lean()
}

// Lấy messages của một thread (customer hoặc seller đều dùng được)
export async function getThreadMessages(threadId, userId, role) {
  const thread = await ChatThread.findById(threadId)
    .populate('customer', 'name email avatar')
    .populate('seller', 'shopName logo')
    .lean()

  if (!thread) throw new ApiError(404, 'Thread not found')

  // Kiểm tra quyền truy cập
  const isCustomer = String(thread.customer._id || thread.customer) === String(userId)
  const isSeller = role === 'seller' // seller đã được xác thực qua requireSeller middleware

  if (!isCustomer && !isSeller) throw new ApiError(403, 'Access denied')

  return thread
}

// Customer gửi tin nhắn cho seller
export async function sendMessageToSeller(customerId, sellerIdOrSlug, content) {
  if (!content?.trim()) throw new ApiError(400, 'Message content is required')

  // Tìm seller theo id hoặc slug
  const seller = await Seller.findOne({
    $or: [{ _id: sellerIdOrSlug }, { slug: sellerIdOrSlug }],
  })
  if (!seller) throw new ApiError(404, 'Seller not found')
  if (seller.status !== 'approved') throw new ApiError(400, 'Seller is not available')

  let thread = await ChatThread.findOne({ customer: customerId, seller: seller._id })

  const newMessage = {
    sender: customerId,
    senderRole: 'customer',
    content: content.trim(),
  }

  if (!thread) {
    thread = await ChatThread.create({
      customer: customerId,
      seller: seller._id,
      messages: [newMessage],
      lastMessage: content.trim(),
      lastMessageAt: new Date(),
    })
  } else {
    thread.messages.push(newMessage)
    thread.lastMessage = content.trim()
    thread.lastMessageAt = new Date()
    await thread.save()
  }

  return thread.populate([
    { path: 'customer', select: 'name email avatar' },
    { path: 'seller', select: 'shopName logo' },
  ])
}

// Seller reply vào thread
export async function sellerReply(sellerId, threadId, userId, content) {
  if (!content?.trim()) throw new ApiError(400, 'Message content is required')

  const thread = await ChatThread.findOne({ _id: threadId, seller: sellerId })
  if (!thread) throw new ApiError(404, 'Thread not found')

  thread.messages.push({
    sender: userId,
    senderRole: 'seller',
    content: content.trim(),
  })
  thread.lastMessage = content.trim()
  thread.lastMessageAt = new Date()
  await thread.save()

  return thread.populate([
    { path: 'customer', select: 'name email avatar' },
    { path: 'seller', select: 'shopName logo' },
  ])
}

// Đánh dấu đã đọc
export async function markThreadRead(threadId, userId) {
  const now = new Date()
  await ChatThread.updateOne(
    { _id: threadId },
    { $set: { 'messages.$[msg].readAt': now } },
    { arrayFilters: [{ 'msg.sender': { $ne: userId }, 'msg.readAt': null }] }
  )
  return true
}
