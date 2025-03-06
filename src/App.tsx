
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from 'sonner';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { RecommendationProvider } from '@/contexts/recommendation';
import { QueryProvider } from '@/providers/QueryProvider';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthWrapper } from '@/components/AuthWrapper';
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

// Use a dummy key for development if the environment variable is not set
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_dummy-key-for-development';

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
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
                  
                  {/* Protected routes */}
                  <Route 
                    path="/wishlist" 
                    element={
                      <AuthWrapper requireAuth>
                        <WishlistPage />
                      </AuthWrapper>
                    } 
                  />
                  <Route 
                    path="/checkout" 
                    element={
                      <AuthWrapper requireAuth>
                        <CheckoutPage />
                      </AuthWrapper>
                    } 
                  />
                  <Route 
                    path="/order/confirmation" 
                    element={
                      <AuthWrapper requireAuth>
                        <OrderConfirmationPage />
                      </AuthWrapper>
                    } 
                  />
                  <Route 
                    path="/order/:id" 
                    element={
                      <AuthWrapper requireAuth>
                        <OrderDetailPage />
                      </AuthWrapper>
                    } 
                  />
                  
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/recommendations" element={<RecommendationsPage />} />
                  
                  {/* Auth routes */}
                  <Route path="/sign-in/*" element={<SignInPage />} />
                  <Route path="/sign-up/*" element={<SignUpPage />} />
                  <Route 
                    path="/profile/*" 
                    element={
                      <AuthWrapper requireAuth>
                        <ProfilePage />
                      </AuthWrapper>
                    } 
                  />
                  
                  {/* Admin routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <AuthWrapper requireAuth adminOnly>
                        <AdminDashboardPage />
                      </AuthWrapper>
                    } 
                  />
                  <Route 
                    path="/admin/products" 
                    element={
                      <AuthWrapper requireAuth adminOnly>
                        <AdminProductsPage />
                      </AuthWrapper>
                    } 
                  />
                  <Route 
                    path="/admin/products/new" 
                    element={
                      <AuthWrapper requireAuth adminOnly>
                        <AdminProductFormPage />
                      </AuthWrapper>
                    } 
                  />
                  <Route 
                    path="/admin/products/edit/:id" 
                    element={
                      <AuthWrapper requireAuth adminOnly>
                        <AdminProductFormPage />
                      </AuthWrapper>
                    } 
                  />
                  <Route 
                    path="/admin/orders" 
                    element={
                      <AuthWrapper requireAuth adminOnly>
                        <AdminOrdersPage />
                      </AuthWrapper>
                    } 
                  />
                  <Route 
                    path="/admin/users" 
                    element={
                      <AuthWrapper requireAuth adminOnly>
                        <AdminUsersPage />
                      </AuthWrapper>
                    } 
                  />
                  <Route 
                    path="/admin/recommendations" 
                    element={
                      <AuthWrapper requireAuth adminOnly>
                        <AdminRecommendationsPage />
                      </AuthWrapper>
                    } 
                  />
                  
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
    </ClerkProvider>
  );
}

export default App;
