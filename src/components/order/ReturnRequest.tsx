
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const returnReasons = [
  "Wrong size",
  "Defective item",
  "Not as described",
  "Changed mind",
  "Other"
];

interface ReturnRequestProps {
  orderId: string;
  onComplete: () => void;
}

export const ReturnRequest: React.FC<ReturnRequestProps> = ({ orderId, onComplete }) => {
  const form = useForm({
    defaultValues: {
      reason: '',
      details: '',
    }
  });

  const onSubmit = async (data: any) => {
    try {
      // Implementation needed: Send return request to backend
      toast.success("Return request submitted successfully");
      onComplete();
    } catch (error) {
      toast.error("Failed to submit return request");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Return Reason</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="space-y-2"
                >
                  {returnReasons.map((reason) => (
                    <div key={reason} className="flex items-center space-x-2">
                      <RadioGroupItem value={reason} id={reason} />
                      <FormLabel htmlFor={reason}>{reason}</FormLabel>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Details</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Please provide more details about your return..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit Return Request</Button>
      </form>
    </Form>
  );
};
