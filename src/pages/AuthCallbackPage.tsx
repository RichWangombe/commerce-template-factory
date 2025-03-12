
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Loader } from "lucide-react";

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from URL
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (data?.session) {
          toast.success("Successfully signed in");
          navigate("/");
        } else {
          // If no session found, maybe the user canceled the sign-in
          navigate("/sign-in");
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError(err.message);
        toast.error("Authentication failed", {
          description: err.message || "Something went wrong during authentication",
        });
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate("/sign-in");
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {error ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p>Redirecting you back...</p>
        </div>
      ) : (
        <div className="text-center">
          <Loader className="h-12 w-12 animate-spin mb-4 mx-auto" />
          <h1 className="text-2xl font-bold mb-2">Completing sign in...</h1>
          <p className="text-muted-foreground">Please wait while we authenticate you</p>
        </div>
      )}
    </div>
  );
}
