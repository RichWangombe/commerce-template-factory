
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import { Order } from "@/types/checkout";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { clearCart } = useCart();
  
  // Extract order ID from the URL if present
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('orderId');
  
  useEffect(() => {
    // Clear the cart once we're on the confirmation page
    clearCart();
    
    const fetchOrder = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const fetchedOrder = await apiService.getOrderById(orderId);
        setOrder(fetchedOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast({
          title: "Error",
          description: "Could not load order details. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId, toast, clearCart]);

  // If no order ID is in URL, show an error
  if (!orderId && !isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-2xl font-bold mb-4">No Order Found</h1>
            <p className="mb-6">We couldn't find an order to confirm. Please check your order history or try again.</p>
            <Button onClick={() => navigate("/profile")}>
              Go to My Account
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {isLoading ? (
            <div className="text-center py-12">
              <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading your order...</p>
            </div>
          ) : order ? (
            <OrderConfirmation order={order} />
          ) : (
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
              <p className="mb-6">We couldn't find the order details. Please check your order history.</p>
              <Button onClick={() => navigate("/profile")}>
                Go to My Account
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
