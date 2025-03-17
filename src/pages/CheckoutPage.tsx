import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckoutProgress } from "@/components/checkout/CheckoutProgress";
import { AddressForm } from "@/components/checkout/AddressForm";
import { ShippingMethodSelector } from "@/components/checkout/ShippingMethodSelector";
import { StripePaymentForm } from "@/components/checkout/StripePaymentForm";
import { MpesaPaymentForm } from "@/components/checkout/MpesaPaymentForm";
import { PesapalPaymentForm } from "@/components/checkout/PesapalPaymentForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { CheckoutStep, ShippingMethod } from "@/types/checkout";
import { toast } from "sonner";

const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const shippingMethods: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "Delivered in 5-7 business days",
    price: 4.99,
    estimatedDays: "5-7 business days",
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "Delivered in 2-3 business days",
    price: 12.99,
    estimatedDays: "2-3 business days",
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    description: "Delivered the next business day",
    price: 24.99,
    estimatedDays: "Next business day",
  },
];

const checkoutSchema = z.object({
  shippingAddress: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    address1: z.string().min(1, "Address is required"),
    address2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
    phone: z.string().optional(),
  }),
  sameAsBilling: z.boolean().default(true),
  billingAddress: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    address1: z.string().min(1, "Address is required"),
    address2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
    phone: z.string().optional(),
  }).optional(),
  shippingMethodId: z.string().min(1, "Please select a shipping method"),
  paymentMethod: z.string().default("card"),
  savePaymentInfo: z.boolean().default(false),
  paymentValid: z.boolean().optional(),
  orderTotal: z.number().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const { isSignedIn, user } = useUser();
  const { state, clearCart, subtotal } = useCart();
  const { items } = state;
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("information");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | undefined>(undefined);
  
  const checkoutSteps = [
    { id: "information" as const, label: "Information" },
    { id: "shipping" as const, label: "Shipping" },
    { id: "payment" as const, label: "Payment" },
    { id: "review" as const, label: "Review" },
  ];

  const methods = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: {
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        phone: "",
      },
      sameAsBilling: true,
      billingAddress: {
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        phone: "",
      },
      shippingMethodId: "",
      paymentMethod: "card",
      savePaymentInfo: false,
    },
  });

  useEffect(() => {
    if (items.length === 0) {
      toast.info("Your cart is empty. Add some items before checking out.");
      navigate("/");
    }

    window.scrollTo(0, 0);
  }, [items.length, navigate]);

  useEffect(() => {
    const methodId = methods.watch("shippingMethodId");
    if (methodId) {
      const method = shippingMethods.find(m => m.id === methodId);
      setSelectedShippingMethod(method);
    }
  }, [methods.watch("shippingMethodId")]);

  useEffect(() => {
    if (selectedShippingMethod) {
      const total = subtotal + selectedShippingMethod.price;
      methods.setValue("orderTotal", total);
    }
  }, [subtotal, selectedShippingMethod, methods]);

  const nextStep = async () => {
    const currentIndex = checkoutSteps.findIndex(step => step.id === currentStep);
    if (currentIndex < checkoutSteps.length - 1) {
      
      let isValid = false;
      
      if (currentStep === "information") {
        isValid = await methods.trigger("shippingAddress");
        if (!methods.getValues("sameAsBilling")) {
          isValid = isValid && await methods.trigger("billingAddress");
        }
      } else if (currentStep === "shipping") {
        isValid = await methods.trigger("shippingMethodId");
      } else if (currentStep === "payment") {
        isValid = methods.getValues("paymentValid") === true;
        if (!isValid) {
          toast.error("Please complete your payment");
          return;
        }
      }
      
      if (isValid) {
        setCurrentStep(checkoutSteps[currentIndex + 1].id);
      }
    }
  };

  const prevStep = () => {
    const currentIndex = checkoutSteps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(checkoutSteps[currentIndex - 1].id);
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!isSignedIn) {
      toast.error("Please sign in to complete your purchase");
      navigate("/sign-in", { state: { from: "/checkout" } });
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log("Processing order:", data);
      console.log("Cart items:", items);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearCart();
      
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error("There was a problem processing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-6 flex text-sm">
            <Link to="/" className="text-neutral-500 hover:text-neutral-900">Home</Link>
            <ChevronRight className="mx-2 h-4 w-4 text-neutral-500" />
            <Link to="/cart" className="text-neutral-500 hover:text-neutral-900">Cart</Link>
            <ChevronRight className="mx-2 h-4 w-4 text-neutral-500" />
            <span className="font-medium text-neutral-900">Checkout</span>
          </nav>

          <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

          <div className="mb-12 pt-4">
            <CheckoutProgress currentStep={currentStep} steps={checkoutSteps} />
          </div>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
                  {currentStep === "information" && (
                    <div className="space-y-8">
                      <AddressForm type="shipping" />
                      
                      <div className="flex items-center">
                        <input
                          id="sameAsBilling"
                          type="checkbox"
                          className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                          checked={methods.watch("sameAsBilling")}
                          onChange={(e) => methods.setValue("sameAsBilling", e.target.checked)}
                        />
                        <label 
                          htmlFor="sameAsBilling" 
                          className="ml-2 block text-sm text-neutral-700"
                        >
                          Billing address is the same as shipping address
                        </label>
                      </div>
                      
                      {!methods.watch("sameAsBilling") && (
                        <AddressForm type="billing" />
                      )}
                    </div>
                  )}
                  
                  {currentStep === "shipping" && (
                    <div className="space-y-8">
                      <ShippingMethodSelector shippingMethods={shippingMethods} />
                    </div>
                  )}
                  
                  {currentStep === "payment" && (
                    <div className="space-y-8">
                      <h3 className="text-base font-medium">Payment Method</h3>
                      <Separator className="my-4" />
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center space-x-3">
                          <input
                            id="card-payment"
                            name="paymentMethod"
                            type="radio"
                            value="card"
                            className="h-4 w-4 border-neutral-300 text-primary focus:ring-primary"
                            checked={methods.watch("paymentMethod") === "card"}
                            onChange={() => methods.setValue("paymentMethod", "card")}
                          />
                          <label htmlFor="card-payment" className="block text-sm font-medium text-neutral-700">
                            Credit/Debit Card (Stripe)
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <input
                            id="mpesa-payment"
                            name="paymentMethod"
                            type="radio"
                            value="mpesa"
                            className="h-4 w-4 border-neutral-300 text-primary focus:ring-primary"
                            checked={methods.watch("paymentMethod") === "mpesa"}
                            onChange={() => methods.setValue("paymentMethod", "mpesa")}
                          />
                          <label htmlFor="mpesa-payment" className="block text-sm font-medium text-neutral-700">
                            M-Pesa
                          </label>
                        </div>

                        <div className="flex items-center space-x-3">
                          <input
                            id="pesapal-payment"
                            name="paymentMethod"
                            type="radio"
                            value="pesapal"
                            className="h-4 w-4 border-neutral-300 text-primary focus:ring-primary"
                            checked={methods.watch("paymentMethod") === "pesapal"}
                            onChange={() => methods.setValue("paymentMethod", "pesapal")}
                          />
                          <label htmlFor="pesapal-payment" className="block text-sm font-medium text-neutral-700">
                            Pesapal (Cards, M-Pesa, and more)
                          </label>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        {methods.watch("paymentMethod") === "card" && (
                          <Elements stripe={stripePromise}>
                            <StripePaymentForm />
                          </Elements>
                        )}
                        
                        {methods.watch("paymentMethod") === "mpesa" && (
                          <MpesaPaymentForm />
                        )}

                        {methods.watch("paymentMethod") === "pesapal" && (
                          <PesapalPaymentForm />
                        )}
                      </div>
                    </div>
                  )}
                  
                  {currentStep === "review" && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Review Your Order</h3>
                        <Separator className="my-4" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-2">Shipping Address</h4>
                            <div className="bg-neutral-50 p-4 rounded-md text-sm">
                              <p>{methods.getValues("shippingAddress.firstName")} {methods.getValues("shippingAddress.lastName")}</p>
                              <p>{methods.getValues("shippingAddress.address1")}</p>
                              {methods.getValues("shippingAddress.address2") && (
                                <p>{methods.getValues("shippingAddress.address2")}</p>
                              )}
                              <p>
                                {methods.getValues("shippingAddress.city")}, {methods.getValues("shippingAddress.state")} {methods.getValues("shippingAddress.zipCode")}
                              </p>
                              <p>{methods.getValues("shippingAddress.country")}</p>
                              {methods.getValues("shippingAddress.phone") && (
                                <p>Phone: {methods.getValues("shippingAddress.phone")}</p>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Billing Address</h4>
                            <div className="bg-neutral-50 p-4 rounded-md text-sm">
                              {methods.getValues("sameAsBilling") ? (
                                <p>Same as shipping address</p>
                              ) : (
                                <>
                                  <p>{methods.getValues("billingAddress.firstName")} {methods.getValues("billingAddress.lastName")}</p>
                                  <p>{methods.getValues("billingAddress.address1")}</p>
                                  {methods.getValues("billingAddress.address2") && (
                                    <p>{methods.getValues("billingAddress.address2")}</p>
                                  )}
                                  <p>
                                    {methods.getValues("billingAddress.city")}, {methods.getValues("billingAddress.state")} {methods.getValues("billingAddress.zipCode")}
                                  </p>
                                  <p>{methods.getValues("billingAddress.country")}</p>
                                  {methods.getValues("billingAddress.phone") && (
                                    <p>Phone: {methods.getValues("billingAddress.phone")}</p>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="font-medium mb-2">Shipping Method</h4>
                          <div className="bg-neutral-50 p-4 rounded-md text-sm">
                            {selectedShippingMethod ? (
                              <>
                                <p>{selectedShippingMethod.name} - ${selectedShippingMethod.price.toFixed(2)}</p>
                                <p>Estimated delivery: {selectedShippingMethod.estimatedDays}</p>
                              </>
                            ) : (
                              <p>No shipping method selected</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="font-medium mb-2">Payment Method</h4>
                          <div className="bg-neutral-50 p-4 rounded-md text-sm">
                            {methods.getValues("paymentMethod") === "mpesa" && <p>M-Pesa</p>}
                            {methods.getValues("paymentMethod") === "card" && <p>Credit Card</p>}
                            {methods.getValues("paymentMethod") === "pesapal" && <p>Pesapal</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-8 flex justify-between">
                    {currentStep !== "information" ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                        className="flex items-center"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/cart")}
                        className="flex items-center"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Return to Cart
                      </Button>
                    )}
                    
                    {currentStep !== "review" ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center"
                      >
                        Continue
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="flex items-center"
                      >
                        {isProcessing ? "Processing..." : "Place Order"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-4">
                <OrderSummary
                  selectedShippingMethod={selectedShippingMethod}
                  isSticky={true}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
