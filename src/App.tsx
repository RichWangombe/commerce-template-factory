
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { RecommendationProvider } from '@/contexts/recommendation';
import { QueryProvider } from '@/providers/QueryProvider';
import { CartDrawer } from '@/components/CartDrawer';
import Index from '@/pages/Index';
import { HomePage } from '@/pages/HomePage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CategoryPage from '@/pages/CategoryPage';
import { CartPage } from '@/pages/CartPage';
import WishlistPage from '@/pages/WishlistPage';
import CheckoutPage from '@/pages/CheckoutPage';
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage';
import OrderDetailPage from '@/pages/OrderDetailPage';
import SearchPage from '@/pages/SearchPage';
import SignInPage from '@/pages/SignInPage';
import SignUpPage from '@/pages/SignUpPage';
import { ProfilePage } from '@/pages/ProfilePage';
import NotFound from '@/pages/NotFound';
import RecommendationsPage from '@/pages/RecommendationsPage';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminProductFormPage from '@/pages/admin/AdminProductFormPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminRecommendationsPage from '@/pages/admin/AdminRecommendationsPage';

function App() {
  return (
    <QueryProvider>
      <RecommendationProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/category/:id" element={<CategoryPage />} />
                <Route path="/cart" element={<CartPage />} />
                
                {/* Auth routes (now available to anyone) */}
                <Route path="/sign-in/*" element={<SignInPage />} />
                <Route path="/sign-up/*" element={<SignUpPage />} />
                
                {/* Routes that would normally be protected */}
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order/confirmation" element={<OrderConfirmationPage />} />
                <Route path="/order/:id" element={<OrderDetailPage />} />
                <Route path="/profile/*" element={<ProfilePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                
                {/* Admin routes */}
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/products" element={<AdminProductsPage />} />
                <Route path="/admin/products/new" element={<AdminProductFormPage />} />
                <Route path="/admin/products/edit/:id" element={<AdminProductFormPage />} />
                <Route path="/admin/orders" element={<AdminOrdersPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/recommendations" element={<AdminRecommendationsPage />} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            
            <CartDrawer />
            <Toaster position="top-right" richColors />
          </WishlistProvider>
        </CartProvider>
      </RecommendationProvider>
    </QueryProvider>
  );
}

export default App;
