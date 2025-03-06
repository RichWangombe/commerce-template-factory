
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useEffect } from "react";

// In a real app, you would check if the user has admin role
// by fetching this information from your backend
const isAdmin = (userId: string | undefined) => {
  // For demo purposes, we'll consider a specific user ID as admin
  // Replace this with actual logic in a real application
  return userId === "user123"; // Just an example, modify as needed
};

interface AdminWrapperProps {
  children: React.ReactNode;
}

export const AdminWrapper: React.FC<AdminWrapperProps> = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && !isAdmin(user.id)) {
      toast.error("You don't have permission to access the admin area.");
    }
  }, [isLoaded, isSignedIn, user?.id]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    toast.error("Please sign in to access the admin area.");
    return <Navigate to="/sign-in" replace />;
  }

  if (!isAdmin(user.id)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
