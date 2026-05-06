import { apiRequest } from './apiClient'

// Lấy tất cả chat threads của seller
export async function getSellerChatThreads() {
  return apiRequest('/chat/threads')
}

// Lấy messages của một thread
export async function getThreadMessages(threadId) {
  return apiRequest(`/chat/threads/${threadId}`)
}

// Seller reply vào thread
export async function replyToThread(threadId, content) {
  return apiRequest(`/chat/threads/${threadId}/reply`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}
