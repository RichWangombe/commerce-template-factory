
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUserData } from "@/utils/auth";
import { Loader, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const AvatarUpload: React.FC = () => {
  const { user, getUserInitials, getImageUrl } = useUserData();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(getImageUrl());

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      // Check if file is an image and less than 2MB
      if (!file.type.match(/image\/(jpeg|png|gif|jpg|webp)/)) {
        throw new Error("Please upload an image file.");
      }

      if (file.size > 2 * 1024 * 1024) {
        throw new Error("File size must be less than 2MB.");
      }

      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: data.publicUrl }
      });

      if (updateError) {
        throw updateError;
      }

      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", user?.id);

      if (profileError) {
        throw profileError;
      }

      setAvatarUrl(data.publicUrl);
      toast.success("Avatar updated", {
        description: "Your profile picture has been updated successfully.",
      });
    } catch (error: any) {
      toast.error("Upload failed", {
        description: error.message || "There was an error uploading the avatar.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarUrl} alt="Profile" />
        <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
      </Avatar>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="relative"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Photo
            </>
          )}
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={isUploading}
          />
        </Button>
        
        {avatarUrl && (
          <Button
            variant="outline"
            size="sm"
            disabled={isUploading}
            onClick={async () => {
              try {
                setIsUploading(true);
                // Update user metadata
                const { error: updateError } = await supabase.auth.updateUser({
                  data: { avatar_url: null }
                });

                if (updateError) throw updateError;

                // Update profile in profiles table
                const { error: profileError } = await supabase
                  .from("profiles")
                  .update({ avatar_url: null })
                  .eq("id", user?.id);

                if (profileError) throw profileError;

                setAvatarUrl("");
                toast.success("Avatar removed", {
                  description: "Your profile picture has been removed.",
                });
              } catch (error: any) {
                toast.error("Error", {
                  description: error.message || "Failed to remove avatar",
                });
              } finally {
                setIsUploading(false);
              }
            }}
          >
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};
