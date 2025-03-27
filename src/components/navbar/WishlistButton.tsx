
import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WishlistButton = () => {
  return (
    <Link to="/wishlist">
      <Button variant="ghost" size="icon" className="relative">
        <Heart className="h-5 w-5" />
        <span className="sr-only">Wishlist</span>
      </Button>
    </Link>
  );
};
