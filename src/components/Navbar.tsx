
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Heart } from "lucide-react";
import { NavbarSearch } from "@/components/NavbarSearch";
import ThemeToggle from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const NavLinks = () => (
    <>
      <Link to="/categories" className="text-sm font-medium hover:text-primary transition-colors">
        Categories
      </Link>
      <Link to="/new-arrivals" className="text-sm font-medium hover:text-primary transition-colors">
        New Arrivals
      </Link>
      <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">
        All Products
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
            
            <Link to="/" className="font-semibold text-xl">
              Store
            </Link>

            <nav className="hidden md:flex items-center gap-6 ml-6">
              <NavLinks />
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <NavbarSearch isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
            
            <div className="flex items-center gap-1">
              <ThemeToggle />
              
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className="relative">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/cart">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
