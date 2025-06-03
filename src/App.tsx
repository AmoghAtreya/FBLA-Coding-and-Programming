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
import Transactions from '@/pages/Transactions';
import Categories from '@/pages/Categories';
import Accounts from '@/pages/Accounts';
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
    },
    {
      path: '/dashboard',
      element: <ProtectedRoute element={<Index />} />,
    },
    {
      path: '/landing',
      element: <Landing />,
    },
    {
      path: '/landing-new',
      element: <LandingNew />,
    },
    {
      path: '/auth',
      element: <AuthRedirect element={<Auth />} />,
    },
    {
      path: '/transactions',
      element: <ProtectedRoute element={<Transactions />} />,
    },
    {
      path: '/categories',
      element: <ProtectedRoute element={<Categories />} />,
    },
    {
      path: '/accounts',
      element: <ProtectedRoute element={<Accounts />} />,
    },
    {
      path: '/settings',
      element: <ProtectedRoute element={<Settings />} />,
    },
    {
      path: '/faq',
      element: <FAQ />, // Removed ProtectedRoute wrapper
    },
    {
      path: '/savings-goals',
      element: <ProtectedRoute element={<SavingsGoals />} />,
    },
    {
      path: '*',
      element: <NotFound />,
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
