
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { NavbarSearch } from "@/components/NavbarSearch";
import ThemeToggle from "@/components/ui/theme-toggle";
import { MobileMenu } from "./navbar/MobileMenu";
import { NavLinks } from "./navbar/NavLinks";
import { UserMenu } from "./navbar/UserMenu";
import { CartButton } from "./navbar/CartButton";
import { WishlistButton } from "./navbar/WishlistButton";
import { SearchButton } from "./navbar/SearchButton";

export const Navbar = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <MobileMenu />
            
            {/* Logo with blend mode to adapt to background */}
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/63521127-b685-4b09-be8f-970b73ceb65f.png" 
                alt="GadgetHub Logo" 
                className="h-6 w-auto object-contain mix-blend-multiply dark:mix-blend-screen"
              />
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
              <SearchButton onClick={() => setIsSearchExpanded(!isSearchExpanded)} />
              <ThemeToggle />
              <WishlistButton />
              <CartButton />
              <UserMenu />
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
