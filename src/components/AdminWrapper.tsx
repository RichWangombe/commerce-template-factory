
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

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

  if (!isAdmin(user.id)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
