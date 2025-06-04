/**
 * Main Dashboard/Index Page
 * 
 * Professional financial dashboard with:
 * - Financial summary cards (total money, income, expenses)
 * - Money analytics chart with working time period controls
 * - Transaction history table
 * - Clean layout without right sidebar (handled by Layout)
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import TransactionsChart from '@/components/TransactionsChart';
import CreateTransactionModal from '@/components/CreateTransactionModal';
import { useAuth } from '@/context/AuthContext';
import { useTransactions } from '@/context/TransactionContext';
import { useAccounts } from '@/context/AccountContext';
import { startOfDay, endOfDay, format, subDays, isWithinInterval } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Filter,
} from 'lucide-react';

type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

const Index = () => {
  const { user } = useAuth();
  const { transactions, getTransactionsSummary, isLoading } = useTransactions();
  const { getTotalBalance } = useAccounts();
  
  const [dateRange, setDateRange] = useState({
    startDate: startOfDay(subDays(new Date(), 30)),
    endDate: endOfDay(new Date())
  });

  const [selectedAccount, setSelectedAccount] = useState('All accounts');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('monthly');
  const [showCreateTransaction, setShowCreateTransaction] = useState(false);

  const handleTimePeriodChange = (period: TimePeriod) => {
    setTimePeriod(period);
    const today = new Date();
    let start: Date;
    let end = endOfDay(today);
    
    switch(period) {
      case 'daily':
        start = startOfDay(subDays(today, 30)); // Last 30 days
        break;
      case 'weekly':
        start = startOfDay(subDays(today, 90)); // Last 3 months
        break;
      case 'monthly':
        start = startOfDay(subDays(today, 365)); // Last 12 months
        break;
      case 'yearly':
        start = startOfDay(subDays(today, 365 * 3)); // Last 3 years
        break;
      default:
        start = startOfDay(subDays(today, 30));
    }
    
    setDateRange({ startDate: start, endDate: end });
  };

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

    const totalMoney = getTotalBalance();
    const globalSummary = getTransactionsSummary();

    return {
      totalMoney,
      totalIncome,
      totalExpenses,
      incomePercentChange: globalSummary.incomePercentChange || 10,
      expensePercentChange: globalSummary.expensePercentChange || 2,
    };
  };

  const { totalMoney, totalIncome, totalExpenses, incomePercentChange, expensePercentChange } = calculateSummary();

  const chartData = useMemo(() => {
    const dateGroups: Record<string, { date: string, income: number, expenses: number }> = {};
    
    const getDateFormat = (date: Date) => {
      switch(timePeriod) {
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

  // Get recent transactions for the table
  const recentTransactions = filteredTransactions.slice(0, 5);

  const handleQuickFilterChange = (days: number) => {
    const today = new Date();
    const start = startOfDay(subDays(today, days));
    setDateRange({
      startDate: start,
      endDate: endOfDay(today)
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="h-12 w-12 rounded-full border-4 border-t-green-500 border-gray-300 animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Greeting Section - Centered */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.email?.split('@')[0] || 'there'} 👋
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Here's your financial overview for today. Track your spending, monitor your income, and stay on top of your financial goals.
            </p>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Total Money */}
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Total money</h3>
                  <p className="text-5xl font-bold text-gray-900 mb-3">${totalMoney.toLocaleString()}</p>
                  <div className="flex items-center">
                    <TrendingUp className="h-6 w-6 text-green-500 mr-3" />
                    <span className="text-xl text-green-500 font-semibold">10%</span>
                    <span className="text-base text-gray-500 ml-3">vs last month</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* This Month's Income */}
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">This period's income</h3>
                  <p className="text-5xl font-bold text-gray-900 mb-3">${totalIncome.toLocaleString()}</p>
                  <div className="flex items-center">
                    <TrendingUp className="h-6 w-6 text-green-500 mr-3" />
                    <span className="text-xl text-green-500 font-semibold">{incomePercentChange}%</span>
                    <span className="text-base text-gray-500 ml-3">vs last period</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expenses This Month */}
          <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Expenses this period</h3>
                  <p className="text-5xl font-bold text-gray-900 mb-3">${totalExpenses.toLocaleString()}</p>
                  <div className="flex items-center">
                    <TrendingUp className="h-6 w-6 text-red-500 mr-3" />
                    <span className="text-xl text-red-500 font-semibold">{expensePercentChange}%</span>
                    <span className="text-base text-gray-500 ml-3">vs last period</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Money Analytics with Working Time Controls */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Money Analytics</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-500"
                onClick={() => window.location.href = '/analytics'}
              >
                View report
              </Button>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-6">
                {(['monthly', 'weekly', 'daily'] as TimePeriod[]).map((period) => (
                  <button
                    key={period}
                    onClick={() => handleTimePeriodChange(period)}
                    className={`text-sm px-3 py-1 rounded-md transition-colors ${
                      timePeriod === period 
                        ? 'bg-green-100 text-green-800 font-medium' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {period === 'monthly' ? '12 months' : period === 'weekly' ? '3 months' : '30 days'}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-400">|</span>
                <button
                  onClick={() => handleQuickFilterChange(7)}
                  className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                >
                  7 days
                </button>
                <button
                  onClick={() => handleQuickFilterChange(1)}
                  className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                >
                  24 hours
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="h-[300px]">
              <TransactionsChart 
                data={chartData} 
                type="area" 
                height={300}
                timePeriod={timePeriod}
                showNet={false}
              />
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">Transaction History</CardTitle>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500"
                  onClick={() => {
                    const today = new Date();
                    const weekAgo = subDays(today, 7);
                    setDateRange({
                      startDate: startOfDay(weekAgo),
                      endDate: endOfDay(today)
                    });
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Last 7 days
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500"
                  onClick={() => window.location.href = '/transactions'}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  View all
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Transaction</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Account</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction, index) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            transaction.category === 'Spotify' ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            {transaction.category === 'Spotify' ? (
                              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                            ) : (
                              <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
                            )}
                          </div>
                          <span className="font-medium text-gray-900">
                            {transaction.description || transaction.category || 'Transaction'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        #{(transaction.id as string).slice(-6) || `A${2132 + index}`}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-semibold ${
                          transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {format(new Date(transaction.date), 'EEE h:mma')}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {transaction.channel || 'Visa 1234'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Create Transaction Modal */}
        <CreateTransactionModal
          isOpen={showCreateTransaction}
          onClose={() => setShowCreateTransaction(false)}
        />
      </div>
    </Layout>
  );
};

export default Index;
