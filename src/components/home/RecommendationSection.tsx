
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { RecommendedProducts } from "@/components/RecommendedProducts";

export const RecommendationSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Recommended For You</h2>
          <Link 
            to="/recommendations" 
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            See all recommendations <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <RecommendedProducts />
      </div>
    </section>
  );
};
