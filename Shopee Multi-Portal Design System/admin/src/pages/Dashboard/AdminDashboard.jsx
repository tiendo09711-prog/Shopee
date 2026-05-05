import { formatCurrency, getOrders, getProducts, getSellers, getUsers } from '../../services/adminStore.service'

function AdminDashboard() {
  const users = getUsers()
  const sellers = getSellers()
  const products = getProducts()
  const orders = getOrders()
  const today = new Date().toDateString()
  const revenueToday = orders.filter((order) => new Date(order.createdAt).toDateString() === today && ['completed', 'delivered'].includes(order.status)).reduce((sum, order) => sum + Number(order.finalTotal || 0), 0)
  const revenueMonth = orders.filter((order) => ['completed', 'delivered'].includes(order.status)).reduce((sum, order) => sum + Number(order.finalTotal || 0), 0)
  const topProducts = [...products].sort((a, b) => Number(b.sold || 0) - Number(a.sold || 0)).slice(0, 5)
  const topSellers = sellers.map((seller) => ({ ...seller, productsCount: products.filter((product) => product.shopId === seller.id || product.sellerId === seller.id).length })).sort((a, b) => b.productsCount - a.productsCount).slice(0, 5)

  return (
    <div className="admin-page">
      <header className="admin-hero"><p className="admin-eyebrow">Dashboard</p><h1>Tổng quan PShop</h1><p className="admin-hero-copy">Số liệu được tính từ localStorage chung của customer/seller/admin.</p></header>
      <section className="admin-summary-grid">
        <article className="admin-card"><span>Doanh thu hôm nay</span><strong>{formatCurrency(revenueToday)}</strong></article>
        <article className="admin-card"><span>Doanh thu tháng</span><strong>{formatCurrency(revenueMonth)}</strong></article>
        <article className="admin-card"><span>Tổng đơn</span><strong>{orders.length}</strong></article>
        <article className="admin-card"><span>Đơn chờ xử lý</span><strong>{orders.filter((order) => order.status === 'pending').length}</strong></article>
        <article className="admin-card"><span>Customer</span><strong>{users.filter((user) => user.role !== 'admin').length}</strong></article>
        <article className="admin-card"><span>Seller</span><strong>{sellers.length}</strong></article>
        <article className="admin-card"><span>Active products</span><strong>{products.filter((product) => product.status === 'active').length}</strong></article>
        <article className="admin-card"><span>Pending products</span><strong>{products.filter((product) => product.status === 'pending_review').length}</strong></article>
      </section>
      <section className="admin-panel"><h2>Top sản phẩm</h2><table className="admin-table"><tbody>{topProducts.map((product) => <tr key={product.id}><td>{product.name}</td><td>{product.sold || 0} bán</td><td>{formatCurrency(product.price)}</td></tr>)}</tbody></table></section>
      <section className="admin-panel"><h2>Top seller</h2><table className="admin-table"><tbody>{topSellers.map((seller) => <tr key={seller.id}><td>{seller.shopName}</td><td>{seller.status}</td><td>{seller.productsCount} sản phẩm</td></tr>)}</tbody></table></section>
    </div>
  )
}

export default AdminDashboard
