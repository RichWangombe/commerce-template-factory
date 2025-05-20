
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { isValidImageUrl, getDefaultProductImage, processProductImages, getProductSpecificImages, getImagesByCategory } from "@/utils/imageUtils";

export interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
  isNew?: boolean;
  discount?: number;
  rating?: number;
}

export const ProductCard = ({
  id,
  name,
  price,
  image,
  category,
  isNew = false,
  discount = 0,
  rating,
}: ProductCardProps) => {
  const [imageUrl, setImageUrl] = useState(image);
  const [isLoading, setIsLoading] = useState(true);
  const [imgError, setImgError] = useState(false); // Retained for fallback scenarios
  const [isHovered, setIsHovered] = useState(false); // Added missing state
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(id);

  //Improved Image Loading Logic
  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true);
      setImgError(false);
      if (isValidImageUrl(image)) {
        setImageUrl(image);
      } else {
        const hdImages = getProductSpecificImages(id);
        if (hdImages.length > 0) {
          setImageUrl(hdImages[0]);
        } else {
          const categoryImages = getImagesByCategory(category);
          if (categoryImages.length > 0) {
            setImageUrl(categoryImages[0]);
          } else {
            setImageUrl(getDefaultProductImage());
          }
        }
      }
      setIsLoading(false);
    };

    loadImage();
  }, [image, id, category]);


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
      image: imgError ? getDefaultProductImage() : imageUrl,
      quantity: 1
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        name,
        price,
        image: imgError ? getDefaultProductImage() : imageUrl,
        category
      });
    }
  };

  const handleImageError = () => {
    setImgError(true);
    // Try product-specific images first
    const fallbackImages = processProductImages([], id, category);
    if (fallbackImages.length > 0) {
      const randomIndex = Math.floor(Math.random() * fallbackImages.length);
      setImageUrl(fallbackImages[randomIndex]);
      return;
    }
    // Ultimate fallback
    setImageUrl(getDefaultProductImage());
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
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 animate-pulse">
              <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
            </div>
          )}

          {imgError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100 text-neutral-400">
              <ImageOff className="h-10 w-10 mb-2" />
              <span className="text-xs">Image unavailable</span>
            </div>
          )}

          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            decoding="async"
            width="400"
            height="400"
            className={cn(
              "h-full w-full object-contain transition-transform duration-500", 
              isHovered ? "scale-105" : "scale-100",
              !isLoading && !imgError ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setIsLoading(false)}
            onError={handleImageError}
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
          onClick={handleToggleWishlist}
        >
          <Heart 
            className={cn("h-5 w-5", isFavorite ? "fill-red-500 text-red-500" : "text-neutral-500")} 
          />
          <span className="sr-only">
            {isFavorite ? "Remove from favorites" : "Add to favorites"}
          </span>
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

// Placeholder - Replace with actual implementation
const getProductImage = async (imageUrl: string, category?: string) => {
  // Logic to fetch fallback image based on imageUrl and category
  //This could involve hitting an API or using a different image url strategy.
  //For this example we just return a default image.
  return getDefaultProductImage();
};
