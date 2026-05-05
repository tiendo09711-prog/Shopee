import { AuthProvider } from './contexts/AuthContext'
import { SellerProvider } from './contexts/SellerContext'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <AuthProvider>
      <SellerProvider>
        <ScrollToTop />
        <AppRoutes />
      </SellerProvider>
    </AuthProvider>
  )
}

export default App
