
import { useContext } from "react";
import RecommendationContext, { RecommendationContextType } from "./RecommendationContext";

export const useRecommendations = (): RecommendationContextType => {
  const context = useContext(RecommendationContext);
  if (context === undefined) {
    throw new Error('useRecommendations must be used within a RecommendationProvider');
  }
  return context;
};
