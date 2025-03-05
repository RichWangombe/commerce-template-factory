
import { PropsWithChildren } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

type AuthWrapperProps = PropsWithChildren<{
  requireAuth?: boolean;
}>;

export function AuthWrapper({ children, requireAuth = false }: AuthWrapperProps) {
  const { isLoaded, isSignedIn } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    // You could return a loading spinner here
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (requireAuth && !isSignedIn) {
    // Redirect to sign-in page if authentication is required but user is not signed in
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
