
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import NotFound from "./pages/NotFound";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import WishlistPage from "./pages/WishlistPage";
import SearchPage from "./pages/SearchPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { ReviewProvider } from "./contexts/ReviewContext";
import { CartDrawer } from "./components/CartDrawer";
import { AuthWrapper } from "./components/AuthWrapper";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <WishlistProvider>
          <ReviewProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <CartDrawer />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/category/:categoryId" element={<CategoryPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                
                {/* Protected routes */}
                <Route 
                  path="/profile" 
                  element={
                    <AuthWrapper requireAuth>
                      <ProfilePage />
                    </AuthWrapper>
                  } 
                />
                <Route 
                  path="/order/:orderId" 
                  element={
                    <AuthWrapper requireAuth>
                      <OrderDetailPage />
                    </AuthWrapper>
                  } 
                />
                <Route 
                  path="/order-confirmation" 
                  element={
                    <AuthWrapper requireAuth>
                      <OrderConfirmationPage />
                    </AuthWrapper>
                  } 
                />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ReviewProvider>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
