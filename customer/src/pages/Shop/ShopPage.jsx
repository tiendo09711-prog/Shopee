import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
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
  const [messages, setMessages] = useState(() => getMessagesByUserAndShop(user?.id, shopId))

  if (!shop) {
    return (
      <MainLayout>
        <div className="container page-spacing"><div className="empty-message card">Shop không tồn tại.</div></div>
      </MainLayout>
    )
  }

  const handleSend = () => {
    if (!isAuthenticated) return
    const next = sendMessageToShop(user.id, shopId, message)
    setMessages(next)
    setMessage('')
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
                <span>{shop.followers.toLocaleString('vi-VN')} người theo dõi</span>
              </div>
            </div>
          </div>
          <div className="shop-hero-side">
            <div><strong>{shop.rating}</strong><span>Đánh giá</span></div>
            <div><strong>{shop.joinedYear}</strong><span>Năm tham gia</span></div>
            <div><strong>{shop.location}</strong><span>Khu vực</span></div>
          </div>
        </section>

        <section className="shop-layout">
          <div className="shop-product-area">
            <h2>Sản phẩm của shop</h2>
            <div className="shop-product-grid">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>

          <aside className="card shop-chat-box">
            <h3>Chat với shop</h3>
            {!isAuthenticated ? (
              <div>
                <p>Bạn cần đăng nhập để nhắn tin cho shop.</p>
                <Link to="/login">Đăng nhập</Link>
              </div>
            ) : (
              <>
                <div className="shop-chat-messages">
                  {messages.length === 0 ? <p>Chưa có tin nhắn nào.</p> : messages.map((item) => (
                    <div key={item.id} className={`shop-chat-message ${item.sender}`}>
                      {item.content}
                    </div>
                  ))}
                </div>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Nhập tin nhắn..." />
                <button type="button" onClick={handleSend}>Gửi</button>
              </>
            )}
          </aside>
        </section>
      </div>
    </MainLayout>
  )
}

export default ShopPage