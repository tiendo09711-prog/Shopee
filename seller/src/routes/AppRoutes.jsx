import { Navigate, Route, Routes } from 'react-router-dom'
import SellerLogin from '../pages/Seller/SellerLogin'
import SellerRegister from '../pages/Seller/SellerRegister'
import SellerWelcome from '../pages/Seller/SellerWelcome'
import SellerOnboardingShopInfo from '../pages/Seller/SellerOnboardingShopInfo'
import SellerOnboardingShipping from '../pages/Seller/SellerOnboardingShipping'
import SellerOnboardingIdentity from '../pages/Seller/SellerOnboardingIdentity'
import SellerOnboardingTax from '../pages/Seller/SellerOnboardingTax'
import SellerOnboardingDone from '../pages/Seller/SellerOnboardingDone'
import SellerDashboard from '../pages/Seller/SellerDashboard'
import SellerProducts from '../pages/Seller/SellerProducts'
import SellerOrders from '../pages/Seller/SellerOrders'
import SellerShipping from '../pages/Seller/SellerShipping'
import SellerFinance from '../pages/Seller/SellerFinance'
import SellerDataCenter from '../pages/Seller/SellerDataCenter'
import SellerSupport from '../pages/Seller/SellerSupport'
import SellerMarketing from '../pages/Seller/SellerMarketing'
import SellerPlaceholder from '../pages/Seller/SellerPlaceholder'
import { useAuth } from '../contexts/AuthContext'
import { useSeller } from '../contexts/SellerContext'

function RequireSellerAuth({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/seller/login" replace />
}

function RequireSellerReady({ children }) {
  const { hasSellerAccount, isSellerReady } = useSeller()
  if (!hasSellerAccount) return <Navigate to="/seller/register" replace />
  if (!isSellerReady) return <Navigate to="/seller/onboarding/welcome" replace />
  return children
}

function SellerEntryRedirect() {
  const { isAuthenticated } = useAuth()
  const { hasSellerAccount, isSellerReady } = useSeller()

  if (!isAuthenticated) return <Navigate to="/seller/login" replace />
  if (!hasSellerAccount) return <Navigate to="/seller/register" replace />
  if (!isSellerReady) return <Navigate to="/seller/onboarding/welcome" replace />
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
      <Route path="/seller/onboarding/welcome" element={<RequireSellerAuth><SellerWelcome /></RequireSellerAuth>} />
      <Route path="/seller/onboarding/shop-info" element={<RequireSellerAuth><SellerOnboardingShopInfo /></RequireSellerAuth>} />
      <Route path="/seller/onboarding/shipping" element={<RequireSellerAuth><SellerOnboardingShipping /></RequireSellerAuth>} />
      <Route path="/seller/onboarding/identity" element={<RequireSellerAuth><SellerOnboardingIdentity /></RequireSellerAuth>} />
      <Route path="/seller/onboarding/tax" element={<RequireSellerAuth><SellerOnboardingTax /></RequireSellerAuth>} />
      <Route path="/seller/onboarding/done" element={<RequireSellerAuth><SellerOnboardingDone /></RequireSellerAuth>} />
      <Route path="/seller/dashboard" element={<RequireSellerAuth><RequireSellerReady><SellerDashboard /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/products" element={<RequireSellerAuth><RequireSellerReady><SellerProducts /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/products/new" element={<RequireSellerAuth><RequireSellerReady><SellerPlaceholder title="Thêm sản phẩm" /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/products/categories" element={<RequireSellerAuth><RequireSellerReady><SellerPlaceholder title="Phân loại sản phẩm" /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/orders" element={<RequireSellerAuth><RequireSellerReady><SellerOrders /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/shipping" element={<RequireSellerAuth><RequireSellerReady><SellerShipping /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/shipping/bulk" element={<RequireSellerAuth><RequireSellerReady><SellerPlaceholder title="Giao hàng loạt" /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/finance" element={<RequireSellerAuth><RequireSellerReady><SellerFinance /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/data" element={<RequireSellerAuth><RequireSellerReady><SellerDataCenter /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/support" element={<RequireSellerAuth><RequireSellerReady><SellerSupport /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/marketing" element={<RequireSellerAuth><RequireSellerReady><SellerMarketing /></RequireSellerReady></RequireSellerAuth>} />
      <Route path="/seller/notifications" element={<RequireSellerAuth><RequireSellerReady><SellerPlaceholder title="Thông báo" /></RequireSellerReady></RequireSellerAuth>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
