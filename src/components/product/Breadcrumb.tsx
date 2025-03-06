
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  category: string;
  productName: string;
}

export const Breadcrumb = ({ category, productName }: BreadcrumbProps) => {
  return (
    <div className="flex items-center text-sm text-neutral-500">
      <Link to="/" className="hover:text-neutral-900">Home</Link>
      <ChevronRight className="mx-2 h-4 w-4" />
      <Link 
        to={`/category/${category.toLowerCase()}`} 
        className="hover:text-neutral-900"
      >
        {category}
      </Link>
      <ChevronRight className="mx-2 h-4 w-4" />
      <span className="text-neutral-900 font-medium">
        {productName}
      </span>
    </div>
  );
};
