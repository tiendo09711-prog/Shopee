import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { OrderProvider } from './contexts/OrderContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <AppRoutes />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App