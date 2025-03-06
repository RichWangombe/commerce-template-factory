
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRecommendations } from "@/contexts/recommendation";

interface ProductViewTrackerProps {
  productId?: number;
}

export const ProductViewTracker: React.FC<ProductViewTrackerProps> = ({ productId }) => {
  const { id } = useParams<{ id: string }>();
  const { recordProductView } = useRecommendations();
  
  useEffect(() => {
    // If a specific productId is provided, use that
    if (productId) {
      recordProductView(productId);
      return;
    }
    
    // Otherwise try to get it from URL params
    if (id) {
      const parsedId = Number(id);
      if (!isNaN(parsedId)) {
        recordProductView(parsedId);
      }
    }
  }, [id, productId, recordProductView]);
  
  return null;
};
