/**
 * Main Dashboard/Index Page
 * 
 * This component serves as the main dashboard of the application, displaying:
 * - Financial summary cards (income, expenses, remaining balance)
 * - Transaction history charts with customizable views
 * - Account balance information
 * - Category spending breakdown
 * 
 * Features:
 * - Date range filtering
 * - Account filtering
 * - Multiple chart types (area, line, bar)
 * - Time period selection (hourly, daily, weekly, monthly, yearly)
 */

import React, { useState, useMemo, useEffect } from 'react';
import Layout from '@/components/Layout';
import DashboardCard from '@/components/DashboardCard';
import AccountSelector from '@/components/AccountSelector';
import DateRangeSelector, { DateRangePreset } from '@/components/DateRangeSelector';
import TransactionsChart from '@/components/TransactionsChart';
import CategoryChart from '@/components/CategoryChart';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useTransactions } from '@/context/TransactionContext';
import { useAccounts } from '@/context/AccountContext';
import { startOfDay, endOfDay, format, subDays, isWithinInterval, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { BarChart2, LineChart, AreaChart, Clock, ChevronLeft, ChevronRight, MessageSquare, BookOpen } from 'lucide-react';

type ChartType = 'area' | 'line' | 'bar';
type TimePeriod = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { transactions, getTransactionsSummary, isLoading, getTransactionsByPeriod } = useTransactions();
  const { accounts, getTotalBalance } = useAccounts();
  
  const [dateRange, setDateRange] = useState({
    startDate: startOfDay(new Date(2000, 0, 1)),
    endDate: endOfDay(new Date())
  });

  const [selectedAccount, setSelectedAccount] = useState('All accounts');
  const [chartType, setChartType] = useState<ChartType>('area');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('daily');
  const [periodIndex, setPeriodIndex] = useState(0); // 0 = current period
  
  // Tooltip state
  const [hoveredCategory, setHoveredCategory] = useState<{
    name: string;
    value: number;
    percentage: string;
    x: number;
    y: number;
  } | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const isInDateRange = isWithinInterval(transactionDate, {
        start: dateRange.startDate,
        end: dateRange.endDate
      });
      
      const isInAccount = selectedAccount === 'All accounts' ? 
        true : 
        transaction.channel === selectedAccount;
        
      return isInDateRange && isInAccount;
    });
  }, [transactions, dateRange, selectedAccount]);

  const calculateSummary = () => {
    let totalIncome = 0;
    let totalExpenses = 0;

    filteredTransactions.forEach(transaction => {
      if (transaction.amount >= 0) {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += Math.abs(transaction.amount);
      }
    });

    const remaining = totalIncome - totalExpenses;

    const globalSummary = getTransactionsSummary();

    return {
      totalIncome,
      totalExpenses,
      remaining,
      incomePercentChange: globalSummary.incomePercentChange,
      expensePercentChange: globalSummary.expensePercentChange,
      remainingPercentChange: globalSummary.remainingPercentChange,
    };
  };

  const { totalIncome, totalExpenses, remaining, incomePercentChange, expensePercentChange, remainingPercentChange } = calculateSummary();

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setDateRange({ 
      startDate: startOfDay(startDate), 
      endDate: endOfDay(endDate) 
    });
    
    const formattedStart = format(startDate, 'MMM d, yyyy');
    const formattedEnd = format(endDate, 'MMM d, yyyy');
    
    toast({
      title: "Date Range Changed",
      description: `Viewing data from ${formattedStart} to ${formattedEnd}`,
    });
  };

  const handlePresetChange = (preset: DateRangePreset) => {
    const today = new Date();
    let start: Date;
    let end = endOfDay(today);
    
    switch(preset) {
      case 'today':
        start = startOfDay(today);
        break;
      case 'yesterday':
        start = startOfDay(subDays(today, 1));
        end = endOfDay(subDays(today, 1));
        break;
      case '7days':
        start = startOfDay(subDays(today, 7));
        break;
      case '30days':
        start = startOfDay(subDays(today, 30));
        break;
      case 'thisYear':
        start = new Date(today.getFullYear(), 0, 1);
        break;
      case 'allTime':
      default:
        start = new Date(2000, 0, 1);
        break;
    }
    
    setDateRange({ startDate: start, endDate: end });
    
    const formattedStart = format(start, 'MMM d, yyyy');
    const formattedEnd = format(end, 'MMM d, yyyy');
    
    toast({
      title: "Date Range Changed",
      description: `Viewing data from ${formattedStart} to ${formattedEnd}`,
    });
  };

  const handleAccountChange = (account: string) => {
    setSelectedAccount(account);
    toast({
      title: "Account Changed",
      description: `Viewing data for ${account}`,
    });
  };

  const chartData = useMemo(() => {
    const dateGroups: Record<string, { date: string, income: number, expenses: number }> = {};
    
    const getDateFormat = (date: Date) => {
      switch(timePeriod) {
        case 'hourly':
          return format(date, 'h:00 a');
        case 'daily':
          return format(date, 'MMM d');
        case 'weekly':
          return `Week ${Math.ceil(date.getDate() / 7)} - ${format(date, 'MMM')}`;
        case 'monthly':
          return format(date, 'MMM yyyy');
        case 'yearly':
          return format(date, 'yyyy');
        default:
          return format(date, 'MMM d');
      }
    };
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const dateStr = getDateFormat(date);
      
      if (!dateGroups[dateStr]) {
        dateGroups[dateStr] = { date: dateStr, income: 0, expenses: 0 };
      }
      
      if (transaction.amount >= 0) {
        dateGroups[dateStr].income += transaction.amount;
      } else {
        dateGroups[dateStr].expenses += Math.abs(transaction.amount);
      }
    });
    
    return Object.values(dateGroups);
  }, [filteredTransactions, timePeriod]);

  const categoryData = useMemo(() => {
    const categoryColors: Record<string, string> = {
      'Food and Drink': '#f97316',
      'Travel': '#3b82f6',
      'Entertainment': '#8b5cf6',
      'Shopping': '#ec4899',
      'Bills': '#ef4444',
      'Rent': '#14b8a6',
      'Education': '#0ea5e9',
      'Other': '#64748b',
      'Income': '#22c55e',
      'Salary': '#15803d',
      'Allowance': '#65a30d',
      'Gift': '#ca8a04',
      'Transportation': '#0891b2',
      'Utilities': '#6366f1',
    };
    
    const categories: Record<string, { value: number, percentage: number, color: string }> = {};
    
    const expenseTransactions = filteredTransactions.filter(t => t.amount < 0);
    
    expenseTransactions.forEach(transaction => {
      const category = transaction.category || 'Other';
      if (!categories[category]) {
        categories[category] = { 
          value: 0, 
          percentage: 0, 
          color: categoryColors[category] || '#6b7280'
        };
      }
      categories[category].value += Math.abs(transaction.amount);
    });
    
    const totalExpenses = Object.values(categories).reduce((sum, cat) => sum + cat.value, 0);
    
    if (totalExpenses > 0) {
      Object.keys(categories).forEach(category => {
        categories[category].percentage = Math.round((categories[category].value / totalExpenses) * 100);
      });
    }
    
    return Object.keys(categories)
      .filter(name => categories[name].value > 0)
      .map(name => ({
        name,
        value: categories[name].value,
        percentage: categories[name].percentage,
        color: categories[name].color
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const getChartTypeIcon = () => {
    switch (chartType) {
      case 'line': return <LineChart className="h-4 w-4 mr-2" />;
      case 'bar': return <BarChart2 className="h-4 w-4 mr-2" />;
      default: return <AreaChart className="h-4 w-4 mr-2" />;
    }
  };

  const handlePrevPeriod = () => {
    setPeriodIndex(periodIndex + 1);
  };

  const handleNextPeriod = () => {
    if (periodIndex > 0) {
      setPeriodIndex(periodIndex - 1);
    }
  };

  const getPeriodLabel = () => {
    const now = new Date();
    
    switch(timePeriod) {
      case 'hourly':
        return `${format(now, 'MMMM d, yyyy')}`;
      case 'daily':
        return `${format(subDays(now, periodIndex * 7), 'MMMM yyyy')}`;
      case 'weekly':
        return `${format(subDays(now, periodIndex * 7), 'MMMM yyyy')}`;
      case 'monthly':
        const monthsAgo = new Date(now);
        monthsAgo.setMonth(now.getMonth() - periodIndex);
        return format(monthsAgo, 'yyyy');
      case 'yearly':
        return `${now.getFullYear() - periodIndex}-${now.getFullYear() - periodIndex + 1}`;
      default:
        return 'Current Period';
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <motion.div 
        className="mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-r from-gray-600 to-slate-600 rounded-xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmYiIHN0b3Atb3BhY2l0eT0iMC4wNSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHBhdGggZD0iTTAgMGgyMDB2MjAwSDB6IiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+')] opacity-50"></div>
          <h1 className="text-2xl font-bold relative z-10">
            Welcome Back, {user?.email?.split('@')[0] || 'Student'} 👋
          </h1>
          <p className="mt-1 opacity-90 relative z-10">Here's an overview of your finances</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 relative z-10">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 min-w-[160px]"
            >
              <p className="text-sm opacity-80">Total Balance</p>
              <p className="text-xl font-bold">${getTotalBalance().toFixed(2)}</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 min-w-[160px]"
            >
              <p className="text-sm opacity-80">Accounts</p>
              <p className="text-xl font-bold">{accounts.length}</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 min-w-[160px]"
            >
              <p className="text-sm opacity-80">Transactions</p>
              <p className="text-xl font-bold">{transactions.length}</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-4 mb-6 items-center"
      >
        <motion.div variants={itemVariants}>
          <AccountSelector 
            accounts={['All accounts', ...accounts.map(acc => acc.name)]} 
            defaultSelected="All accounts" 
            onSelect={handleAccountChange}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <DateRangeSelector 
            startDate={dateRange.startDate} 
            endDate={dateRange.endDate}
            onDateRangeChange={handleDateRangeChange}
            onPresetChange={handlePresetChange}
          />
        </motion.div>
      </motion.div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-12 w-12 rounded-full border-4 border-t-green-600 border-gray-200 animate-spin"></div>
        </div>
      ) : (
        <>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
          >
            <motion.div variants={itemVariants}>
              <DashboardCard
                title="Remaining"
                dateRange={`${format(dateRange.startDate, 'MMM d')} - ${format(dateRange.endDate, 'MMM d')}`}
                amount={remaining}
                percentChange={remainingPercentChange}
                type="remaining"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <DashboardCard
                title="Income"
                dateRange={`${format(dateRange.startDate, 'MMM d')} - ${format(dateRange.endDate, 'MMM d')}`}
                amount={totalIncome}
                percentChange={incomePercentChange}
                type="income"
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <DashboardCard
                title="Expenses"
                dateRange={`${format(dateRange.startDate, 'MMM d')} - ${format(dateRange.endDate, 'MMM d')}`}
                amount={totalExpenses}
                percentChange={expensePercentChange}
                type="expense"
              />
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6"
          >
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-3 bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-wrap justify-between items-center mb-5">
                <h2 className="text-lg font-semibold text-gray-800">Transactions</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button 
                      className="px-2 py-1 border-r hover:bg-gray-100"
                      onClick={handlePrevPeriod}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <span className="px-3 py-1">{getPeriodLabel()}</span>
                    <button 
                      className="px-2 py-1 border-l hover:bg-gray-100"
                      onClick={handleNextPeriod}
                      disabled={periodIndex <= 0}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1 bg-white border-green-500 text-green-700 hover:bg-green-50">
                        <Clock className="h-4 w-4" />
                        <span className="capitalize">{timePeriod}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem onClick={() => setTimePeriod('hourly')}>Hourly</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimePeriod('daily')}>Daily</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimePeriod('weekly')}>Weekly</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimePeriod('monthly')}>Monthly</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimePeriod('yearly')}>Yearly</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center bg-white border-green-500 text-green-700 hover:bg-green-50">
                        {getChartTypeIcon()}
                        <span>{chartType.charAt(0).toUpperCase() + chartType.slice(1)} chart</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem className="flex items-center" onClick={() => setChartType('area')}>
                        <AreaChart className="h-4 w-4 mr-2" />
                        Area chart
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center" onClick={() => setChartType('line')}>
                        <LineChart className="h-4 w-4 mr-2" />
                        Line chart
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center" onClick={() => setChartType('bar')}>
                        <BarChart2 className="h-4 w-4 mr-2" />
                        Bar chart
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {chartData.length > 0 ? (
                <div className="h-[350px]">
                  <TransactionsChart data={chartData} type={chartType} />
                </div>
              ) : (
                <div className="h-72 flex items-center justify-center text-gray-500">
                  No transaction data available for the selected date range
                </div>
              )}
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
              </div>
              
              {categoryData.length > 0 ? (
                <div className="flex items-center justify-center h-full w-full min-h-[400px] relative">
                  {/* Pie Chart - Centered */}
                  <div className="relative -mt-2">
                    <div className="relative h-80 w-80 flex items-center justify-center">
                      <div className="relative">
                        <svg className="transform -rotate-90 w-80 h-80" viewBox="0 0 280 280">
                          <defs>
                            <mask id="donut-mask-index">
                              <rect width="280" height="280" fill="white" />
                              <circle cx="140" cy="140" r="85" fill="black" />
                            </mask>
                          </defs>
                          {(() => {
                            // Use the same color system as Categories.tsx
                            const getCategoryColor = (categoryName, index) => {
                              const specificCategoryColors = {
                                'rent': '#C53030',           // Muted red
                                'housing': '#C53030',        // Muted red
                                'entertainment': '#DD6B20',   // Muted orange
                                'education': '#D69E2E',      // Muted golden yellow
                                'food': '#38A169',           // Muted lime green
                                'food & dining': '#38A169',  // Muted lime green
                                'food and drink': '#38A169', // Muted lime green
                                'groceries': '#38A169',      // Muted lime green
                                'shopping': '#0987A0',       // Muted cyan blue
                                'utilities': '#3182CE',      // Muted royal blue
                                'other': '#805AD5',          // Muted purple
                                'transportation': '#B83280', // Muted magenta
                                'travel': '#B83280',         // Muted magenta
                                'gas': '#B83280',            // Muted magenta
                                'healthcare': '#E53E3E',     // Muted red-pink
                                'insurance': '#2B6CB0',      // Muted blue
                                'phone': '#553C9A',          // Muted indigo
                                'internet': '#553C9A',       // Muted indigo
                                'subscription': '#9F7AEA',   // Muted light purple
                                'clothing': '#ED64A6',       // Muted pink
                                'personal care': '#F687B3',  // Muted light pink
                                'gym': '#48BB78',            // Muted green
                                'coffee': '#A0AEC0',         // Muted gray
                                'bills': '#ef4444',          // Red
                              };
                              
                              const fallbackColorPalette = [
                                '#4A5568', '#2D3748', '#1A202C', '#718096', '#A0AEC0',
                                '#4FD1C7', '#68D391', '#9AE6B4', '#F6E05E', '#F6AD55',
                                '#FC8181', '#F687B3', '#B794F6', '#90CDF4', '#81E6D9',
                              ];
                              
                              const normalizedName = categoryName.toLowerCase().trim();
                              
                              if (specificCategoryColors[normalizedName]) {
                                return specificCategoryColors[normalizedName];
                              }
                              
                              let hash = 0;
                              for (let i = 0; i < categoryName.length; i++) {
                                hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
                              }
                              const colorIndex = Math.abs(hash) % fallbackColorPalette.length;
                              return fallbackColorPalette[colorIndex];
                            };

                            const categoriesWithSpending = categoryData;
                            const totalSpent = categoriesWithSpending.reduce((sum, cat) => sum + cat.value, 0);
                            let cumulativeAngle = 0;
                            
                            return categoriesWithSpending.map((category, index) => {
                              const percentage = totalSpent > 0 ? (category.value / totalSpent) : 0;
                              const angle = percentage * 360;
                              const startAngle = cumulativeAngle;
                              const endAngle = cumulativeAngle + angle;
                              
                              // Calculate path for pie slice
                              const startAngleRad = (startAngle * Math.PI) / 180;
                              const endAngleRad = (endAngle * Math.PI) / 180;
                              
                              const x1 = 140 + 110 * Math.cos(startAngleRad);
                              const y1 = 140 + 110 * Math.sin(startAngleRad);
                              const x2 = 140 + 110 * Math.cos(endAngleRad);
                              const y2 = 140 + 110 * Math.sin(endAngleRad);
                              
                              const largeArcFlag = angle > 180 ? 1 : 0;
                              
                              const pathData = [
                                `M 140 140`,
                                `L ${x1} ${y1}`,
                                `A 110 110 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                                'Z'
                              ].join(' ');
                              
                              cumulativeAngle += angle;
                              
                              const categoryColor = getCategoryColor(category.name, index);
                              const percentageText = ((category.value / totalSpent) * 100).toFixed(1);
                              
                              return (
                                <g key={category.name}>
                                  <path
                                    d={pathData}
                                    fill={categoryColor}
                                    mask="url(#donut-mask-index)"
                                    className="hover:opacity-80 hover:stroke-white hover:stroke-2 transition-all duration-200 cursor-pointer"
                                    onMouseEnter={(e) => {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setHoveredCategory({
                                        name: category.name,
                                        value: category.value,
                                        percentage: percentageText,
                                        x: e.clientX,
                                        y: e.clientY
                                      });
                                    }}
                                    onMouseMove={(e) => {
                                      if (hoveredCategory) {
                                        setHoveredCategory(prev => prev ? {
                                          ...prev,
                                          x: e.clientX,
                                          y: e.clientY
                                        } : null);
                                      }
                                    }}
                                    onMouseLeave={() => {
                                      setHoveredCategory(null);
                                    }}
                                  />
                                  {/* Add subtle gradient overlay */}
                                  <path
                                    d={pathData}
                                    fill={`url(#gradient-${index})`}
                                    mask="url(#donut-mask-index)"
                                    opacity="0.1"
                                  />
                                  <defs>
                                    <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" stopColor="white" />
                                      <stop offset="100%" stopColor="transparent" />
                                    </linearGradient>
                                  </defs>
                                </g>
                              );
                            });
                          })()}
                        </svg>
                        
                        {/* Center Text with enhanced styling */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="text-center bg-white bg-opacity-80 rounded-full p-6 shadow-inner">
                            <div className="text-lg text-gray-600 font-medium mb-1">
                              Total Spent
                            </div>
                                                         <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                               ${categoryData.reduce((sum, cat) => sum + cat.value, 0).toFixed(0)}
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Tooltip */}
                  {hoveredCategory && (
                    <div
                      className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none transition-opacity duration-200"
                      style={{
                        left: hoveredCategory.x + 10,
                        top: hoveredCategory.y - 10,
                        transform: 'translateY(-100%)'
                      }}
                    >
                      <div className="text-sm font-medium">{hoveredCategory.name}</div>
                      <div className="text-xs opacity-90">
                        ${hoveredCategory.value.toFixed(0)} ({hoveredCategory.percentage}%)
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-72 flex items-center justify-center text-gray-500">
                  No category data available for the selected date range
                </div>
              )}
            </motion.div>
          </motion.div>
          
          {/* Help & Resources Section */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-12 bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300"
          >
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Need Help Getting Started?</h2>
              <p className="text-gray-600 mb-6">
                Get the most out of Armo with our comprehensive guides and resources.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/faq">
                  <Button 
                    variant="outline" 
                    className="border-green-500 text-green-700 hover:bg-green-50 px-6 py-3"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    View FAQs
                  </Button>
                </Link>
                <Link to="/instructions">
                  <Button 
                    className="bg-green-600 text-white hover:bg-green-700 px-6 py-3"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Instructions Guide
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </Layout>
  );
};

export default Index;
