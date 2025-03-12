
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useUserData } from "@/utils/auth";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PasswordChangeForm } from "./PasswordChangeForm";
import { AvatarUpload } from "./AvatarUpload";

export const ProfileTab: React.FC = () => {
  const { user, getUserEmail } = useUserData();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  // Extract first and last name from user metadata
  const firstName = user?.user_metadata?.first_name || "";
  const lastName = user?.user_metadata?.last_name || "";
  const email = getUserEmail();
  
  // Form state
  const [formFirstName, setFormFirstName] = useState(firstName);
  const [formLastName, setFormLastName] = useState(lastName);
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");

  // Fetch profile data from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        if (data) {
          setProfile(data);
          setFormFirstName(data.first_name || firstName);
          setFormLastName(data.last_name || lastName);
          setUsername(data.username || "");
          setPhone(data.phone || "");
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, firstName, lastName]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Error", {
        description: "You must be logged in to update your profile.",
      });
      return;
    }
    
    try {
      setIsUpdating(true);
      
      // First, update user metadata in auth
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          first_name: formFirstName,
          last_name: formLastName,
        }
      });
      
      if (metadataError) throw metadataError;
      
      // Then update the profile in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: formFirstName,
          last_name: formLastName,
          username: username || null, // Use null if empty to avoid unique constraint issues
          phone: phone || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      toast.success("Profile updated", {
        description: "Your profile information has been updated successfully.",
      });
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "Failed to update profile.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 flex justify-center items-center">
          <Loader className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="info">Personal Info</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="avatar">Profile Picture</TabsTrigger>
      </TabsList>
      
      <TabsContent value="info">
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
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
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
      </TabsContent>
      
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password here. Password must be at least 6 characters.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordChangeForm />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="avatar">
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>
              Upload or update your profile picture. Max size 2MB.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <AvatarUpload />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
