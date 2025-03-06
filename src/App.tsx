
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from 'sonner';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { RecommendationProvider } from '@/contexts/RecommendationContext';
import { CartDrawer } from '@/components/CartDrawer';
import { Index } from '@/pages/Index';
import { HomePage } from '@/pages/HomePage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CategoryPage } from '@/pages/CategoryPage';
import { CartPage } from '@/pages/CartPage';
import { WishlistPage } from '@/pages/WishlistPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { OrderConfirmationPage } from '@/pages/OrderConfirmationPage';
import { OrderDetailPage } from '@/pages/OrderDetailPage';
import { SearchPage } from '@/pages/SearchPage';
import { SignInPage } from '@/pages/SignInPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { NotFound } from '@/pages/NotFound';
import { RecommendationsPage } from '@/pages/RecommendationsPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminProductFormPage } from '@/pages/admin/AdminProductFormPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
import { AdminRecommendationsPage } from '@/pages/admin/AdminRecommendationsPage';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
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
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                
                {/* Checkout flow */}
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order/confirmation" element={<OrderConfirmationPage />} />
                <Route path="/order/:id" element={<OrderDetailPage />} />
                
                {/* Auth */}
                <Route path="/sign-in/*" element={<SignInPage />} />
                <Route path="/sign-up/*" element={<SignUpPage />} />
                <Route path="/profile/*" element={<ProfilePage />} />
                
                {/* Admin */}
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route 
                  path="/admin/products" 
                  element={<AdminProductsPage />} 
                />
                <Route 
                  path="/admin/products/new" 
                  element={<AdminProductFormPage />} 
                />
                <Route 
                  path="/admin/products/edit/:id" 
                  element={<AdminProductFormPage />} 
                />
                <Route 
                  path="/admin/orders" 
                  element={<AdminOrdersPage />} 
                />
                <Route 
                  path="/admin/users" 
                  element={<AdminUsersPage />} 
                />
                <Route 
                  path="/admin/recommendations" 
                  element={<AdminRecommendationsPage />} 
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
    </ClerkProvider>
  );
}

export default App;
