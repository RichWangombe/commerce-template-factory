
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const WishlistPage = () => {
  const { state: wishlistState, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleAddToCart = (id: number, name: string, price: number, image: string) => {
    addItem({
      id,
      name,
      price,
      image,
      quantity: 1,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 py-8 md:py-12 container px-4 md:px-6 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        
        {wishlistState.items.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium mb-4">Your wishlist is empty</h2>
            <p className="text-neutral-500 mb-6">
              Add items to your wishlist to keep track of products you're interested in.
            </p>
            <Link to="/">
              <Button className="button-press bg-black hover:bg-neutral-800">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-neutral-500">
                {wishlistState.items.length} {wishlistState.items.length === 1 ? "item" : "items"}
              </p>
              {!showConfirmClear ? (
                <Button 
                  variant="outline" 
                  onClick={() => setShowConfirmClear(true)}
                  className="text-sm"
                >
                  Clear Wishlist
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm">Are you sure?</span>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => {
                      clearWishlist();
                      setShowConfirmClear(false);
                    }}
                    className="text-sm"
                  >
                    Yes, Clear
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowConfirmClear(false)}
                    className="text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistState.items.map((item) => (
                <div 
                  key={item.id} 
                  className="border border-neutral-200 rounded-xl overflow-hidden relative hover-scale"
                >
                  <button 
                    className="absolute right-3 top-3 z-10 p-1 bg-white rounded-full shadow-sm hover:bg-neutral-100"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  <Link to={`/product/${item.id}`}>
                    <div className="aspect-square bg-neutral-100 p-6">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-contain" 
                      />
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    {item.category && (
                      <span className="text-xs text-neutral-500 mb-1 block">{item.category}</span>
                    )}
                    <Link to={`/product/${item.id}`} className="hover:text-blue-600">
                      <h3 className="font-medium mb-2">{item.name}</h3>
                    </Link>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-bold">
                        ${item.price.toFixed(2)}
                      </span>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleAddToCart(item.id, item.name, item.price, item.image)}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        <span>Add to Cart</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default WishlistPage;
