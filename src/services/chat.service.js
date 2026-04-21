import { getStorageValue, setStorageValue } from '../utils/storage'
import { getShopById } from './shop.service'

const CHAT_KEY = 'shopee_clone_chat_threads'

function getAllThreads() {
  return getStorageValue(CHAT_KEY, {})
}

function saveAllThreads(data) {
  setStorageValue(CHAT_KEY, data)
}

export function getMessagesByUserAndShop(userId, shopId) {
  if (!userId || !shopId) return []
  const key = `${userId}_${shopId}`
  return getAllThreads()[key] || []
}

export function sendMessageToShop(userId, shopId, content) {
  if (!userId || !shopId || !content.trim()) return []
  const key = `${userId}_${shopId}`
  const all = getAllThreads()
  const current = all[key] || []
  const store = getShopById(shopId)

  const userMessage = {
    id: `msg_${Date.now()}_u`,
    sender: 'user',
    content: content.trim(),
    createdAt: new Date().toISOString()
  }

  const reply = {
    id: `msg_${Date.now()}_s`,
    sender: 'shop',
    content: `Shop ${store?.name || ''} đã nhận tin nhắn: "${content.trim()}". Bên mình sẽ phản hồi thêm trong ít phút.`,
    createdAt: new Date(Date.now() + 1000).toISOString()
  }

  all[key] = [...current, userMessage, reply]
  saveAllThreads(all)
  return all[key]
}