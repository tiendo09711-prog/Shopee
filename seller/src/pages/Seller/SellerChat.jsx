import { useEffect, useRef, useState } from 'react'
import SellerDashboardLayout from '../../layout/SellerDashboardLayout'
import { getSellerChatThreads, getThreadMessages, replyToThread } from '../../services/chat.service'

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
}

function SellerChat() {
  const [threads, setThreads] = useState([])
  const [selectedThread, setSelectedThread] = useState(null)
  const [messages, setMessages] = useState([])
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(true)
  const [msgLoading, setMsgLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  const loadThreads = () => {
    setLoading(true)
    getSellerChatThreads()
      .then((data) => setThreads(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadThreads()
    const interval = setInterval(loadThreads, 15000) // polling mỗi 15s
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const openThread = (thread) => {
    setSelectedThread(thread)
    setMsgLoading(true)
    getThreadMessages(thread._id || thread.id)
      .then((data) => {
        setMessages(data?.messages || [])
        // Refresh threads để cập nhật unread
        loadThreads()
      })
      .catch((err) => setError(err.message))
      .finally(() => setMsgLoading(false))
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim() || !selectedThread) return
    setSending(true)
    try {
      const updated = await replyToThread(selectedThread._id || selectedThread.id, replyText.trim())
      setMessages(updated?.messages || [])
      setReplyText('')
      loadThreads()
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  const rightbar = (
    <div>
      <h3>Tin nhắn</h3>
      <p className="seller-muted">Trả lời tin nhắn từ khách hàng. Tự động làm mới mỗi 15 giây.</p>
    </div>
  )

  return (
    <SellerDashboardLayout rightbar={rightbar}>
      <section className="seller-panel">
        <div className="seller-page-head">
          <h1 className="seller-page-title">Kênh chat với khách hàng</h1>
        </div>

        {error ? <div className="status-message text-danger">{error}</div> : null}

        <div style={{ display: 'flex', gap: 16, height: 560 }}>
          {/* Danh sách thread */}
          <div style={{ width: 280, borderRight: '1px solid #eee', overflowY: 'auto', flexShrink: 0 }}>
            {loading ? (
              <p className="seller-muted" style={{ padding: 16 }}>Đang tải...</p>
            ) : threads.length === 0 ? (
              <p className="seller-muted" style={{ padding: 16 }}>Chưa có tin nhắn nào.</p>
            ) : (
              threads.map((thread) => {
                const isSelected = (selectedThread?._id || selectedThread?.id) === (thread._id || thread.id)
                return (
                  <div
                    key={thread._id || thread.id}
                    onClick={() => openThread(thread)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      background: isSelected ? '#fff3ee' : 'transparent',
                      borderBottom: '1px solid #f5f5f5',
                      borderLeft: isSelected ? '3px solid #ee4d2d' : '3px solid transparent',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {thread.customer?.name || 'Khách hàng'}
                    </div>
                    <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                      {thread.customer?.email || ''}
                    </div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {thread.lastMessage || '...'}
                    </div>
                    <div style={{ fontSize: 11, color: '#bbb', marginTop: 2 }}>
                      {formatTime(thread.lastMessageAt)}
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Khu vực chat */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {!selectedThread ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p className="seller-muted">Chọn một cuộc trò chuyện để xem tin nhắn</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #eee', fontWeight: 600 }}>
                  💬 {selectedThread.customer?.name || 'Khách hàng'}
                  <span style={{ fontWeight: 400, fontSize: 12, color: '#999', marginLeft: 8 }}>
                    {selectedThread.customer?.email}
                  </span>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
                  {msgLoading ? (
                    <p className="seller-muted">Đang tải tin nhắn...</p>
                  ) : messages.length === 0 ? (
                    <p className="seller-muted">Chưa có tin nhắn</p>
                  ) : (
                    messages.map((msg, idx) => {
                      const isSeller = msg.senderRole === 'seller'
                      return (
                        <div
                          key={msg._id || idx}
                          style={{
                            display: 'flex',
                            justifyContent: isSeller ? 'flex-end' : 'flex-start',
                            marginBottom: 10,
                          }}
                        >
                          <div
                            style={{
                              maxWidth: '70%',
                              background: isSeller ? '#ee4d2d' : '#f5f5f5',
                              color: isSeller ? '#fff' : '#333',
                              borderRadius: isSeller ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                              padding: '8px 14px',
                              fontSize: 14,
                            }}
                          >
                            <div>{msg.content}</div>
                            <div style={{ fontSize: 10, marginTop: 4, opacity: 0.7, textAlign: 'right' }}>
                              {formatTime(msg.createdAt)}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Reply input */}
                <form onSubmit={handleReply} style={{ padding: 12, borderTop: '1px solid #eee', display: 'flex', gap: 8 }}>
                  <input
                    className="seller-input"
                    style={{ flex: 1 }}
                    placeholder="Nhập tin nhắn trả lời..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    className="seller-primary-btn"
                    disabled={sending || !replyText.trim()}
                  >
                    {sending ? '...' : 'Gửi'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </SellerDashboardLayout>
  )
}

export default SellerChat
