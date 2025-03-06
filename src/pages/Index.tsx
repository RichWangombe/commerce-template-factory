
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the HomePage component which contains your beautiful UI
    navigate("/home");
  }, [navigate]);

  // This will only show briefly before redirect happens
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="text-center animate-pulse">
        <h1 className="text-4xl font-bold mb-4">Loading your beautiful UI...</h1>
      </div>
    </div>
  );
};

export default Index;
