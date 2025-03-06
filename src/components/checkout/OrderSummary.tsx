
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { ShippingMethod } from "@/types/checkout";
import { cn } from "@/lib/utils";

interface OrderSummaryProps {
  className?: string;
  selectedShippingMethod?: ShippingMethod;
  isSticky?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  className, 
  selectedShippingMethod,
  isSticky = false
}) => {
  const { state, subtotal } = useCart();
  const { items } = state;
  
  // Tax calculation (example: 8%)
  const taxRate = 0.08;
  const taxAmount = subtotal * taxRate;
  
  // Shipping calculation
  const shippingAmount = selectedShippingMethod ? selectedShippingMethod.price : 0;
  
  // Total calculation
  const totalAmount = subtotal + taxAmount + shippingAmount;

  return (
    <div className={cn(
      "bg-white rounded-lg border border-neutral-200 p-6",
      isSticky && "lg:sticky lg:top-4",
      className
    )}>
      <h3 className="text-lg font-medium mb-4">Order Summary</h3>
      
      {items.length > 0 ? (
        <>
          <div className="max-h-80 overflow-y-auto mb-4 -mx-2 px-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center py-3">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-neutral-200 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain"
                  />
                  <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                    {item.quantity}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-sm font-medium text-neutral-900 line-clamp-1">
                    {item.name}
                  </h4>
                  {item.color && (
                    <p className="text-xs text-neutral-500">
                      Color: {item.color}
                    </p>
                  )}
                  <p className="text-sm text-neutral-500 flex justify-between mt-1">
                    <span>${item.price.toFixed(2)} × {item.quantity}</span>
                    <span className="font-medium text-neutral-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-600">Shipping</span>
              <span>
                {shippingAmount === 0 && !selectedShippingMethod 
                  ? 'Calculated at next step' 
                  : `$${shippingAmount.toFixed(2)}`}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-neutral-600">Tax (estimated)</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex justify-between text-base font-medium">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-neutral-500">Your cart is empty</p>
        </div>
      )}
    </div>
  );
};
