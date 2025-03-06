
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecommendations } from "@/contexts/RecommendationContext";

export const ProductViewTracker: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { recordProductView } = useRecommendations();
  
  useEffect(() => {
    if (id) {
      const productId = Number(id);
      if (!isNaN(productId)) {
        recordProductView(productId);
      }
    }
  }, [id, recordProductView]);
  
  return null;
};
