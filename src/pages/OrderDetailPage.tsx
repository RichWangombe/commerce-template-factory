
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { OrderTracker } from "@/components/order/OrderTracker";
import { Order } from "@/types/checkout";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
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
  }, [orderId, toast]);

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
            
            <OrderTracker order={order} />
            
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Shipping Information</h2>
                <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                  <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && <p>Phone: {order.shippingAddress.phone}</p>}
                </div>
                
                <h2 className="text-lg font-medium">Shipping Method</h2>
                <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                  <p className="font-medium">{order.shippingMethod.name}</p>
                  <p className="text-sm text-muted-foreground">{order.shippingMethod.description}</p>
                  <p className="mt-1">${order.shippingMethod.price.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Order Summary</h2>
                <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${order.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-neutral-200 pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-lg font-medium">Payment Information</h2>
                <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                  <p>Payment Method: {order.paymentMethod === 'card' ? 'Credit Card' : order.paymentMethod}</p>
                  <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    Order Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Need Help?</h2>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline">Contact Support</Button>
                <Button variant="outline">Request Return</Button>
                <Button variant="outline">Cancel Order</Button>
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
