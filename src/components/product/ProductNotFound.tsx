
import { Link } from "react-router-dom";

interface ProductNotFoundProps {
  message?: string;
  title?: string;
  linkText?: string;
  linkUrl?: string;
}

export const ProductNotFound = ({ 
  message = "Product Not Found",
  title = "Product Not Found",
  linkText = "Return to Home",
  linkUrl = "/" 
}: ProductNotFoundProps) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground mb-6">{message}</p>
        <Link to={linkUrl} className="text-blue-500 hover:underline">{linkText}</Link>
      </div>
    </div>
  );
};
