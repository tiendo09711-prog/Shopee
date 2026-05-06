import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MainLayout from '../../layout/MainLayout'
import ProductCard from '../../components/ProductCard/ProductCard'
import { useAuth } from '../../contexts/AuthContext'
import { getMessagesByUserAndShop, sendMessageToShop } from '../../services/chat.service'
import { getShopById } from '../../services/shop.service'
import { getProductsByShop } from '../../services/product.service'
import './ShopPage.css'

function ShopPage() {
  const { shopId } = useParams()
  const { user, isAuthenticated } = useAuth()
  const shop = getShopById(shopId)
  const products = useMemo(() => getProductsByShop(shopId), [shopId])

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [chatLoading, setChatLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  // Load chat messages khi đã đăng nhập
  useEffect(() => {
    if (!isAuthenticated || !user) return
    setChatLoading(true)
    getMessagesByUserAndShop(user.id || user._id, shopId)
      .then((msgs) => setMessages(Array.isArray(msgs) ? msgs : []))
      .catch(() => setMessages([]))
      .finally(() => setChatLoading(false))
  }, [isAuthenticated, user, shopId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!isAuthenticated || !message.trim() || sending) return
    setSending(true)
    try {
      await sendMessageToShop(user.id || user._id, shopId, message.trim())
      // Reload messages sau khi gửi
      const msgs = await getMessagesByUserAndShop(user.id || user._id, shopId)
      setMessages(Array.isArray(msgs) ? msgs : [])
      setMessage('')
    } catch (err) {
      console.error('Chat error:', err.message)
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!shop) {
    return (
      <MainLayout>
        <div className="container page-spacing">
          <div className="empty-message card">Shop không tồn tại.</div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container page-spacing shop-page">
        <section className="card shop-hero">
          <div className="shop-hero-main">
            <div className="shop-hero-avatar">{shop.name.slice(0, 1)}</div>
            <div>
              <h1>{shop.name}</h1>
              <p>Phản hồi {shop.responseRate}% · {shop.responseTime}</p>
              <div className="shop-tags">
                <span>Shopee Mall</span>
                <span>{shop.productsCount} sản phẩm</span>
                <span>{(shop.followers || 0).toLocaleString('vi-VN')} người theo dõi</span>
              </div>
            </div>
          </div>
          <div className="shop-hero-side">
            <div><strong>{shop.rating}</strong><span>Đánh giá</span></div>
            <div><strong>{shop.joinedYear || '2024'}</strong><span>Năm tham gia</span></div>
            <div><strong>{shop.location || 'Việt Nam'}</strong><span>Khu vực</span></div>
          </div>
        </section>

        <section className="shop-layout">
          <div className="shop-product-area">
            <h2>Sản phẩm của shop</h2>
            <div className="shop-product-grid">
              {products.map((product) => <ProductCard key={product.id || product._id} product={product} />)}
            </div>
          </div>

          <aside className="card shop-chat-box">
            <h3>💬 Chat với shop</h3>
            {!isAuthenticated ? (
              <div>
                <p>Bạn cần đăng nhập để nhắn tin cho shop.</p>
                <Link to="/login">Đăng nhập</Link>
              </div>
            ) : (
              <>
                <div className="shop-chat-messages" style={{ minHeight: 120, maxHeight: 240, overflowY: 'auto' }}>
                  {chatLoading ? (
                    <p style={{ color: '#999', fontSize: 13 }}>Đang tải...</p>
                  ) : messages.length === 0 ? (
                    <p style={{ color: '#999', fontSize: 13 }}>Chưa có tin nhắn nào. Hãy gửi tin nhắn đầu tiên!</p>
                  ) : (
                    messages.map((item, idx) => (
                      <div
                        key={item._id || item.id || idx}
                        className={`shop-chat-message ${item.senderRole === 'customer' ? 'user' : 'shop'}`}
                      >
                        {item.content}
                      </div>
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập tin nhắn... (Enter để gửi)"
                  disabled={sending}
                />
                <button type="button" onClick={handleSend} disabled={sending || !message.trim()}>
                  {sending ? 'Đang gửi...' : 'Gửi'}
                </button>
              </>
            )}
          </aside>
        </section>
      </div>
    </MainLayout>
  )
}

export default ShopPage
