
import { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrdersList } from "@/components/order/OrdersList";
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
  },
];

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Form state
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsUpdating(true);
      
      await user.update({
        firstName,
        lastName,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

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
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your account details here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First name</Label>
                          <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last name</Label>
                          <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={user.primaryEmailAddress?.emailAddress || ""}
                          disabled
                        />
                      </div>
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? "Updating..." : "Update Profile"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>
                      View your past orders and track shipments.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <OrdersList orders={mockOrders} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account settings and preferences.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <select
                        id="language"
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <h3 className="text-base font-medium">Marketing emails</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about new products, features, and more.
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          value=""
                          className="peer sr-only"
                          defaultChecked
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:border-gray-600 dark:bg-gray-700"></div>
                      </label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full text-destructive">
                      Delete Account
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
