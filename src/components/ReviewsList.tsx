
import { useState } from "react";
import { Star, ThumbsUp, Check } from "lucide-react";
import { Review } from "@/types/review";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ReviewsListProps {
  reviews: Review[];
  productId: string;
}

export const ReviewsList = ({ reviews, productId }: ReviewsListProps) => {
  const [sortBy, setSortBy] = useState<string>("newest");
  const [filteredRating, setFilteredRating] = useState<number | null>(null);
  
  const filteredReviews = reviews
    .filter(review => filteredRating ? review.rating === filteredRating : true)
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        case "helpful":
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });
  
  const averageRating = reviews.length 
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
    : 0;
    
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
    return { rating, count, percentage };
  });

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      
      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="md:w-1/3 bg-neutral-50 p-6 rounded-xl">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold">{averageRating}</div>
            <div className="flex justify-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(Number(averageRating))
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-neutral-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-neutral-500 mt-1">
              Based on {reviews.length} reviews
            </div>
          </div>
          
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2">
                <div className="text-sm w-10">{rating} stars</div>
                <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-neutral-500 w-8">{count}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:w-2/3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-lg font-medium">
              {filteredReviews.length} {filteredReviews.length === 1 ? "Review" : "Reviews"}
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                {[null, 5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating === null ? "all" : rating}
                    variant={filteredRating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilteredRating(rating)}
                    className="px-3"
                  >
                    {rating === null ? "All" : `${rating} ★`}
                  </Button>
                ))}
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="highest">Highest Rating</SelectItem>
                  <SelectItem value="lowest">Lowest Rating</SelectItem>
                  <SelectItem value="helpful">Most Helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredReviews.length > 0 ? (
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="border-b border-neutral-200 pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-neutral-300"
                              }`}
                            />
                          ))}
                        </div>
                        <h4 className="font-medium">{review.userName}</h4>
                        {review.verified && (
                          <span className="text-green-600 text-xs flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-neutral-500 mt-1">
                        {new Date(review.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <p className="mt-3 text-neutral-700">{review.comment}</p>
                  
                  <div className="flex items-center mt-4">
                    <Button variant="ghost" size="sm" className="text-neutral-500 gap-1.5">
                      <ThumbsUp className="h-4 w-4" />
                      Helpful ({review.helpful})
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-neutral-300 rounded-lg">
              <p className="text-neutral-500">No reviews match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
