
import { Search, ShoppingCart, User, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const { totalItems, toggleCart } = useCart();
  const { state: wishlistState } = useWishlist();
  const { isSignedIn, user } = useAuth();

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
            
            <Link 
              to="/wishlist" 
              className="relative rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
            >
              <Heart className="h-5 w-5" />
              {wishlistState.items.length > 0 && (
                <Badge variant="destructive" className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
                  {wishlistState.items.length}
                </Badge>
              )}
              <span className="sr-only">Wishlist ({wishlistState.items.length} items)</span>
            </Link>
            
            <Link 
              to="/cart" 
              className="relative rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              onClick={(e) => {
                // prevent the default navigation to allow the cart toggle
                e.preventDefault();
                toggleCart(true);
              }}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge variant="destructive" className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
                  {totalItems}
                </Badge>
              )}
              <span className="sr-only">Cart ({totalItems} items)</span>
            </Link>
            
            {/* Authentication UI */}
            {isSignedIn ? (
              <div className="relative rounded-full p-2 overflow-hidden bg-neutral-200">
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user.fullName || "User"} 
                    className="h-5 w-5 rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
            ) : (
              <Link to="/sign-in" className="rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900">
                <User className="h-5 w-5" />
                <span className="sr-only">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
