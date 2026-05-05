import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { OrderProvider } from './contexts/OrderContext'
import { WishlistProvider } from './contexts/WishlistContext'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <WishlistProvider>
            <CartProvider>
              <OrderProvider>
                <ScrollToTop />
                <AppRoutes />
              </OrderProvider>
            </CartProvider>
          </WishlistProvider>
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
