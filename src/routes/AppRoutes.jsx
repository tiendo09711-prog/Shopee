import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home/Home'
import ProductDetail from '../pages/ProductDetail/ProductDetail'
import Login from '../pages/Login/Login'
import Register from '../pages/Register/Register'
import Cart from '../pages/Cart/Cart'
import NotFound from '../pages/NotFound/NotFound'
import PurchasePage from '../pages/Purchase/PurchasePage'
import ProfilePage from '../pages/Profile/ProfilePage'
import ChangePasswordPage from '../pages/Profile/ChangePasswordPage'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:slug" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/user/account" element={<ProfilePage />} />
      <Route path="/user/password" element={<ChangePasswordPage />} />
      <Route path="/user/purchase" element={<PurchasePage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
