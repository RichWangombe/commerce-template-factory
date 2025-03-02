
import { Search, ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <header className="w-full border-b border-neutral-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              className="h-8 w-8" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-xl font-medium">GadgetHub</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-neutral-500">
              Home
            </Link>
            <Link to="/products" className="text-sm font-medium transition-colors hover:text-neutral-500">
              Products
            </Link>
            <Link to="/categories" className="text-sm font-medium transition-colors hover:text-neutral-500">
              Categories
            </Link>
            <Link to="/support" className="text-sm font-medium transition-colors hover:text-neutral-500">
              Support
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </button>
            <Link to="/cart" className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Link>
            <Link to="/account" className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
