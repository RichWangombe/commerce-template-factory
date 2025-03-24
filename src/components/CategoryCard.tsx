
import { Link } from "react-router-dom";

export interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  productCount?: number;
}

export const CategoryCard = ({
  id,
  name,
  icon,
  productCount,
}: CategoryCardProps) => {
  // Convert name to kebab-case for URL
  const categorySlug = id.toLowerCase();
  
  return (
    <Link 
      to={`/category/${categorySlug}`}
      className="group flex flex-col items-center justify-center rounded-xl bg-neutral-50 p-6 text-center transition-all duration-300 hover:bg-neutral-100 product-card"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110">
        <img src={icon} alt={name} className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-medium">{name}</h3>
      {productCount !== undefined && (
        <p className="mt-1 text-xs text-neutral-500">{productCount} products</p>
      )}
    </Link>
  );
};
