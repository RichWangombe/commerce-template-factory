
import { X, ShoppingBag, Plus, Minus, Trash } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export const CartDrawer = () => {
  const { state, toggleCart, removeItem, updateQuantity, subtotal } = useCart();
  const { isOpen, items } = state;
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    toggleCart(false);
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={() => toggleCart(false)}
      />
      
      {/* Cart panel */}
      <div className="w-full max-w-md bg-white shadow-xl animate-slide-in-right">
        <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
          <div className="flex items-center justify-between px-4 py-6 sm:px-6">
            <h2 className="text-lg font-medium text-neutral-900 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart
            </h2>
            <button
              type="button"
              className="rounded-md text-neutral-400 hover:text-neutral-500"
              onClick={() => toggleCart(false)}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            {/* Empty state */}
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-3 text-center">
                <ShoppingBag className="mx-auto h-16 w-16 text-neutral-200" aria-hidden="true" />
                <h3 className="text-lg font-medium text-neutral-900">Your cart is empty</h3>
                <p className="text-neutral-500 text-sm">
                  Start shopping to add items to your cart.
                </p>
                <div className="py-3">
                  <Button 
                    onClick={() => toggleCart(false)}
                    className="rounded-full px-8"
                  >
                    Start Shopping
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <ul role="list" className="divide-y divide-neutral-200">
                  {items.map((item) => (
                    <li key={item.id} className="flex py-6 animate-fade-in">
                      {/* Product image */}
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-neutral-900">
                            <h3 className="line-clamp-1">
                              <Link to={`/product/${item.id}`}>{item.name}</Link>
                            </h3>
                            <p className="ml-4">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          {item.color && (
                            <p className="mt-1 text-sm text-neutral-500">
                              Color: {item.color}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            type="button"
                            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-neutral-200 px-4 py-6 sm:px-6">
              <div className="flex justify-between text-base font-medium text-neutral-900">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-neutral-500">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="mt-6 space-y-3">
                <Button 
                  className="w-full rounded-full py-6"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
                <Button 
                  className="w-full rounded-full bg-neutral-100 text-neutral-900 hover:bg-neutral-200 py-6"
                  variant="outline"
                  onClick={() => toggleCart(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
