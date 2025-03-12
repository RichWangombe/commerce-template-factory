
import React from "react";
import { useFormContext } from "react-hook-form";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup } from "@/components/ui/radio-group";
import { ShippingMethod } from "@/types/checkout";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ShippingMethodSelectorProps {
  shippingMethods: ShippingMethod[];
}

export const ShippingMethodSelector: React.FC<ShippingMethodSelectorProps> = ({ 
  shippingMethods 
}) => {
  const { control, watch } = useFormContext();
  const selectedMethodId = watch("shippingMethodId");

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
                {shippingMethods.map((method) => {
                  const isSelected = field.value === method.id;
                  
                  return (
                    <label
                      key={method.id}
                      className={cn(
                        "relative flex cursor-pointer items-start space-x-4 rounded-lg border p-4 transition-colors",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-input hover:bg-accent/10"
                      )}
                      htmlFor={method.id}
                    >
                      <input 
                        type="radio"
                        id={method.id}
                        value={method.id}
                        checked={isSelected}
                        onChange={() => field.onChange(method.id)}
                        className="sr-only"
                      />
                      
                      <div className={cn(
                        "mt-1 flex h-5 w-5 items-center justify-center rounded-full border",
                        isSelected 
                          ? "border-primary" 
                          : "border-muted-foreground"
                      )}>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-2.5 w-2.5 rounded-full bg-primary"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-medium">
                            {method.name}
                          </span>
                          <span className="font-medium">${method.price.toFixed(2)}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {method.description}
                        </p>
                        <p className="mt-1 text-sm">
                          Estimated delivery: {method.estimatedDays}
                        </p>
                      </div>
                      
                      {isSelected && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </motion.div>
                      )}
                    </label>
                  );
                })}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
