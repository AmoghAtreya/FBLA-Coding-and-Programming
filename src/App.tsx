import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { TransactionProvider } from '@/context/TransactionContext';
import { AccountProvider } from '@/context/AccountContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Landing from '@/pages/Landing';
import LandingNew from '@/landingNew';
import FAQ from '@/pages/FAQ';
import Instructions from '@/pages/Instructions';
import Transactions from '@/pages/Transactions';
import Categories from '@/pages/Categories';
import Accounts from '@/pages/Accounts';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import SavingsGoals from '@/pages/SavingsGoals';
import { Toaster } from '@/components/ui/toaster';
import ChatBot from '@/components/ChatBot';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

// Error Boundary Component for Routes
const RouteErrorBoundary = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-finflow-light-blue">
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-finflow-blue mb-4">Oops!</h1>
        <p className="text-xl text-gray-700 mb-8">Something went wrong</p>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          We encountered an unexpected error. Please try refreshing the page or return to the dashboard.
        </p>
        <div className="space-x-4">
          <button 
            onClick={() => window.location.reload()}
            className="bg-finflow-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
          <a 
            href="/dashboard"
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors inline-block"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

// Component to handle protected routes
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // If still loading auth state, return nothing yet
  if (loading) return null;
  
  // If not authenticated, redirect to landing
  if (!user) return <Navigate to="/landing" replace />;
  
  // If authenticated, render the element
  return <>{element}</>;
};

// Component to handle auth routes
const AuthRedirect = ({ element }: { element: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // If still loading auth state, return nothing yet
  if (loading) return null;
  
  // If authenticated, redirect to dashboard
  if (user) return <Navigate to="/dashboard" replace />;
  
  // If not authenticated, render the element
  return <>{element}</>;
};

// Component to handle home redirection
const HomeRedirect = () => {
  const { user, loading } = useAuth();
  
  // If still loading auth state, return nothing yet
  if (loading) return null;
  
  // If authenticated, redirect to dashboard, otherwise to landing
  if (user) return <Navigate to="/dashboard" replace />;
  return <Navigate to="/landing" replace />;
};

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <HomeRedirect />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/dashboard',
      element: <ProtectedRoute element={<Index />} />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/landing',
      element: <Landing />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/landing-new',
      element: <LandingNew />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/auth',
      element: <AuthRedirect element={<Auth />} />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/transactions',
      element: <ProtectedRoute element={<Transactions />} />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/categories',
      element: <ProtectedRoute element={<Categories />} />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/accounts',
      element: <ProtectedRoute element={<Accounts />} />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/settings',
      element: <ProtectedRoute element={<Settings />} />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/faq',
      element: <FAQ />, // Removed ProtectedRoute wrapper
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/instructions',
      element: <Instructions />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/savings-goals',
      element: <ProtectedRoute element={<SavingsGoals />} />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '/analytics',
      element: <ProtectedRoute element={<Analytics />} />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: '*',
      element: <NotFound />,
      errorElement: <RouteErrorBoundary />,
    },
  ]);

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AccountProvider>
          <TransactionProvider>
            <AppRouter />
            <Toaster />
            <ChatBot />
          </TransactionProvider>
        </AccountProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
