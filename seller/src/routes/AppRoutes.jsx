import { Navigate, Route, Routes } from 'react-router-dom'
import SellerLogin from '../pages/Seller/SellerLogin'
import SellerRegister from '../pages/Seller/SellerRegister'
import SellerDashboard from '../pages/Seller/SellerDashboard'
import SellerProducts from '../pages/Seller/SellerProducts'
import SellerProductForm from '../pages/Seller/SellerProductForm'
import SellerProductDetail from '../pages/Seller/SellerProductDetail'
import SellerOrders from '../pages/Seller/SellerOrders'
import SellerOrderDetail from '../pages/Seller/SellerOrderDetail'
import SellerShipping from '../pages/Seller/SellerShipping'
import SellerFinance from '../pages/Seller/SellerFinance'
import SellerDataCenter from '../pages/Seller/SellerDataCenter'
import SellerSupport from '../pages/Seller/SellerSupport'
import SellerChat from '../pages/Seller/SellerChat'
import SellerMarketing from '../pages/Seller/SellerMarketing'
import SellerPlaceholder from '../pages/Seller/SellerPlaceholder'
import { useAuth } from '../contexts/AuthContext'
import { useSeller } from '../contexts/SellerContext'

function RequireSellerAuth({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/seller/login" replace />
}

function RequireSellerReady({ children }) {
  const { hasSellerAccount } = useSeller()
  if (!hasSellerAccount) return <Navigate to="/seller/register" replace />
  return children
}

function SellerEntryRedirect() {
  const { isAuthenticated } = useAuth()
  const { hasSellerAccount } = useSeller()

  if (!isAuthenticated) return <Navigate to="/seller/login" replace />
  if (!hasSellerAccount) return <Navigate to="/seller/register" replace />
  return <Navigate to="/seller/dashboard" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SellerEntryRedirect />} />
      <Route path="/seller" element={<SellerEntryRedirect />} />
      <Route path="/login" element={<Navigate to="/seller/login" replace />} />
      <Route path="/register" element={<Navigate to="/seller/register" replace />} />

      <Route path="/seller/login" element={<SellerLogin />} />
      <Route path="/seller/register" element={<SellerRegister />} />
      <Route path="/seller/dashboard" element={<RequireSellerAuth><RequireSellerReady><SellerDashboard /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/products" element={<RequireSellerAuth><RequireSellerReady><SellerProducts /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/products/new" element={<RequireSellerAuth><RequireSellerReady><SellerProductForm /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/products/:productId" element={<RequireSellerAuth><RequireSellerReady><SellerProductDetail /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/products/:productId/edit" element={<RequireSellerAuth><RequireSellerReady><SellerProductForm /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/products/categories" element={<RequireSellerAuth><RequireSellerReady><SellerPlaceholder title="Phân loại sản phẩm" /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/orders" element={<RequireSellerAuth><RequireSellerReady><SellerOrders /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/orders/:orderId" element={<RequireSellerAuth><RequireSellerReady><SellerOrderDetail /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/shipping" element={<RequireSellerAuth><RequireSellerReady><SellerShipping /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/shipping/bulk" element={<RequireSellerAuth><RequireSellerReady><SellerPlaceholder title="Giao hàng loạt" /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/finance" element={<RequireSellerAuth><RequireSellerReady><SellerFinance /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/data" element={<RequireSellerAuth><RequireSellerReady><SellerDataCenter /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/chat" element={<RequireSellerAuth><RequireSellerReady><SellerChat /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/support" element={<RequireSellerAuth><RequireSellerReady><SellerSupport /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/marketing" element={<RequireSellerAuth><RequireSellerReady><SellerMarketing /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/notifications" element={<RequireSellerAuth><RequireSellerReady><SellerPlaceholder title="Thông báo" /></RequireSellerReady></RequireSellerAuth>} />

      <Route path="/seller/onboarding/*" element={<Navigate to="/seller/register" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
