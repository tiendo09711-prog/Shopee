import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home/Home'
import ProductDetail from '../pages/ProductDetail/ProductDetail'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword'
import Cart from '../pages/Cart/Cart'
import CheckoutPage from '../pages/Checkout/CheckoutPage'
import NotFound from '../pages/NotFound/NotFound'
import PurchasePage from '../pages/Purchase/PurchasePage'
import OrderDetailPage from '../pages/Purchase/OrderDetailPage'
import ProfilePage from '../pages/Profile/ProfilePage'
import ChangePasswordPage from '../pages/Profile/ChangePasswordPage'
import ShopPage from '../pages/Shop/ShopPage'
import WishlistPage from '../pages/Wishlist/WishlistPage'
import NotificationsPage from '../pages/Notifications/NotificationsPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:slug" element={<ProductDetail />} />
      <Route path="/shop/:shopId" element={<ShopPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/user/account" element={<ProfilePage />} />
      <Route path="/user/password" element={<ChangePasswordPage />} />
      <Route path="/user/purchase" element={<PurchasePage />} />
      <Route path="/user/purchase/:orderId" element={<OrderDetailPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
