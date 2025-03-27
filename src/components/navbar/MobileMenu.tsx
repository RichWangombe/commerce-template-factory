
import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavLinks } from "./NavLinks";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";

export const MobileMenu = () => {
  const { isSignedIn, signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon" className="-ml-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] flex flex-col">
        <div className="px-2 py-6 flex-1">
          <Link to="/" className="font-semibold block mb-6 flex items-center">
            <img 
              src="/lovable-uploads/63521127-b685-4b09-be8f-970b73ceb65f.png" 
              alt="GadgetHub Logo" 
              className="h-6 w-auto object-contain mix-blend-multiply dark:mix-blend-screen"
            />
          </Link>
          <nav className="flex flex-col space-y-6">
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">Navigation</h2>
              <div className="flex flex-col space-y-4 pl-1">
                <SheetClose asChild>
                  <NavLinks onClick={() => {}} />
                </SheetClose>
              </div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">Account</h2>
              <div className="flex flex-col space-y-4 pl-1">
                {isSignedIn ? (
                  <>
                    <SheetClose asChild>
                      <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors">
                        My Account
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/wishlist" className="text-sm font-medium hover:text-primary transition-colors">
                        My Wishlist
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/orders" className="text-sm font-medium hover:text-primary transition-colors">
                        My Orders
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <button onClick={handleSignOut} className="text-sm font-medium hover:text-primary transition-colors text-left">
                        Sign Out
                      </button>
                    </SheetClose>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Link to="/sign-in" className="text-sm font-medium hover:text-primary transition-colors">
                      Sign In
                    </Link>
                  </SheetClose>
                )}
              </div>
            </div>
          </nav>
        </div>
        
        <div className="border-t py-4 px-2">
          <ThemeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
};
