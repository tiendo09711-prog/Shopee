import { apiRequest } from './apiClient'

// Lấy tất cả threads của customer
export async function getCustomerChatThreads() {
  return apiRequest('/chat/threads')
}

// Lấy messages của một thread
export async function getThreadMessages(threadId) {
  return apiRequest(`/chat/threads/${threadId}`)
}

// Customer gửi tin nhắn đến seller (theo sellerId hoặc slug)
export async function sendMessageToShop(userId, sellerIdOrSlug, content) {
  return apiRequest(`/chat/send/${sellerIdOrSlug}`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

// Backward compat — lấy messages giữa user và shop (dùng thread API)
export async function getMessagesByUserAndShop(userId, sellerIdOrSlug) {
  try {
    const threads = await getCustomerChatThreads()
    const thread = threads.find(
      (t) => String(t.seller?._id || t.seller) === String(sellerIdOrSlug) ||
             (t.seller?.slug === sellerIdOrSlug)
    )
    if (!thread) return []
    const detail = await getThreadMessages(thread._id || thread.id)
    return detail?.messages || []
  } catch {
    return []
  }
}
