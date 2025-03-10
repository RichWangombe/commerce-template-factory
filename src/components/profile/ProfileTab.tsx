
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";
import { useUserData } from "@/utils/auth";

export const ProfileTab: React.FC = () => {
  const { user, getUserName, getUserEmail } = useUserData();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Extract first and last name from user metadata
  const firstName = user?.user_metadata?.first_name || "";
  const lastName = user?.user_metadata?.last_name || "";
  const email = getUserEmail();
  
  // Form state
  const [formFirstName, setFormFirstName] = useState(firstName);
  const [formLastName, setFormLastName] = useState(lastName);
  const [username, setUsername] = useState(user?.username || "");

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsUpdating(true);
      
      // In mock mode, just simulate a successful update
      setTimeout(() => {
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        });
        setIsUpdating(false);
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal details here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={formFirstName}
                onChange={(e) => setFormFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                value={formLastName}
                onChange={(e) => setFormLastName(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
            />
            <p className="text-xs text-muted-foreground">
              To change your email, you need to verify your identity through security settings.
            </p>
          </div>
          
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
