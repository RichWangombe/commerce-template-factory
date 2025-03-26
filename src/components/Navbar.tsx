
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Heart, Search as SearchIcon } from "lucide-react";
import { NavbarSearch } from "@/components/NavbarSearch";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const Navbar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const location = useLocation();
  const { state } = useCart();
  const { items } = state;
  const cartItemCount = items.length;

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <NavLink to="/categories" onClick={onClick} currentPath={location.pathname}>
        Categories
      </NavLink>
      <NavLink to="/new-arrivals" onClick={onClick} currentPath={location.pathname}>
        New Arrivals
      </NavLink>
      <NavLink to="/products" onClick={onClick} currentPath={location.pathname}>
        All Products
      </NavLink>
    </>
  );

  const NavLink = ({ to, children, onClick, currentPath }: { to: string; children: React.ReactNode; onClick?: () => void; currentPath: string }) => {
    const isActive = currentPath === to;
    return (
      <Link 
        to={to} 
        className={cn(
          "text-sm font-medium transition-colors relative group",
          isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
        )}
        onClick={onClick}
      >
        {children}
        {isActive && (
          <motion.span 
            className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary"
            layoutId="navbar-indicator"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] flex flex-col">
                <div className="px-2 py-6 flex-1">
                  <Link to="/" className="font-semibold text-xl block mb-6 flex items-center gap-2">
                    <img 
                      src="/lovable-uploads/63521127-b685-4b09-be8f-970b73ceb65f.png" 
                      alt="GadgetHub Logo" 
                      className="h-6 w-auto"
                    />
                    GadgetHub
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
                      </div>
                    </div>
                  </nav>
                </div>
                
                <div className="border-t py-4 px-2">
                  <ThemeToggle />
                </div>
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="font-semibold text-xl text-primary flex items-center gap-2 mr-8">
              <img 
                src="/lovable-uploads/63521127-b685-4b09-be8f-970b73ceb65f.png" 
                alt="GadgetHub Logo" 
                className="h-6 w-auto"
              />
              GadgetHub
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <NavLinks />
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <NavbarSearch />
            </div>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              >
                <SearchIcon className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
              
              <ThemeToggle />
              
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                  <span className="sr-only">Wishlist</span>
                </Button>
              </Link>
              
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                    >
                      {cartItemCount}
                    </Badge>
                  )}
                  <span className="sr-only">Cart</span>
                </Button>
              </Link>
              
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile Search - Expandable */}
        {isSearchExpanded && (
          <div className="md:hidden mt-2 pb-2 animate-fade-in">
            <NavbarSearch />
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
