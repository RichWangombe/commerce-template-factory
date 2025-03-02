
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Printer, Calendar, Check } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const OrderConfirmationPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

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

  // For animations
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 200);
  }, []);

  return (
    <div className={`flex min-h-screen flex-col bg-white ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Order navigation */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-neutral-500">
              <Link to="/cart" className="hover:text-neutral-900">My Cart</Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <span className="font-medium text-neutral-900">Order Summary</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 fade-in-group">
            {/* Order confirmation section */}
            <div className="w-full lg:w-3/5 rounded-xl bg-neutral-100 p-8">
              <div className="mb-8 text-center lg:text-left">
                <h1 className="text-3xl font-bold mb-4">Thank You for Shopping with Us!</h1>
                <p className="text-neutral-600">
                  Your order is confirmed. Look out for email updates on shipping and delivery.
                </p>
              </div>

              <div className="space-y-6">
                <div className="border-b border-neutral-200 pb-6">
                  <h3 className="font-medium mb-4">Order details:</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-neutral-500">Order no.:</p>
                      <p className="font-medium">{orderDetails.id}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500">Order date:</p>
                      <p className="font-medium">{orderDetails.date}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500">Order total:</p>
                      <p className="font-medium">${orderDetails.total}</p>
                    </div>
                  </div>
                </div>

                <div className="border-b border-neutral-200 pb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-neutral-500 mb-1">Order</p>
                      <div className="flex items-center">
                        <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                        <span>{orderDetails.status}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-neutral-500 mb-1">Delivery</p>
                      <p>{orderDetails.delivery}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 mb-1">Payment</p>
                      <p>{orderDetails.payment}</p>
                    </div>
                  </div>
                </div>

                <div className="border-b border-neutral-200 pb-6">
                  <h3 className="font-medium mb-4">Delivery</h3>
                  <div className="text-sm">
                    <p className="font-medium mb-1">{orderDetails.customer.name}</p>
                    <p>{orderDetails.customer.address}</p>
                    <p>
                      {orderDetails.customer.city}, {orderDetails.customer.state}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-neutral-500" />
                    <span>Est. delivery: {orderDetails.deliveryDate}</span>
                  </div>
                  <div className="flex space-x-4">
                    <Link
                      to="/support"
                      className="text-sm text-neutral-700 hover:text-neutral-900 underline"
                    >
                      Need help?
                    </Link>
                    <button className="flex items-center text-sm text-neutral-700 hover:text-neutral-900">
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </button>
                  </div>
                </div>

                <button className="w-full button-press rounded-full bg-black py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800">
                  Track order
                </button>
              </div>
            </div>

            {/* Order summary section */}
            <div className="w-full lg:w-2/5 rounded-xl bg-black text-white p-8">
              <h2 className="text-xl font-bold mb-8">Order Summary</h2>

              <div className="space-y-4 mb-8">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-neutral-400">{item.variant}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-800 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Subtotal:</span>
                  <span>${(orderDetails.total - orderDetails.shipping).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Shipping:</span>
                  <span>${orderDetails.shipping.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-neutral-800 mt-4 pt-4">
                <div className="flex justify-between items-center text-lg font-medium">
                  <span>Total:</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-medium mb-4">Delivery Progress</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Order confirmed</p>
                      <p className="text-sm text-neutral-400">
                        We've received your order
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Processing</p>
                      <p className="text-sm text-neutral-400">
                        Your order is being prepared
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 animate-pulse-soft">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                    <div>
                      <p className="font-medium">Shipping</p>
                      <p className="text-sm text-neutral-400">
                        Your package is on the way
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 opacity-50">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-700">
                      <div className="h-2 w-2 rounded-full bg-neutral-500"></div>
                    </div>
                    <div>
                      <p className="font-medium">Delivered</p>
                      <p className="text-sm text-neutral-400">
                        Package will arrive on {orderDetails.deliveryDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended products or continue shopping section can go here */}
          <div className="mt-16 text-center">
            <h2 className="text-xl font-medium mb-4">Continue Shopping</h2>
            <div className="flex justify-center gap-4">
              <Link
                to="/products"
                className="button-press rounded-full bg-black px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
              >
                Browse Products
              </Link>
              <Link
                to="/support"
                className="button-press rounded-full border border-neutral-200 px-6 py-2 text-sm font-medium transition-colors hover:bg-neutral-50"
              >
                Get Support
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
