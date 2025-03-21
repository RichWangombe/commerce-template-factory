
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateReview } from "@/utils/dataFetchers";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  rating: z.number().min(1, { message: "Rating is required" }).max(5),
  title: z.string().min(2, { message: "Title is required" }).max(100),
  comment: z.string().min(10, { message: "Comment must be at least 10 characters" }).max(1000),
});

type FormValues = z.infer<typeof formSchema>;

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export const ReviewForm = ({ productId, onSuccess }: ReviewFormProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const { user } = useAuth();
  const createReview = useCreateReview();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      title: "",
      comment: "",
    },
  });
  
  const watchedRating = form.watch("rating");
  
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to submit a review");
      return;
    }
    
    try {
      await createReview.mutateAsync({
        productId,
        rating: data.rating,
        title: data.title,
        comment: data.comment,
      });
      
      toast.success("Thank you for your review!");
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit review. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="bg-card p-6 rounded-xl border border-border">
        <h3 className="text-xl font-bold mb-2">Write a Review</h3>
        <p className="text-muted-foreground mb-4">You need to be logged in to write a review.</p>
        <Button variant="outline" asChild>
          <a href="/signin">Sign In to Review</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card p-6 rounded-xl border border-border">
      <h3 className="text-xl font-bold mb-4">Write a Review</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        className="focus:outline-none"
                        onMouseEnter={() => setHoveredRating(rating)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => field.onChange(rating)}
                      >
                        <Star
                          className={`h-8 w-8 ${
                            rating <= (hoveredRating || field.value)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-neutral-300 dark:text-neutral-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review Title</FormLabel>
                <FormControl>
                  <Input placeholder="Summarize your experience" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Review</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What did you like or dislike about this product?"
                    className="min-h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full sm:w-auto"
            disabled={createReview.isPending}
          >
            {createReview.isPending ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
