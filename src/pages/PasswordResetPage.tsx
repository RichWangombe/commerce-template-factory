
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Loader } from "lucide-react";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast.error("Error", {
          description: error.message || "Failed to send password reset email",
        });
      } else {
        setIsSuccess(true);
        toast.success("Success", {
          description: "Password reset email sent. Please check your inbox.",
        });
      }
    } catch (err: any) {
      toast.error("An error occurred", {
        description: err.message || "Could not process your request",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Reset Password</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Enter your email to receive a password reset link
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Forgot your password?</CardTitle>
                <CardDescription>
                  We'll send you an email with a link to reset your password
                </CardDescription>
              </CardHeader>
              
              {isSuccess ? (
                <CardContent className="space-y-4 text-center py-6">
                  <div className="rounded-full bg-green-100 p-3 text-green-600 mx-auto w-fit">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium">Email Sent</h3>
                  <p className="text-muted-foreground">
                    Check your inbox for the reset link. The link will expire in 1 hour.
                  </p>
                  <Button asChild variant="outline" className="mt-4">
                    <Link to="/sign-in">Back to Sign In</Link>
                  </Button>
                </CardContent>
              ) : (
                <>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Reset Link"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                  <Separator />
                  <CardFooter className="flex flex-col space-y-4 pt-4">
                    <div className="text-center text-sm">
                      Remember your password?{" "}
                      <Link to="/sign-in" className="text-primary hover:underline">
                        Sign in
                      </Link>
                    </div>
                  </CardFooter>
                </>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
