import { Navigate } from 'react-router-dom'
import MainLayout from '../../layout/MainLayout'
import ProductCard from '../../components/ProductCard/ProductCard'
import { useAuth } from '../../contexts/AuthContext'
import { useWishlist } from '../../contexts/WishlistContext'
import './WishlistPage.css'

function WishlistPage() {
  const { isAuthenticated } = useAuth()
  const { wishlistProducts } = useWishlist()

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: '/wishlist' }} />

  return (
    <MainLayout>
      <div className="container page-spacing wishlist-page">
        <div className="card wishlist-header">
          <h1>Sản phẩm yêu thích</h1>
          <p>{wishlistProducts.length} sản phẩm đã lưu</p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="empty-message card">Bạn chưa lưu sản phẩm nào.</div>
        ) : (
          <div className="wishlist-grid">
            {wishlistProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default WishlistPage