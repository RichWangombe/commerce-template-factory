
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Printer, Calendar, Check, ArrowLeft, Share2, Download } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Separator } from "@/components/ui/separator";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export const OrderConfirmationPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  // Order details - in a real app, this would come from an API
  const orderDetails = {
    id: "4489666633",
    date: "20 December 2023",
    total: 37.17,
    status: "In Transit",
    delivery: "Express (2-3 business days)",
    payment: "Credit card",
    deliveryDate: "27 December 2023",
    items: [
      {
        id: 2,
        name: "Smartwatch with Wireless",
        variant: "Black, One Size, 1 pc",
        price: 17.49,
        image: "/lovable-uploads/f306dd50-931c-4e73-b66d-61b3383f1151.png",
      },
      {
        id: 5,
        name: "Mini Drone with Camera",
        variant: "HD, 4K, 1 pc",
        price: 12.39,
        image: "https://images.unsplash.com/photo-1521405924368-64c5b84bec60?q=80&w=300",
      },
      {
        id: 7,
        name: "Smart Security Camera",
        variant: "White, 1080p, 1 pc",
        price: 7.29,
        image: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?q=80&w=300",
      },
    ],
    shipping: 2.00,
    customer: {
      name: "John Doe",
      address: "123 Tech Street",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
    },
  };

  // When the page loads, clear the cart (simulating completed purchase)
  useEffect(() => {
    // Clear cart on mount (this would happen after payment in a real app)
    clearCart();
    
    // Animate page content
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [clearCart]);

  // Share order details (just a demo function)
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My GadgetHub Order',
        text: `I just ordered from GadgetHub! Order #${orderDetails.id}`,
        url: window.location.href,
      })
      .catch(() => {
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  // Copy order link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast.success("Order link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy link");
      });
  };

  // Download order receipt (just simulated)
  const downloadReceipt = () => {
    toast.success("Your receipt will be downloaded shortly...");
    // In a real app, this would generate and download a PDF
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
      <Navbar />
      <main className="flex-1 py-6 md:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Order navigation */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-neutral-500">
              <Link to="/" className="hover:text-neutral-900 flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Home
              </Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <Link to="/cart" className="hover:text-neutral-900">My Cart</Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <span className="font-medium text-neutral-900">Order Confirmation</span>
            </div>
          </div>

          {/* Success message */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6 transition-all duration-300 transform hover:scale-105">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Thank you for your purchase. Your order has been received and is being processed.
              You will receive an email confirmation shortly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order details card */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between bg-gray-50 p-6">
                <div>
                  <h2 className="font-semibold text-lg">Order #{orderDetails.id}</h2>
                  <p className="text-gray-500 text-sm mt-1">Placed on {orderDetails.date}</p>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleShare}
                          className="flex items-center gap-2"
                        >
                          <Share2 className="h-4 w-4" />
                          <span className="hidden sm:inline">Share</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Share your order</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={downloadReceipt}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          <span className="hidden sm:inline">Receipt</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download receipt</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.print()}
                          className="flex items-center gap-2"
                        >
                          <Printer className="h-4 w-4" />
                          <span className="hidden sm:inline">Print</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Print order details</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              <div className="p-6">
                {/* Order items */}
                <h3 className="font-semibold mb-4">Items in your order</h3>
                <div className="space-y-4 mb-6">
                  {orderDetails.items.map((item, index) => (
                    <div 
                      key={`${item.id}-${index}`} 
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base truncate">{item.name}</h4>
                        <p className="text-sm text-gray-500 truncate">{item.variant}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-6" />
                
                {/* Shipping info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Shipping Address</h3>
                    <div className="text-sm space-y-1 text-gray-600">
                      <p className="font-medium text-gray-900">{orderDetails.customer.name}</p>
                      <p>{orderDetails.customer.address}</p>
                      <p>{orderDetails.customer.city}, {orderDetails.customer.state} {orderDetails.customer.zip}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Shipping Method</h3>
                    <div className="text-sm space-y-1 text-gray-600">
                      <p>{orderDetails.delivery}</p>
                      <p className="font-medium text-gray-900">
                        <Calendar className="inline h-4 w-4 mr-1 relative -top-px" />
                        Estimated delivery: {orderDetails.deliveryDate}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Payment Method</h3>
                    <div className="text-sm space-y-1 text-gray-600">
                      <p>{orderDetails.payment}</p>
                      <p>Total charged: <span className="font-medium text-gray-900">${orderDetails.total.toFixed(2)}</span></p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Order Status</h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                      <span className="text-sm font-medium">{orderDetails.status}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Track your order to get the latest updates
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order summary card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-4">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${(orderDetails.total - orderDetails.shipping).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>${orderDetails.shipping.toFixed(2)}</span>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${orderDetails.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <Button 
                    className="w-full rounded-full"
                    onClick={() => navigate('/tracking')}
                  >
                    Track Order
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full"
                    onClick={() => navigate('/')}
                  >
                    Continue Shopping
                  </Button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-sm mb-3">Need Help?</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Link 
                      to="/support" 
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Contact Support
                    </Link>
                    <Link 
                      to="/faq" 
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Return Policy
                    </Link>
                    <Link 
                      to="/faq" 
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Shipping Info
                    </Link>
                    <Link 
                      to="/faq" 
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      FAQ
                    </Link>
                  </div>
                </div>
                
                {/* Delivery progress */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-sm mb-4">Delivery Progress</h4>
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Order confirmed</p>
                        <p className="text-xs text-gray-500">{orderDetails.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Processing</p>
                        <p className="text-xs text-gray-500">Order preparation</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 animate-pulse-soft">
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Shipping</p>
                        <p className="text-xs text-gray-500">Package in transit</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 opacity-60">
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Delivered</p>
                        <p className="text-xs text-gray-500">Expected {orderDetails.deliveryDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recommended products section */}
          <div className="mt-12 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Link 
                  key={i} 
                  to={`/product/${i}`}
                  className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md hover:-translate-y-1"
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <img 
                      src={`https://source.unsplash.com/random/300x300?tech&${i}`} 
                      alt="Product" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm">Suggested Product {i}</h3>
                    <p className="text-gray-500 text-sm mt-1">Starting from $19.99</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Call to action */}
          <div className="mt-12 text-center">
            <Button 
              className="rounded-full px-8"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
