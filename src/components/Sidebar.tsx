
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  TagIcon, 
  CreditCard, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Menu,
  LogOut
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const isMobile = useIsMobile();
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out', error);
    }
  };

  const links = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/dashboard',
    },
    {
      name: 'Transactions',
      icon: <BarChart2 size={20} />,
      path: '/transactions',
    },
    {
      name: 'Categories',
      icon: <TagIcon size={20} />,
      path: '/categories',
    },
    {
      name: 'Accounts',
      icon: <CreditCard size={20} />,
      path: '/accounts',
    },
    {
      name: 'Settings',
      icon: <Settings size={20} />,
      path: '/settings',
    },
  ];

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="flex justify-around py-2">
          {links.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'rounded-full',
                  location.pathname === link.path
                    ? 'bg-finflow-blue text-white'
                    : 'text-gray-500'
                )}
              >
                {link.icon}
              </Button>
            </Link>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="text-gray-500 rounded-full"
          >
            <LogOut size={20} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'h-screen fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out border-r bg-white',
          collapsed ? 'w-[80px]' : 'w-[240px]'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-[56px] flex items-center px-3 border-b">
            <Link 
              to="/landing" 
              className="flex items-center gap-2 font-semibold text-lg transition-all duration-300"
              onMouseEnter={() => setIsHoveringLogo(true)}
              onMouseLeave={() => setIsHoveringLogo(false)}
            >
              <motion.div 
                className="w-7 h-7 bg-finflow-blue rounded-lg flex items-center justify-center text-white"
                animate={{ 
                  rotate: isHoveringLogo ? 360 : 0,
                  scale: isHoveringLogo ? 1.1 : 1
                }}
                transition={{ duration: 0.5 }}
              >
                F
              </motion.div>
              {!collapsed && <span>FinFlow</span>}
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto py-3">
            <div className="flex flex-col gap-1 px-2">
              {links.map((link) => (
                <Link to={link.path} key={link.path} className="block">
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start gap-2 px-2 rounded-lg h-9',
                      location.pathname === link.path
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        : ''
                    )}
                  >
                    {link.icon}
                    {!collapsed && <span>{link.name}</span>}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 px-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg"
              onClick={handleSignOut}
            >
              <LogOut size={18} />
              {!collapsed && (
                <div className="flex flex-col items-start">
                  <span>Sign Out</span>
                  <span className="text-xs text-gray-500">
                    {user?.email?.split('@')[0]}
                  </span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
      <Button
        variant="secondary"
        size="icon"
        className="fixed left-[calc(240px-14px)] top-[10px] z-50 rounded-lg shadow-md transition-all duration-300 ease-in-out bg-white text-gray-700 hover:bg-gray-50 h-7 w-7"
        style={{
          left: collapsed ? 'calc(80px - 14px)' : 'calc(240px - 14px)',
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight size={16} />
        ) : (
          <ChevronLeft size={16} />
        )}
      </Button>
    </>
  );
};

export default Sidebar;
