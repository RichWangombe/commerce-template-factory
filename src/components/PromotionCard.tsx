
import { Link } from "react-router-dom";

export interface PromotionCardProps {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  backgroundColor?: string;
  ctaText?: string;
  ctaLink?: string;
}

export const PromotionCard = ({
  id,
  title,
  subtitle,
  image,
  backgroundColor = "bg-neutral-100",
  ctaText = "Shop Now",
  ctaLink = "#",
}: PromotionCardProps) => {
  return (
    <div 
      className={`overflow-hidden rounded-xl ${backgroundColor} p-6 product-card`}
    >
      <div className="flex flex-col justify-between h-full">
        <div className="mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="mt-1 text-sm">{subtitle}</p>
        </div>
        
        <div className="flex flex-col items-center">
          <img 
            src={image} 
            alt={title} 
            className="max-h-40 object-contain mb-6" 
          />
          
          <Link
            to={ctaLink}
            className="button-press inline-flex items-center justify-center rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
};
