import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import AdminLayout from '../layout/AdminLayout'
import AdminLogin from '../pages/Login/AdminLogin'
import Forbidden from '../pages/Forbidden'
import AdminDashboard from '../pages/Dashboard/AdminDashboard'
import AdminCategories from '../pages/Categories/AdminCategories'
import AdminProducts from '../pages/Products/AdminProducts'
import AdminPendingProducts from '../pages/Products/AdminPendingProducts'
import AdminOrders from '../pages/Orders/AdminOrders'
import AdminCustomers from '../pages/Customers/AdminCustomers'
import AdminSellers from '../pages/Sellers/AdminSellers'
import AdminReports from '../pages/Reports/AdminReports'
import AdminSettings from '../pages/Settings/AdminSettings'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const { isAuthenticated, user } = useAdminAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (user?.role !== 'admin') return <Forbidden />
  return children
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/pending" element={<AdminPendingProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="sellers" element={<AdminSellers />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AdminRoutes
