
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { RecommendedProducts } from "@/components/RecommendedProducts";

interface RecommendationSectionProps {
  title?: string;
  productId?: number;
  showViewAll?: boolean;
}

export const RecommendationSection = ({ 
  title = "Recommended For You",
  productId,
  showViewAll = true
}: RecommendationSectionProps) => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            {title}
          </h2>
          {showViewAll && (
            <Link 
              to="/recommendations" 
              className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              See all recommendations <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          )}
        </div>
        <RecommendedProducts productId={productId} />
      </div>
    </section>
  );
};
