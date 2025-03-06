
import React from "react";
import { CheckoutStep } from "@/types/checkout";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
  steps: Array<{
    id: CheckoutStep;
    label: string;
  }>;
}

export const CheckoutProgress: React.FC<CheckoutProgressProps> = ({
  currentStep,
  steps,
}) => {
  // Find the index of the current step
  const currentIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="hidden md:block">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = index < currentIndex;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="relative flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2",
                    isCompleted
                      ? "border-green-500 bg-green-500 text-white"
                      : isActive
                      ? "border-primary bg-primary text-white"
                      : "border-neutral-300 bg-white text-neutral-300"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "absolute top-10 whitespace-nowrap text-xs font-medium",
                    isActive
                      ? "text-primary"
                      : isCompleted
                      ? "text-green-500"
                      : "text-neutral-500"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "h-0.5 w-12 flex-1",
                    index < currentIndex
                      ? "bg-green-500"
                      : "bg-neutral-200"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
