
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ShoppingCart, Trash, Plus, Minus, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';

export const CartPage = () => {
  const { state, removeItem, updateQuantity, clearCart, subtotal } = useCart();
  const { items } = state;
  const navigate = useNavigate();

  // Tax calculation (example: 8%)
  const taxRate = 0.08;
  const taxAmount = subtotal * taxRate;
  
  // Shipping calculation (free over $50)
  const shippingAmount = subtotal > 50 ? 0 : 5.99;
  
  // Total calculation
  const totalAmount = subtotal + taxAmount + shippingAmount;

  // Example recommended products
  const recommendedProducts = [
    {
      id: 101,
      name: "Wireless Earbuds",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300&h=300&q=80",
    },
    {
      id: 102,
      name: "Portable Charger",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1618438051686-cf53850add96?w=300&h=300&q=80",
    },
    {
      id: 103,
      name: "Phone Stand",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1564227901-6b1d20bebe9d?w=300&h=300&q=80",
    },
  ];

  // Proceed to checkout handler
  const handleCheckout = () => {
    // In a real application, you'd likely have a checkout process
    // For now, we'll just navigate to the order confirmation page
    navigate('/order-confirmation');
  };

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <nav className="mb-6 flex text-sm">
            <Link to="/" className="text-neutral-500 hover:text-neutral-900">Home</Link>
            <ChevronRight className="mx-2 h-4 w-4 text-neutral-500" />
            <span className="font-medium text-neutral-900">Shopping Cart</span>
          </nav>

          <h1 className="mb-8 text-3xl font-bold">Your Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center">
              <ShoppingCart className="mx-auto h-12 w-12 text-neutral-400" />
              <h2 className="mt-4 text-xl font-medium">Your cart is empty</h2>
              <p className="mt-2 text-neutral-500">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Button asChild className="mt-8 rounded-full px-8 py-6">
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="rounded-lg border border-neutral-200 bg-white">
                  <div className="rounded-t-lg bg-neutral-50 px-6 py-4">
                    <div className="grid grid-cols-12 text-sm font-medium">
                      <div className="col-span-6">Product</div>
                      <div className="col-span-2 text-center">Price</div>
                      <div className="col-span-2 text-center">Quantity</div>
                      <div className="col-span-2 text-right">Total</div>
                    </div>
                  </div>

                  <ul className="divide-y divide-neutral-200">
                    {items.map((item) => (
                      <li key={item.id} className="p-6 animate-fade-in">
                        <div className="grid grid-cols-12 items-center gap-4">
                          {/* Product */}
                          <div className="col-span-6 flex items-center space-x-4">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <div>
                              <h3 className="text-base font-medium">
                                <Link to={`/product/${item.id}`} className="hover:text-blue-600">
                                  {item.name}
                                </Link>
                              </h3>
                              {item.color && (
                                <p className="mt-1 text-sm text-neutral-500">
                                  Color: {item.color}
                                </p>
                              )}
                              <button
                                type="button"
                                className="mt-2 flex items-center text-xs text-neutral-500 hover:text-neutral-700"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash className="mr-1 h-3 w-3" />
                                Remove
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="col-span-2 text-center text-sm">
                            ${item.price.toFixed(2)}
                          </div>

                          {/* Quantity */}
                          <div className="col-span-2 flex justify-center">
                            <div className="flex items-center border border-neutral-200 rounded-full">
                              <button
                                className="flex h-8 w-8 items-center justify-center rounded-l-full text-neutral-600 hover:bg-neutral-100"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-10 text-center text-sm">{item.quantity}</span>
                              <button
                                className="flex h-8 w-8 items-center justify-center rounded-r-full text-neutral-600 hover:bg-neutral-100"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {/* Total */}
                          <div className="col-span-2 text-right font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-neutral-50 p-6 rounded-b-lg">
                    <div className="flex justify-between items-center">
                      <Button 
                        variant="outline" 
                        className="text-sm"
                        onClick={clearCart}
                      >
                        Clear Cart
                      </Button>
                      <Button asChild variant="outline" className="text-sm">
                        <Link to="/">Continue Shopping</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="rounded-lg border border-neutral-200 bg-white p-6 sticky top-8">
                  <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Shipping</span>
                      <span>{shippingAmount === 0 ? 'Free' : `$${shippingAmount.toFixed(2)}`}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Tax</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-base font-medium">
                      <span>Total</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="mt-6 w-full rounded-full"
                    onClick={handleCheckout}
                  >
                    Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <div className="mt-6">
                    <p className="text-xs text-neutral-500 mb-2">We accept:</p>
                    <div className="flex space-x-2">
                      <div className="h-8 w-12 bg-neutral-100 rounded"></div>
                      <div className="h-8 w-12 bg-neutral-100 rounded"></div>
                      <div className="h-8 w-12 bg-neutral-100 rounded"></div>
                      <div className="h-8 w-12 bg-neutral-100 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommended Products */}
          {items.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 text-2xl font-medium">You might also like</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                {recommendedProducts.map((product) => (
                  <div key={product.id} className="group rounded-lg border border-neutral-200 bg-white overflow-hidden">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{product.name}</h3>
                      <div className="mt-1 flex items-center justify-between">
                        <span>${product.price.toFixed(2)}</span>
                        <Button size="sm" variant="outline" className="rounded-full">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;
