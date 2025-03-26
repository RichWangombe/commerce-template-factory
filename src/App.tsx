
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

function App() {
  return (
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
  );
}

export default App;
