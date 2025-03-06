
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export const SettingsTab: React.FC = () => {
  const { toast } = useToast();
  const [marketingEmails, setMarketingEmails] = React.useState(true);
  const [orderUpdates, setOrderUpdates] = React.useState(true);
  const [productUpdates, setProductUpdates] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  
  const handleSavePreferences = () => {
    // In a real app, this would be an API call to save user preferences
    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated.",
    });
  };
  
  const handleDeleteAccount = () => {
    // In a real app, this would be an API call to delete the user's account
    toast({
      title: "Account deletion requested",
      description: "We've received your request to delete your account. You'll receive an email with further instructions.",
    });
  };

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Control what types of notifications you receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="marketing-emails" className="flex flex-col space-y-1">
              <span>Marketing emails</span>
              <span className="text-xs font-normal text-muted-foreground">
                Receive emails about new products, features, and more.
              </span>
            </Label>
            <Switch
              id="marketing-emails"
              checked={marketingEmails}
              onCheckedChange={setMarketingEmails}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="order-updates" className="flex flex-col space-y-1">
              <span>Order updates</span>
              <span className="text-xs font-normal text-muted-foreground">
                Receive notifications about your order status.
              </span>
            </Label>
            <Switch
              id="order-updates"
              checked={orderUpdates}
              onCheckedChange={setOrderUpdates}
            />
          </div>
          
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="product-updates" className="flex flex-col space-y-1">
              <span>Product updates</span>
              <span className="text-xs font-normal text-muted-foreground">
                Get notified when products you've viewed are on sale.
              </span>
            </Label>
            <Switch
              id="product-updates"
              checked={productUpdates}
              onCheckedChange={setProductUpdates}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSavePreferences}>
            Save Preferences
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
          <CardDescription>
            Customize your browsing experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
              <span>Dark mode</span>
              <span className="text-xs font-normal text-muted-foreground">
                Switch between light and dark themes.
              </span>
            </Label>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions that affect your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Deleting your account will remove all your personal data, orders, and preferences. This action cannot be undone.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </>
  );
};
