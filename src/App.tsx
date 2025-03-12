
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import HomePage from "@/pages/HomePage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CategoryPage from "@/pages/CategoryPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import ProfilePage from "@/pages/ProfilePage";
import NotFound from "@/pages/NotFound";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import PasswordResetPage from "@/pages/PasswordResetPage";
import UpdatePasswordPage from "@/pages/UpdatePasswordPage";
import WishlistPage from "@/pages/WishlistPage";
import OrderDetailPage from "@/pages/OrderDetailPage";
import SearchPage from "@/pages/SearchPage";
import RecommendationsPage from "@/pages/RecommendationsPage";

// Admin routes
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import AdminProductFormPage from "@/pages/admin/AdminProductFormPage";
import AdminRecommendationsPage from "@/pages/admin/AdminRecommendationsPage";

import Index from "@/pages/Index";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthWrapper } from "@/components/AuthWrapper";
import { AdminWrapper } from "@/components/AdminWrapper";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { QueryProvider } from "@/providers/QueryProvider";
import { SupabaseStatusChecker } from "@/components/SupabaseStatusChecker";
import { RecommendationProvider } from "@/contexts/recommendation";

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <UserPreferencesProvider>
          <RecommendationProvider>
            <SupabaseStatusChecker />
            <Toaster position="top-right" />
            
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
              <Route path="/order/:id" element={
                <AuthWrapper requireAuth>
                  <OrderDetailPage />
                </AuthWrapper>
              } />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/sign-in" element={<SignInPage />} />
              <Route path="/sign-up" element={<SignUpPage />} />
              <Route path="/reset-password" element={<PasswordResetPage />} />
              <Route path="/update-password" element={<UpdatePasswordPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={
                <AdminWrapper>
                  <AdminDashboardPage />
                </AdminWrapper>
              } />
              <Route path="/admin/products" element={
                <AdminWrapper>
                  <AdminProductsPage />
                </AdminWrapper>
              } />
              <Route path="/admin/products/new" element={
                <AdminWrapper>
                  <AdminProductFormPage />
                </AdminWrapper>
              } />
              <Route path="/admin/products/:id" element={
                <AdminWrapper>
                  <AdminProductFormPage />
                </AdminWrapper>
              } />
              <Route path="/admin/orders" element={
                <AdminWrapper>
                  <AdminOrdersPage />
                </AdminWrapper>
              } />
              <Route path="/admin/users" element={
                <AdminWrapper>
                  <AdminUsersPage />
                </AdminWrapper>
              } />
              <Route path="/admin/recommendations" element={
                <AdminWrapper>
                  <AdminRecommendationsPage />
                </AdminWrapper>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RecommendationProvider>
        </UserPreferencesProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
