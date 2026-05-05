import './SellerShared.css'

function SellerShippingSection({ title, items, onToggleExpanded, onToggleActive, onToggleCod }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h3 className="seller-shipping-group-title">{title}</h3>
      {items.map((item) => (
        <div key={item.id} className="seller-shipping-card">
          <div className="seller-shipping-card-header">
            <div>
              <strong>{item.title}</strong>
              {item.badge ? <span className="seller-badge">[{item.badge}]</span> : null}
            </div>
            <button type="button" className="seller-outline-btn" onClick={() => onToggleExpanded(item.id)}>
              {item.expanded ? 'Thu gọn' : 'Mở rộng'}
            </button>
          </div>
          {item.expanded && (
            <>
              <div className="seller-shipping-row">
                <span>Kích hoạt đơn vị vận chuyển này</span>
                <button type="button" className={`seller-toggle ${item.active ? 'active' : ''}`} onClick={() => onToggleActive(item.id)} />
              </div>
              <div className="seller-shipping-row">
                <span>Kích hoạt COD</span>
                <button type="button" className={`seller-toggle ${item.cod ? 'active' : ''}`} onClick={() => onToggleCod(item.id)} />
              </div>
            </>
          )}
        </div>
      ))}
    </section>
  )
}

export default SellerShippingSection
