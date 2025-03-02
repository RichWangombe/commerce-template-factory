
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
      <div className="rounded-full bg-neutral-100 p-8 mb-8">
        <svg
          className="h-12 w-12 text-neutral-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      
      <h1 className="text-6xl font-bold mb-4 animate-fade-in">404</h1>
      <h2 className="text-2xl font-medium mb-8 animate-fade-in animate-delay-200">Page Not Found</h2>
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
