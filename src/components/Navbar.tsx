import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NavbarSearch } from "@/components/NavbarSearch";
import ThemeToggle from "@/components/ui/theme-toggle";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/" className="hidden md:block text-xl font-bold">
              E-Commerce
            </Link>
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-500 focus:outline-none focus:text-gray-700"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <NavbarSearch />
            <Link to="/categories" className="text-sm font-medium hover:text-gray-600">
              Categories
            </Link>
            <Link to="/new-arrivals" className="text-sm font-medium hover:text-gray-600">
              New Arrivals
            </Link>
            <Link to="/products" className="text-sm font-medium hover:text-gray-600">
              All Products
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/cart" className="text-gray-500 hover:text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 6v1.5M12 6v1.5m-3 0h.75m0 0h-.75M15 6v1.5m-3 0h.75M6 18.75h12a1.5 1.5 0 001.5-1.5V5.25a1.5 1.5 0 00-1.5-1.5H6a1.5 1.5 0 00-1.5 1.5v12a1.5 1.5 0 001.5 1.5zm0 0h12.75c.515 0 .939.426.939.939v.753a2.25 2.25 0 01-2.25 2.25H5.25a2.25 2.25 0 01-2.25-2.25v-.753c0-.514.424-.939.939-.939H6z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <Link to="/profile" className="text-gray-500 hover:text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path d="M12 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0 3a7.5 7.5 0 00-7.5 7.5V21h15v-1.5a7.5 7.5 0 00-7.5-7.5z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden p-4">
          <NavbarSearch />
          <div className="flex flex-col gap-2 mt-4">
            <Link to="/categories" className="block text-sm font-medium hover:text-gray-600">
              Categories
            </Link>
            <Link to="/new-arrivals" className="block text-sm font-medium hover:text-gray-600">
              New Arrivals
            </Link>
            <Link to="/products" className="block text-sm font-medium hover:text-gray-600">
              All Products
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
