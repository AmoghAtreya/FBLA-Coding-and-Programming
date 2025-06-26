/**
 * Layout Component
 * 
 * Professional financial application layout with:
 * - Fixed collapsible left sidebar navigation
 * - Full-width content area
 * - Fixed collapsible right sidebar with card and quick transaction
 * - Dark theme matching the new landing page
 */

import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useAccounts } from '@/context/AccountContext';
import { useTransactions } from '@/context/TransactionContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LayoutDashboard,
  BarChart3,
  CreditCard,
  Wallet,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Copy,
  Eye,
  Send,
  DollarSign,
  Menu,
  X,
  User,
  Building,
  HelpCircle,
  Moon,
  Sun
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { getTotalBalance } = useAccounts();
  const { transactions } = useTransactions();
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [isCardSectionCollapsed, setIsCardSectionCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const totalExpenses = transactions.reduce((total, transaction) => total + transaction.amount, 0).toLocaleString();


  // Calculate actual transaction count for notification
  const recentTransactionsCount = transactions.filter(t => {
    const transactionDate = new Date(t.created_at || t.date);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return transactionDate > oneDayAgo;
  }).length;

  const navigationItems = [
    { 
      name: 'Overview', 
      path: '/', 
      icon: LayoutDashboard,
      active: location.pathname === '/'
    },
    { 
      name: 'Analytics', 
      path: '/analytics', 
      icon: BarChart3,
      active: location.pathname === '/analytics'
    },
    { 
      name: 'Transaction', 
      path: '/transactions', 
      icon: Send,
      active: location.pathname === '/transactions',
      badge: recentTransactionsCount > 0 ? recentTransactionsCount.toString() : undefined
    },
    { 
      name: 'Card', 
      path: '/accounts', 
      icon: CreditCard,
      active: location.pathname === '/accounts',
      submenu: ['Personal card', 'Business card']
    },
    { 
      name: 'Payment', 
      path: '/categories', 
      icon: Wallet,
      active: location.pathname === '/categories'
    },
  ];

  const accountItems = [
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: Settings,
      active: location.pathname === '/settings'
    },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSidebarLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      handleSignOut();
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
      {/* Left Sidebar - Dark Theme to Match Landing */}
      <motion.div 
        className="flex flex-col relative h-screen overflow-hidden border-r"
        style={{ 
          backgroundColor: '#181818',
          borderColor: '#262626'
        }}
        animate={{ width: isLeftSidebarCollapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Background Pattern - Same as Landing */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Collapse Button */}
        <button
          onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
          className="fixed top-[25px] z-[50] w-7 h-7 rounded-full flex items-center justify-center text-black hover:brightness-90 transition-all duration-300 shadow-lg border-2"
          style={{
            left: isLeftSidebarCollapsed ? '68px' : '244px',
            backgroundColor: '#333333',
            borderColor: '#1a1a1a',
            color: '#ffffff'
          }}
        >
          {isLeftSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Logo */}
        <div className="p-6 border-b flex-shrink-0 relative z-10" style={{ borderColor: '#262626' }}>
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">A</span>
            </div>
            <AnimatePresence>
              {!isLeftSidebarCollapsed && (
                <motion.span 
                  className="text-white font-semibold text-xl"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Armo.
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation - Scrollable if needed */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto relative z-10">
          {navigationItems.map((item) => (
            <div key={item.name}>
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  item.active
                    ? 'text-black font-medium'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                }`}
                style={item.active ? { backgroundColor: '#9fd1b5' } : {}}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <AnimatePresence>
                    {!isLeftSidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {!isLeftSidebarCollapsed && (
                    <motion.div 
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                      {item.submenu && (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              
              {/* Submenu */}
              {item.submenu && item.active && !isLeftSidebarCollapsed && (
                <motion.div 
                  className="ml-8 mt-2 space-y-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.2 }}
                >
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem}
                      onClick={() => {
                        if (subItem === 'Personal card') {
                          navigate('/accounts?type=personal');
                        } else if (subItem === 'Business card') {
                          navigate('/accounts?type=business');
                        }
                      }}
                      className="flex items-center space-x-2 text-gray-400 text-sm py-2 px-3 hover:text-gray-200 cursor-pointer rounded-lg hover:bg-gray-800/30 transition-colors w-full text-left"
                    >
                      {subItem === 'Personal card' && <User className="h-4 w-4" />}
                      {subItem === 'Business card' && <Building className="h-4 w-4" />}
                      <span>{subItem}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </nav>

        {/* Account Section - Fixed at bottom */}
        <div className="p-4 border-t flex-shrink-0 relative z-10" style={{ borderColor: '#262626' }}>
          <AnimatePresence>
            {!isLeftSidebarCollapsed && (
              <motion.div 
                className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                Account
              </motion.div>
            )}
          </AnimatePresence>
          {accountItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                item.active
                  ? 'text-black font-medium'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
              }`}
              style={item.active ? { backgroundColor: '#9fd1b5' } : {}}
            >
              <item.icon className="h-5 w-5" />
              <AnimatePresence>
                {!isLeftSidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
          
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to sign out?')) {
                handleSignOut();
              }
            }}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200 mt-2"
          >
            <LogOut className="h-5 w-5" />
            <AnimatePresence>
              {!isLeftSidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex h-screen overflow-hidden">
        {/* Center Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Header - Fixed */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search anything"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9fd1b5] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Right Header */}
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5 text-gray-500" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </Button>
                
                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#9fd1b5' }}>
                        <span className="text-black font-medium text-sm">
                          {user?.email?.charAt(0)?.toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div className="hidden md:block text-left">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.email?.split('@')[0] || 'User'}
                        </div>
                        <div className="text-xs text-gray-500">Premium User</div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help & Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark Mode</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSidebarLogout}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content - Scrollable */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>

        {/* Right Sidebar - Fixed Height */}
        <AnimatePresence>
          {!isRightSidebarCollapsed && (
            <motion.div 
              className="w-96 bg-white border-l border-gray-200 flex flex-col h-screen"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 384, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Collapse Button */}
              <button
                onClick={() => setIsRightSidebarCollapsed(true)}
                className="absolute right-2 top-20 z-50 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ChevronRight className="h-3 w-3" />
              </button>

              {/* Right Sidebar Content - Independently Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* My Card Section */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900">My card</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-500">
                          <MoreHorizontal className="h-4 w-4" />
                          Add card
                        </Button>
                        <button
                          onClick={() => setIsCardSectionCollapsed(!isCardSectionCollapsed)}
                          className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          {isCardSectionCollapsed ? <ChevronDown className="h-3 w-3" /> : <ChevronDown className="h-3 w-3 rotate-180" />}
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <AnimatePresence>
                    {!isCardSectionCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <CardContent className="space-y-6">
                          {/* Credit Card - Made Rectangular */}
                          <div className="relative">
                            {/* Card Shadow/Base */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl transform rotate-2 opacity-20"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-500 to-gray-700 rounded-xl transform rotate-1 opacity-30"></div>
                            
                            {/* Main Card - 85.60 × 53.98 mm aspect ratio (1.6:1) */}
                            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl p-5 text-white overflow-hidden shadow-2xl border border-gray-700" style={{ aspectRatio: '1.6/1' }}>
                              {/* Card Background Pattern */}
                              <div className="absolute inset-0 opacity-5">
                                <div className="absolute top-3 right-3 w-24 h-24 border-2 border-white/30 rounded-full"></div>
                                <div className="absolute bottom-3 left-3 w-16 h-16 border border-white/20 rounded-full"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                  <div className="w-32 h-0.5 bg-white/20 rotate-45"></div>
                                  <div className="w-32 h-0.5 bg-white/20 -rotate-45 mt-1"></div>
                                </div>
                              </div>
                              
                              {/* Holographic Effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 animate-pulse"></div>
                              
                              <div className="relative z-10 h-full flex flex-col justify-between">
                                {/* Card Header */}
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="text-white/90 text-xs mb-1 font-medium text-left">{user?.email?.split('@')[0] || 'User'}</p>
                                    {/* <p className="text-white font-semibold text-sm tracking-wide">Amazon Platinum</p> */}
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center space-x">
                                      <div className="w-6 h-6 bg-orange-500 rounded-full opacity-90"></div>
                                      <div className="w-6 h-6 bg-red-500 rounded-full opacity-90 -ml-2"></div>
                                    </div>
                                    <p className="text-xs text-white/70 font-mono mt-1">Mastercard</p>
                                  </div>
                                </div>
                                
                                {/* Chip */}
                                <div className="flex items-center justify-between">
                                  <div className="w-10 h-7 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md shadow-inner border border-yellow-500/50 relative">
                                    <div className="absolute inset-1 bg-gradient-to-tl from-yellow-300 to-yellow-500 rounded-sm"></div>
                                    <div className="absolute inset-2 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-sm"></div>
                                  </div>
                                  {/* Contactless Symbol */}
                                  <div className="text-white/60">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                                    </svg>
                                  </div>
                                </div>
                                
                                {/* Card Number and Balance */}
                                <div>
                                  <p className="text-white/80 text-sm mb-1 font-mono tracking-widest">•••• •••• •••• 9018</p>
                                  {/*    */}
                                </div>
                                
                                {/* Card Footer */}
                                <div className="flex justify-between items-end">
                                  <div>
                                    <p className="text-white/60 text-xs mb-1">EXPIRES</p>
                                    <p className="text-white font-mono text-xs">04/28</p>
                                  </div>
                                  <div>
                                    <p className="text-white/60 text-xs mb-1">CVV</p>
                                    <p className="text-white font-mono text-xs">•••</p>
                                  </div>
                                </div>
                              </div>

                              {/* Green accent bars */}
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
                              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60"></div>
                            </div>
                          </div>

                          {/* Card Details */}
                          <div className="space-y-5">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm text-gray-500 mb-2">Card holder</p>
                              <p className="font-semibold text-gray-900 text-lg">{user?.email?.split('@')[0] || 'User'}</p>
                            </div>
                            
                            {/* <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm text-gray-500 mb-2">Card number</p>
                              <div className="flex items-center justify-between">
                                <p className="font-mono font-semibold text-gray-900 text-lg">4756 3232 9988 9018</p>
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div> */}
                            
                            <div className="grid grid-cols-3 gap-3">
                              <div className="bg-gray-50 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500 mb-1">Status</p>
                                <div className="flex items-center justify-center">
                                  {/* <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div> */}
                                  <p className="font-semibold text-black tracking-tight">${getTotalBalance().toLocaleString()}</p>
                                  {/* <p className="font-semibold text-green-600 text-sm">Active</p> */}
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500 mb-1">Expires</p>
                                <p className="font-semibold text-gray-900 text-sm">04/28</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500 mb-1">Type</p>
                                <p className="font-semibold text-gray-900 text-sm">Platinum</p>
                              </div>
                            </div>

                            {/* Card Stats */}
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-100">
                              <div className="flex justify-between items-center mb-3">
                                <p className="font-semibold text-gray-900">This Month</p>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">+12%</span>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Spent</p>
                                  <p className="font-bold text-gray-900">${totalExpenses.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Cashback</p>
                                  <p className="font-bold" style={{ color: '#9fd1b5' }}>${(parseFloat(totalExpenses.replace(/,/g, '')) * 0.12).toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>

                {/* Quick Transaction */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900">Quick Transaction</CardTitle>
                      {/* <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button> */}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-center">
                      <div className="flex -space-x-2">
                        {[
                          { name: 'F', color: 'from-blue-400 to-blue-600' },
                          { name: 'A', color: 'from-green-400 to-green-600' },
                          { name: 'G', color: 'from-purple-400 to-purple-600' },
                          { name: 'F', color: 'from-red-400 to-red-600' },
                        ].map((person, i) => (
                          <div 
                            key={i}
                            className={`w-10 h-10 rounded-full bg-gradient-to-r ${person.color} border-2 border-white flex items-center justify-center text-white text-sm font-medium shadow-sm`}
                          >
                            {person.name}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-500">Felix I</div>
                        <div className="text-sm text-gray-500">Gerdao</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-gray-500">Azzah</div>
                        <div className="text-sm text-gray-500">Felix</div>
                      </div>
                    </div>
                    
                    {/* <div>
                      <p className="text-sm text-gray-500 mb-2">Recipient's account</p>
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <span className="text-sm text-gray-900 font-mono">4843 - 1234 - 3422 - 9450</span>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div> */}

                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => navigate('/transactions')}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Money
                    </Button>
                  </CardContent>
                </Card>

                {/* View Report Section */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-gray-900">View Reports</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Financial Reports */}
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left"
                        onClick={() => navigate('/analytics')}
                      >
                        <BarChart3 className="h-4 w-4 mr-3" />
                        Financial Analytics
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left"
                        onClick={() => {
                          navigator.clipboard.writeText(getTotalBalance().toString());
                        }}
                      >
                        <Copy className="h-4 w-4 mr-3" />
                        Copy Balance
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left"
                        onClick={() => {
                          const csvContent = 'Date,Description,Amount,Category\n' + 
                            transactions.map(t => 
                              `${t.date},"${t.description}",${t.amount},"${t.category}"`
                            ).join('\n');
                          const blob = new Blob([csvContent], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'transactions.csv';
                          a.click();
                        }}
                      >
                        <DollarSign className="h-4 w-4 mr-3" />
                        Export Transactions
                      </Button>
                    </div>

                    {/* Quick Actions */}
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions</p>
                      <div className="space-y-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => navigate('/categories')}
                        >
                          <Wallet className="h-4 w-4 mr-2" />
                          Manage Categories
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => navigate('/accounts')}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          View All Cards
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={() => navigate('/settings')}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Account Settings
                        </Button>
                      </div>
                    </div>

                    {/* Account Summary */}
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-3">Account Summary</p>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Available</span>
                          <span className="text-sm font-semibold text-gray-900">${getTotalBalance().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Transactions</span>
                          <span className="text-sm font-semibold text-gray-900">{transactions.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Last Updated</span>
                          <span className="text-sm font-semibold text-gray-900">Just now</span>
                        </div>
                      </div>
                    </div>

                    {/* Notifications */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-gray-700">Notifications</p>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Bell className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {recentTransactionsCount > 0 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="text-xs font-medium text-blue-800">
                              {recentTransactionsCount} new transaction{recentTransactionsCount > 1 ? 's' : ''}
                            </p>
                            <p className="text-xs text-blue-600">View in transactions</p>
                          </div>
                        )}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-xs font-medium text-green-800">Budget on track</p>
                          <p className="text-xs text-green-600">You're within 85% of your limits</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsed Right Sidebar Button */}
        {isRightSidebarCollapsed && (
          <button
            onClick={() => setIsRightSidebarCollapsed(false)}
            className="fixed right-4 top-20 z-50 w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors shadow-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Layout;
