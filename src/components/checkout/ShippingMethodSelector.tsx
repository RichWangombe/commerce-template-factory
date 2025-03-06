
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShippingMethod } from "@/types/checkout";
import { cn } from "@/lib/utils";

interface ShippingMethodSelectorProps {
  shippingMethods: ShippingMethod[];
}

export const ShippingMethodSelector: React.FC<ShippingMethodSelectorProps> = ({ 
  shippingMethods 
}) => {
  const { control } = useFormContext();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Shipping Method</h3>
      
      <FormField
        control={control}
        name="shippingMethodId"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="space-y-3"
              >
                {shippingMethods.map((method) => (
                  <label
                    key={method.id}
                    className={cn(
                      "flex cursor-pointer items-start space-x-4 rounded-lg border p-4 transition-colors",
                      field.value === method.id
                        ? "border-primary bg-primary/5"
                        : "border-input hover:bg-accent/10"
                    )}
                  >
                    <RadioGroupItem value={method.id} className="mt-1" id={method.id} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor={method.id}
                          className="text-base font-medium cursor-pointer"
                        >
                          {method.name}
                        </label>
                        <span className="font-medium">${method.price.toFixed(2)}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {method.description}
                      </p>
                      <p className="mt-1 text-sm">
                        Estimated delivery: {method.estimatedDays}
                      </p>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
