
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-24">
      <div className="mb-8">
        <img
          src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop"
          alt="Circuit board"
          className="w-64 h-64 object-cover rounded-2xl opacity-80"
        />
      </div>
      
      <h1 className="text-6xl font-bold mb-4 text-gray-800 animate-fade-in">404</h1>
      <h2 className="text-2xl font-medium mb-8 text-gray-700 animate-fade-in animate-delay-200">Page Not Found</h2>
      <p className="text-neutral-600 max-w-md text-center mb-8 animate-fade-in animate-delay-300">
        We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
      </p>
      
      <div className="flex flex-wrap gap-4 animate-fade-in animate-delay-400">
        <Link
          to="/"
          className="button-press rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          Go Home
        </Link>
        <Link
          to="/products"
          className="button-press rounded-full border border-neutral-200 px-8 py-3 text-sm font-medium transition-colors hover:bg-neutral-50"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
