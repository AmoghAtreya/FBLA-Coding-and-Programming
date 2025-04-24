import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';

/**
 * 404 Not Found Page
 * 
 * Displayed when users attempt to access non-existent routes.
 * Features:
 * - Error logging
 * - User-friendly error message
 * - Return to dashboard button
 * - Animated layout
 */
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-finflow-light-blue">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-finflow-blue mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-8">Oops! Page not found</p>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button className="bg-finflow-blue">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <a href="/">Return to Dashboard</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
