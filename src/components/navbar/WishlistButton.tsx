
import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/contexts/WishlistContext";

export const WishlistButton = () => {
  const { isSignedIn } = useAuth();
  const { state } = useWishlist();
  const wishlistCount = state.items.length;

  return (
    <Link to={isSignedIn ? "/wishlist" : "/sign-in"}>
      <Button variant="ghost" size="icon" className="relative">
        <Heart className="h-5 w-5" />
        {wishlistCount > 0 && (
          <Badge 
            variant="secondary" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
          >
            {wishlistCount}
          </Badge>
        )}
        <span className="sr-only">Wishlist</span>
      </Button>
    </Link>
  );
};
