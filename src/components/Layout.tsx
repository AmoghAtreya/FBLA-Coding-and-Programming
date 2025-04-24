
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Button } from './ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [collapsed, setCollapsed] = useState(false);

  const isAuthPage = location.pathname === '/auth';
  const isLandingPage = location.pathname === '/landing' || location.pathname === '/' || location.pathname === '/faq';

  useEffect(() => {
    if (!loading && !user && !isAuthPage && !isLandingPage) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page.",
      });
      navigate('/auth');
    }
  }, [user, loading, navigate, toast, isAuthPage, isLandingPage]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 w-full">
        <div className="h-12 w-12 rounded-full border-4 border-t-blue-600 border-gray-200 animate-spin"></div>
      </div>
    );
  }

  if (!user && !isAuthPage && !isLandingPage) {
    return null;
  }

  const showSidebar = user && !isLandingPage && !isAuthPage;

  return (
    <div className="flex min-h-screen bg-gray-50 w-full">
      {showSidebar && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}
      <div className={`flex-1 transition-all duration-300 ${showSidebar ? (collapsed ? 'ml-[80px]' : 'ml-[240px]') : ''}`}>
        {(isLandingPage || isAuthPage) && (
          <nav className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <a href="/" className="text-gray-600 hover:text-finflow-blue transition-colors">Home</a>
                <a onClick={() => window.location.href = '/#features'} className="text-gray-600 hover:text-finflow-blue transition-colors cursor-pointer">Features</a>
                <a href="/faq" className="text-gray-600 hover:text-finflow-blue transition-colors">FAQ</a>
                {user && <a href="/dashboard" className="text-gray-600 hover:text-finflow-blue transition-colors">Dashboard</a>}
              </div>
              {!isAuthPage && !user && (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-finflow-blue hover:bg-blue-700 text-white transition-colors"
                >
                  Login / Sign Up
                </Button>
              )}
            </div>
          </nav>
        )}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
