
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

export interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
  isNew?: boolean;
  discount?: number;
}

export const ProductCard = ({
  id,
  name,
  price,
  image,
  category,
  isNew = false,
  discount = 0,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem } = useCart();

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  const discountedPrice = discount > 0 
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price * (1 - discount / 100))
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id,
      name,
      price,
      image,
      quantity: 1
    });
  };

  return (
    <div 
      className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md product-card animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link to={`/product/${id}`} className="block overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-neutral-50 p-6">
          <img
            src={image}
            alt={name}
            className={cn(
              "h-full w-full object-contain transition-transform duration-500", 
              isHovered ? "scale-105" : "scale-100"
            )}
          />
          
          {discount > 0 && (
            <div className="absolute left-4 top-4 rounded-full bg-black px-2 py-1 text-xs font-medium text-white">
              {discount}% OFF
            </div>
          )}
          
          {isNew && !discount && (
            <div className="absolute left-4 top-4 rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white">
              New
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col p-4">
        {category && (
          <span className="mb-1 text-xs font-medium text-neutral-500">
            {category}
          </span>
        )}
        
        <Link to={`/product/${id}`} className="group-hover:text-blue-600">
          <h3 className="font-medium text-base">{name}</h3>
        </Link>
        
        <div className="mt-1 flex items-center gap-2">
          <span className="font-medium">
            {discountedPrice || formattedPrice}
          </span>
          
          {discountedPrice && (
            <span className="text-sm text-neutral-500 line-through">
              {formattedPrice}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons - Appear on hover */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 flex justify-between bg-white p-4 shadow-md transition-transform duration-300",
          isHovered ? "translate-y-0" : "translate-y-full"
        )}
      >
        <button 
          className="rounded-full p-2 transition-colors hover:bg-neutral-100"
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart 
            className={cn("h-5 w-5", isFavorite ? "fill-red-500 text-red-500" : "text-neutral-500")} 
          />
          <span className="sr-only">Add to favorites</span>
        </button>
        
        <button 
          className="button-press ml-auto flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};
