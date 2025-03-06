
import { Link } from "react-router-dom";

interface ProductNotFoundProps {
  message?: string;
}

export const ProductNotFound = ({ message = "Product Not Found" }: ProductNotFoundProps) => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{message}</h1>
        <Link to="/" className="text-blue-500 hover:underline">Return to Home</Link>
      </div>
    </div>
  );
};
