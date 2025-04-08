import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/toast';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserPreferencesProvider } from '@/contexts/UserPreferencesContext';
import { RecommendationProvider } from '@/contexts/recommendation';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { QueryProvider } from '@/providers/QueryProvider';
import { HomePage } from '@/pages/HomePage';
import { AboutPage } from '@/pages/AboutPage';
import { CartPage } from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
import OrderDetailPage from '@/pages/OrderDetailPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ContactPage } from '@/pages/ContactPage';
import NotFound from '@/pages/NotFound';
import SearchPage from '@/pages/SearchPage';
import AllProductsPage from '@/pages/AllProductsPage';
import { CategoryPage } from '@/pages/CategoryPage';
import CategoriesPage from '@/pages/CategoriesPage';
import NewArrivalsPage from '@/pages/NewArrivalsPage';
import SignInPage from '@/pages/SignInPage';
import WishlistPage from '@/pages/WishlistPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import RecommendationsPage from '@/pages/RecommendationsPage';
import ErrorBoundary from '@/components/ErrorBoundary';


function App() {
  // Assuming Router is the Routes component from react-router-dom
  const Router = Routes;
  if (!Router) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Application...</h1>
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          <CartProvider>
            <UserPreferencesProvider>
              <RecommendationProvider>
                <WishlistProvider>
                  <ToastProvider>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/category/:categoryName" element={<CategoryPage />} />
                      <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                      <Route path="/order/:id" element={<OrderDetailPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/products" element={<AllProductsPage />} />
                      <Route path="/categories" element={<CategoriesPage />} />
                      <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                      <Route path="/sign-in" element={<SignInPage />} />
                      <Route path="/wishlist" element={<WishlistPage />} />
                      <Route path="/recommendations" element={<RecommendationsPage />} />
                      <Route path="/auth/callback" element={<AuthCallbackPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Toaster />
                  </ToastProvider>
                </WishlistProvider>
              </RecommendationProvider>
            </UserPreferencesProvider>
          </CartProvider>
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;