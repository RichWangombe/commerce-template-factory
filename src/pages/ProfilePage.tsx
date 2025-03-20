
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProfileTab } from "@/components/profile/ProfileTab";
import { OrdersTab } from "@/components/profile/OrdersTab";
import { SettingsTab } from "@/components/profile/SettingsTab";
import { PreferencesTab } from "@/components/profile/PreferencesTab";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import { AuthWrapper } from "@/components/AuthWrapper";
import { useOrders } from "@/utils/dataFetchers";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Use the orders query hook
  const { data: orders, isLoading: ordersLoading, isError: ordersError } = useOrders();

  const renderOrdersTabContent = () => {
    if (ordersLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      );
    }

    if (ordersError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was a problem loading your orders. Please try again later.
          </AlertDescription>
        </Alert>
      );
    }

    return <OrdersTab orders={orders} />;
  };

  return (
    <AuthWrapper requireAuth>
      <UserPreferencesProvider>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 bg-gray-50 py-10">
            <div className="container mx-auto px-4">
              <h1 className="mb-8 text-3xl font-bold">My Account</h1>
              
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="space-y-8"
              >
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-[600px]">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="orders">
                    Orders
                    {orders && orders.length > 0 && (
                      <span className="ml-1 text-xs bg-primary text-white rounded-full px-1.5 py-0.5">
                        {orders.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="space-y-6">
                  <ProfileTab />
                </TabsContent>
                
                <TabsContent value="orders" className="space-y-6">
                  {renderOrdersTabContent()}
                </TabsContent>
                
                <TabsContent value="preferences" className="space-y-6">
                  <PreferencesTab />
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-6">
                  <SettingsTab />
                </TabsContent>
              </Tabs>
            </div>
          </main>
          <Footer />
        </div>
      </UserPreferencesProvider>
    </AuthWrapper>
  );
};

export default ProfilePage;
