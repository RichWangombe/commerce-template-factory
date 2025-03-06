
import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { OrderTracker } from "@/components/order/OrderTracker";
import { Order } from "@/types/checkout";

// Mock data for a sample order - in a real app, this would come from an API
const mockOrder: Order = {
  id: "ORD123456789",
  userId: "user123",
  items: [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 79.99,
      quantity: 1,
      image: "/placeholder.svg",
      variant: "Black",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 129.99,
      quantity: 1,
      image: "/placeholder.svg",
    },
  ],
  shippingAddress: {
    firstName: "John",
    lastName: "Doe",
    address1: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
    country: "United States",
    phone: "555-123-4567",
  },
  billingAddress: {
    firstName: "John",
    lastName: "Doe",
    address1: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
    country: "United States",
    phone: "555-123-4567",
  },
  shippingMethod: {
    id: "express",
    name: "Express Shipping",
    description: "Delivered in 2-3 business days",
    price: 12.99,
    estimatedDays: "2-3 business days",
  },
  paymentMethod: "card",
  subtotal: 209.98,
  tax: 17.85,
  shipping: 12.99,
  total: 240.82,
  status: "shipped",
  createdAt: "2023-09-15T10:30:00Z",
  trackingNumber: "TRK9876543210",
  estimatedDelivery: "September 18, 2023",
  statusHistory: [
    {
      status: "pending",
      timestamp: "2023-09-15T10:30:00Z",
      description: "Order received",
    },
    {
      status: "processing",
      timestamp: "2023-09-15T14:20:00Z",
      description: "Payment confirmed, preparing your order",
    },
    {
      status: "shipped",
      timestamp: "2023-09-16T09:15:00Z",
      location: "Distribution Center, Los Angeles, CA",
      description: "Your order has been shipped",
    },
  ],
};

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  
  // In a real app, we would fetch the order data based on the orderId
  // const { data: order, isLoading, error } = useQuery(['order', orderId], fetchOrderById);
  
  // For this example, we're using mock data
  const order = mockOrder;

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
