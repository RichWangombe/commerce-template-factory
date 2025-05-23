
import { PropsWithChildren, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthFunctions, useUserData } from "@/utils/auth";

type AuthWrapperProps = PropsWithChildren<{
  requireAuth?: boolean;
  adminOnly?: boolean;
}>;

export function AuthWrapper({ children, requireAuth = false, adminOnly = false }: AuthWrapperProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const { isAdmin } = useUserData();
  const { getToken } = useAuthFunctions();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Example of how to get the auth token when needed
    const fetchToken = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          // You can use this token for authenticated API calls
          console.log("Auth token available for API calls");
        } catch (error) {
          console.error("Error getting token:", error);
        }
      }
    };

    fetchToken();
  }, [isSignedIn, getToken]);

  if (!isLoaded) {
    // You could return a loading spinner here
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (requireAuth && !isSignedIn) {
    // Redirect to sign-in page if authentication is required but user is not signed in
    toast({
      title: "Authentication required",
      description: "Please sign in to access this page",
      variant: "destructive",
    });
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (adminOnly && (!isSignedIn || !isAdmin())) {
    // Redirect to home page if admin access is required but user is not an admin
    toast({
      title: "Access denied",
      description: "You don't have permission to access this page",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
