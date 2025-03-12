
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Loader, CheckCircle, XCircle } from "lucide-react";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    number: false,
    letter: false
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp, mockMode } = useAuth();

  // Check password requirements when password changes
  useEffect(() => {
    setPasswordRequirements({
      length: password.length >= 8,
      number: /\d/.test(password),
      letter: /[a-zA-Z]/.test(password)
    });
  }, [password]);

  const isPasswordValid = () => {
    return passwordRequirements.length && 
      passwordRequirements.number && 
      passwordRequirements.letter;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid()) {
      toast({
        title: "Invalid password",
        description: "Please make sure your password meets all requirements",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signUp(email, password, firstName, lastName);
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message || "Please check your information and try again",
          variant: "destructive",
        });
      } else {
        if (mockMode) {
          toast({
            title: "Demo Mode",
            description: "Account would be created in a real environment. You are now signed in.",
          });
        } else {
          toast({
            title: "Account created",
            description: "Please check your email to verify your account",
          });
        }
        navigate("/");
      }
    } catch (err: any) {
      toast({
        title: "An error occurred",
        description: err.message || "Could not process your request",
        variant: "destructive",
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
              <h1 className="text-3xl font-bold">Create an Account</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Sign up to start shopping with us
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                  Enter your information to create an account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        autoComplete="given-name"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        autoComplete="family-name"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                    <div className="space-y-1 mt-2 text-sm">
                      <p className="text-muted-foreground font-medium">Password requirements:</p>
                      <div className="flex items-center gap-2 text-xs">
                        {passwordRequirements.length ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={passwordRequirements.length ? "text-green-700" : "text-red-700"}>
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {passwordRequirements.number ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={passwordRequirements.number ? "text-green-700" : "text-red-700"}>
                          At least one number
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {passwordRequirements.letter ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={passwordRequirements.letter ? "text-green-700" : "text-red-700"}>
                          At least one letter
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || !isPasswordValid()}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : "Sign Up"}
                  </Button>
                </form>
              </CardContent>
              <Separator />
              <CardFooter className="flex flex-col space-y-4 pt-4">
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/sign-in" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
