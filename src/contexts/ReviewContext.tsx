
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Review } from "@/types/review";

// Mock reviews data - in a real app, this would come from an API
const mockReviews: Review[] = [
  {
    id: "1",
    productId: "1",
    userId: "user1",
    userName: "John D.",
    rating: 5,
    comment: "These headphones are amazing! The sound quality is incredible and the noise cancellation works better than I expected. Battery life is excellent too - I've been using them for a week and only had to charge once.",
    date: "2023-12-15T08:30:00.000Z",
    helpful: 24,
    verified: true
  },
  {
    id: "2",
    productId: "1",
    userId: "user2",
    userName: "Sarah M.",
    rating: 4,
    comment: "Great headphones overall. Sound quality is excellent and they're very comfortable for long periods. The only downside is that they're a bit bulky for travel, but the carrying case helps with that.",
    date: "2023-11-20T14:15:00.000Z",
    helpful: 18,
    verified: true
  },
  {
    id: "3",
    productId: "1",
    userId: "user3",
    userName: "Michael R.",
    rating: 3,
    comment: "Decent headphones but overpriced in my opinion. The sound is good but not significantly better than my previous pair that cost half as much. Battery life is impressive though.",
    date: "2023-10-05T10:45:00.000Z",
    helpful: 7,
    verified: false
  },
  {
    id: "4",
    productId: "2",
    userId: "user4",
    userName: "Emma L.",
    rating: 5,
    comment: "This fitness tracker has changed my life! It accurately tracks all my workouts and the sleep monitoring feature has helped me improve my rest patterns. The app is user-friendly and provides great insights.",
    date: "2024-01-03T16:20:00.000Z",
    helpful: 31,
    verified: true
  },
  {
    id: "5",
    productId: "2",
    userId: "user5",
    userName: "David K.",
    rating: 4,
    comment: "Very good fitness tracker for the price. The heart rate monitor seems accurate compared to my previous devices. Battery lasts about 6 days for me which is convenient.",
    date: "2023-12-12T09:30:00.000Z",
    helpful: 15,
    verified: true
  }
];

interface ReviewContextType {
  reviews: Review[];
  getProductReviews: (productId: string) => Review[];
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpful'>) => void;
  markReviewHelpful: (reviewId: string) => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewProvider");
  }
  return context;
};

export const ReviewProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from an API
    setReviews(mockReviews);
  }, []);

  const getProductReviews = (productId: string) => {
    return reviews.filter(review => review.productId === productId);
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'helpful'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `review-${Date.now()}`,
      date: new Date().toISOString(),
      helpful: 0
    };
    
    setReviews(prevReviews => [...prevReviews, newReview]);
  };

  const markReviewHelpful = (reviewId: string) => {
    setReviews(prevReviews => 
      prevReviews.map(review => 
        review.id === reviewId 
          ? { ...review, helpful: review.helpful + 1 } 
          : review
      )
    );
  };

  return (
    <ReviewContext.Provider value={{ reviews, getProductReviews, addReview, markReviewHelpful }}>
      {children}
    </ReviewContext.Provider>
  );
};
