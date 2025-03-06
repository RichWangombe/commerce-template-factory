
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

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

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
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="space-y-6">
                  <ProfileTab />
                </TabsContent>
                
                <TabsContent value="orders" className="space-y-6">
                  <OrdersTab />
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
