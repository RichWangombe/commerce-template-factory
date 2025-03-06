
import { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Spinner } from "@/components/ui/spinner";
import { ProfileTab } from "@/components/profile/ProfileTab";
import { OrdersTab } from "@/components/profile/OrdersTab";
import { SettingsTab } from "@/components/profile/SettingsTab";
import { Order } from "@/types/checkout";

// Mock data for orders - in a real app, this would come from an API
const mockOrders: Order[] = [
  {
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
    notes: "Please leave package at the front door.",
  },
  {
    id: "ORD987654321",
    userId: "user123",
    items: [
      {
        id: 3,
        name: "Bluetooth Speaker",
        price: 49.99,
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
      id: "standard",
      name: "Standard Shipping",
      description: "Delivered in 5-7 business days",
      price: 4.99,
      estimatedDays: "5-7 business days",
    },
    paymentMethod: "card",
    subtotal: 49.99,
    tax: 4.25,
    shipping: 4.99,
    total: 59.23,
    status: "delivered",
    createdAt: "2023-08-20T14:45:00Z",
    statusHistory: [
      {
        status: "pending",
        timestamp: "2023-08-20T14:45:00Z",
        description: "Order received",
      },
      {
        status: "processing",
        timestamp: "2023-08-20T15:30:00Z",
        description: "Payment confirmed",
      },
      {
        status: "shipped",
        timestamp: "2023-08-21T09:15:00Z",
        location: "Distribution Center",
        description: "Package shipped",
      },
      {
        status: "delivered",
        timestamp: "2023-08-24T13:20:00Z",
        location: "Delivery Address",
        description: "Package delivered successfully",
      },
    ],
  },
  {
    id: "ORD543219876",
    userId: "user123",
    items: [
      {
        id: 4,
        name: "Coffee Maker",
        price: 89.99,
        quantity: 1,
        image: "/placeholder.svg",
      },
      {
        id: 5,
        name: "Coffee Beans",
        price: 14.99,
        quantity: 2,
        image: "/placeholder.svg",
        variant: "Dark Roast",
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
      id: "standard",
      name: "Standard Shipping",
      description: "Delivered in 5-7 business days",
      price: 4.99,
      estimatedDays: "5-7 business days",
    },
    paymentMethod: "card",
    subtotal: 119.97,
    tax: 10.20,
    shipping: 4.99,
    total: 135.16,
    status: "cancelled",
    createdAt: "2023-07-05T09:22:00Z",
    refundStatus: "full",
    refundAmount: 135.16,
  },
];

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  const { toast } = useToast();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out.",
        variant: "destructive",
      });
    }
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    const first = user?.firstName?.[0] || "";
    const last = user?.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold md:text-3xl">{user.fullName}</h1>
                  <p className="text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile" className="mt-6">
                <ProfileTab />
              </TabsContent>
              
              <TabsContent value="orders" className="mt-6">
                <OrdersTab orders={mockOrders} />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-6">
                <SettingsTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
