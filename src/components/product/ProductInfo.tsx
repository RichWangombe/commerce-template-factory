
import { useState } from "react";
import { Star, Heart, ShoppingCart, Share2, Truck, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    stock: number;
    colors: string[];
  };
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const [selectedColor, setSelectedColor] = useState(product.colors.length > 0 ? product.colors[0] : "");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const isFavorite = isInWishlist(Number(product.id));
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
    
  const handleIncreaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    addItem({
      id: Number(product.id),
      name: product.name,
      price: product.price,
      image: "", // This will be passed from parent
      quantity,
      color: selectedColor
    });
  };
  
  const handleToggleWishlist = () => {
    const productId = Number(product.id);
    
    if (isFavorite) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        id: productId,
        name: product.name,
        price: product.price,
        image: "", // This will be passed from parent
        category: "",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">{product.name}</h1>
        <p className="text-neutral-500 mt-1">{product.brand}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : i < product.rating
                  ? 'fill-yellow-400 text-yellow-400 opacity-50'
                  : 'text-neutral-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium">{product.rating}</span>
        <span className="text-neutral-500 text-sm">({product.reviewCount} reviews)</span>
      </div>
      
      <div>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <>
              <span className="text-neutral-500 line-through">${product.originalPrice.toFixed(2)}</span>
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                {discountPercentage}% OFF
              </span>
            </>
          )}
        </div>
        
        <p className="text-sm text-green-600 mt-1">
          In stock ({product.stock} available)
        </p>
      </div>
      
      <div className="border-t border-b border-neutral-200 py-6 space-y-4">
        {product.colors.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Color</h3>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    selectedColor === color
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 hover:bg-neutral-200'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <h3 className="text-sm font-medium mb-3">Quantity</h3>
          <div className="flex items-center">
            <button
              onClick={handleDecreaseQuantity}
              className="w-10 h-10 rounded-l-md border border-neutral-300 flex items-center justify-center hover:bg-neutral-100"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              value={quantity}
              readOnly
              className="w-14 h-10 border-t border-b border-neutral-300 text-center text-sm [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              onClick={handleIncreaseQuantity}
              className="w-10 h-10 rounded-r-md border border-neutral-300 flex items-center justify-center hover:bg-neutral-100"
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button 
          onClick={handleAddToCart}
          className="flex-1 button-press gap-2 bg-black hover:bg-neutral-800"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
        <Button 
          onClick={handleToggleWishlist}
          variant="outline"
          className={`button-press ${isFavorite ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
        <Button 
          variant="outline"
          className="button-press"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
        <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
          <Truck className="h-5 w-5 text-neutral-600" />
        </div>
        <div>
          <p className="text-sm font-medium">Free shipping</p>
          <p className="text-xs text-neutral-500">Free standard shipping on orders over $35</p>
        </div>
      </div>
    </div>
  );
};
