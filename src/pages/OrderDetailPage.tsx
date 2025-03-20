
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { OrderDetail } from "@/components/order/OrderDetail";
import { OrderHistory } from "@/components/order/OrderHistory";
import { Order } from "@/types/checkout";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useOrderProcessing } from "@/hooks/useOrderProcessing";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { cancelOrder } = useOrderProcessing();
  
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        setIsLoading(true);
        const fetchedOrder = await apiService.getOrderById(orderId);
        
        // Verify user is authorized to view this order
        if (fetchedOrder && user && fetchedOrder.userId !== user.id) {
          toast({
            title: "Unauthorized",
            description: "You don't have permission to view this order.",
            variant: "destructive",
          });
          navigate("/profile");
          return;
        }
        
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
  }, [orderId, toast, user, navigate]);

  const handleCancelOrder = async () => {
    if (!order) return;
    
    try {
      await cancelOrder(order.id);
      // Update the local order state to show the cancelled status immediately
      setOrder({
        ...order,
        status: "cancelled",
        statusHistory: [
          ...(order.statusHistory || []),
          {
            status: "cancelled",
            timestamp: new Date().toISOString(),
            description: "Order cancelled by customer",
          }
        ]
      });
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast({
        title: "Error",
        description: "Could not cancel the order. Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
              <p className="mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
              <Button asChild>
                <Link to="/profile">Back to My Account</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Helper function to determine if an order can be cancelled
  const canCancelOrder = (orderStatus: Order["status"]) => {
    return ["pending", "processing"].includes(orderStatus);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6">
              <Link to="/profile">
                <Button variant="ghost" className="mb-4 px-0">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to My Account
                </Button>
              </Link>
              <h1 className="text-2xl font-bold md:text-3xl">Order Details</h1>
            </div>
            
            <OrderDetail order={order} />
            
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Order Timeline</h2>
              <OrderHistory order={order} />
            </div>
            
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Need Help?</h2>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" asChild>
                  <Link to="/support">Contact Support</Link>
                </Button>
                
                {order.status === "delivered" && (
                  <Button variant="outline">Request Return</Button>
                )}
                
                {canCancelOrder(order.status) && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline">Cancel Order</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel this order? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No, keep my order</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancelOrder}>
                          Yes, cancel order
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderDetailPage;
