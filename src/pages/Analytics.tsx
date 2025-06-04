/**
 * Analytics Page
 * 
 * Professional financial analytics interface with:
 * - Advanced financial charts and insights
 * - Working time period analysis controls
 * - Category breakdown analytics
 * - Performance metrics
 * - Professional color scheme
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import TransactionsChart from '@/components/TransactionsChart';
import CategoryChart from '@/components/CategoryChart';
import { useTransactions } from '@/context/TransactionContext';
import { useAccounts } from '@/context/AccountContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { startOfDay, endOfDay, subDays, subMonths, format, isWithinInterval } from 'date-fns';

type TimePeriod = '7d' | '30d' | '3m' | '12m' | 'ytd' | 'all';
type ChartType = 'area' | 'line' | 'bar';

const Analytics = () => {
  const { transactions, isLoading } = useTransactions();
  const { getTotalBalance } = useAccounts();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30d');
  const [chartType, setChartType] = useState<ChartType>('area');

  const timeRanges = {
    '7d': { label: '7 Days', days: 7 },
    '30d': { label: '30 Days', days: 30 },
    '3m': { label: '3 Months', days: 90 },
    '12m': { label: '12 Months', days: 365 },
    'ytd': { label: 'Year to Date', days: null },
    'all': { label: 'All Time', days: null }
  };

  const filteredTransactions = useMemo(() => {
    if (timePeriod === 'all') {
      return transactions;
    }
    
    let startDate: Date;
    let endDate = endOfDay(new Date());

    if (timePeriod === 'ytd') {
      startDate = new Date(new Date().getFullYear(), 0, 1);
    } else {
      const days = timeRanges[timePeriod].days;
      if (days) {
        startDate = startOfDay(subDays(new Date(), days));
      } else {
        return transactions;
      }
    }

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.created_at || transaction.date);
      return isWithinInterval(transactionDate, { start: startDate, end: endDate });
    });
  }, [transactions, timePeriod]);

  const chartData = useMemo(() => {
    const dateGroups: Record<string, { date: string, income: number, expenses: number }> = {};
    
    const getDateFormat = (date: Date) => {
      switch(timePeriod) {
        case '7d':
          return format(date, 'MMM d');
        case '30d':
          return format(date, 'MMM d');
        case '3m':
          return format(date, 'MMM d');
        case '12m':
          return format(date, 'MMM yyyy');
        case 'ytd':
          return format(date, 'MMM yyyy');
        case 'all':
          return format(date, 'MMM yyyy');
        default:
          return format(date, 'MMM d');
      }
    };
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.created_at || transaction.date);
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

  const analytics = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;
    let transactionCount = 0;

    filteredTransactions.forEach(transaction => {
      transactionCount++;
      if (transaction.amount >= 0) {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += Math.abs(transaction.amount);
      }
    });

    const netCashFlow = totalIncome - totalExpenses;
    const averageTransaction = transactionCount > 0 ? (totalIncome + totalExpenses) / transactionCount : 0;
    const expenseToIncomeRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      netCashFlow,
      transactionCount,
      averageTransaction,
      expenseToIncomeRatio
    };
  }, [filteredTransactions]);

  const categoryBreakdown = useMemo(() => {
    const categoryMap = new Map<string, { income: number; expenses: number; count: number }>();
    
    filteredTransactions.forEach(transaction => {
      const category = transaction.category || 'Other';
      const existing = categoryMap.get(category) || { income: 0, expenses: 0, count: 0 };
      
      if (transaction.amount >= 0) {
        existing.income += transaction.amount;
      } else {
        existing.expenses += Math.abs(transaction.amount);
      }
      existing.count++;
      
      categoryMap.set(category, existing);
    });

    return Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      ...data,
      total: data.income + data.expenses
    })).sort((a, b) => b.total - a.total);
  }, [filteredTransactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleExportData = () => {
    const csvContent = 'Date,Description,Amount,Category,Type\n' + 
      filteredTransactions.map(t => {
        const date = format(new Date(t.date), 'yyyy-MM-dd');
        const description = (t.description || t.category || 'No description').replace(/"/g, '""');
        const amount = t.amount;
        const category = (t.category || 'Uncategorized').replace(/"/g, '""');
        const type = t.amount >= 0 ? 'Income' : 'Expense';
        return `${date},"${description}",${amount},"${category}","${type}"`;
      }).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timePeriod}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Analytics</h1>
            <p className="text-gray-500 mt-1">Detailed insights into your financial patterns</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Export Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="text-gray-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            
            {/* Time Period Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {Object.entries(timeRanges).map(([key, range]) => (
                <Button
                  key={key}
                  variant={timePeriod === key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimePeriod(key as TimePeriod)}
                  className={timePeriod === key ? "bg-green-600 text-white" : "text-gray-600"}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Net Cash Flow</p>
                  <p className={`text-2xl font-bold ${analytics.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(analytics.netCashFlow)}
                  </p>
                  <div className="flex items-center mt-1">
                    {analytics.netCashFlow >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-xs ${analytics.netCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {analytics.netCashFlow >= 0 ? 'Positive' : 'Negative'}
                    </span>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  analytics.netCashFlow >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {analytics.netCashFlow >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Income</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalIncome)}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+{analytics.transactionCount} transactions</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Expenses</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalExpenses)}</p>
                  <div className="flex items-center mt-1">
                    <Target className="h-3 w-3 text-blue-500 mr-1" />
                    <span className="text-xs text-blue-500">{analytics.expenseToIncomeRatio.toFixed(1)}% of income</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Avg Transaction</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.averageTransaction)}</p>
                  <div className="flex items-center mt-1">
                    <BarChart3 className="h-3 w-3 text-purple-500 mr-1" />
                    <span className="text-xs text-purple-500">{analytics.transactionCount} total</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Main Transaction Chart */}
          <Card className="lg:col-span-2 bg-white border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Transaction Trends - {timeRanges[timePeriod].label}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {(['area', 'line', 'bar'] as ChartType[]).map((type) => (
                    <Button
                      key={type}
                      variant={chartType === type ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setChartType(type)}
                      className={chartType === type ? "bg-gray-900 text-white" : "text-gray-600"}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <TransactionsChart 
                  data={chartData} 
                  type={chartType} 
                  height={400}
                  timePeriod={timePeriod}
                  showNet={true}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Categories */}
          <Card className="lg:col-span-2 bg-white border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Top Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryBreakdown.slice(0, 8).map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3`} 
                           style={{ backgroundColor: `hsl(${index * 45}, 60%, 50%)` }}>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{category.name}</p>
                        <p className="text-sm text-gray-500">{category.count} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(category.total)}</p>
                      <div className="flex space-x-2 text-xs">
                        <span className="text-green-600">+{formatCurrency(category.income)}</span>
                        <span className="text-red-600">-{formatCurrency(category.expenses)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">Largest Income</p>
                    <p className="text-lg font-bold text-green-800">
                      {formatCurrency(Math.max(...filteredTransactions.filter(t => t.amount > 0).map(t => t.amount), 0))}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700">Largest Expense</p>
                    <p className="text-lg font-bold text-red-800">
                      {formatCurrency(Math.max(...filteredTransactions.filter(t => t.amount < 0).map(t => Math.abs(t.amount)), 0))}
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-600" />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">Most Active Category</p>
                    <p className="text-lg font-bold text-blue-800">
                      {categoryBreakdown[0]?.name || 'N/A'}
                    </p>
                    <p className="text-xs text-blue-600">
                      {categoryBreakdown[0]?.count || 0} transactions
                    </p>
                  </div>
                  <PieChart className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-700">Account Balance</p>
                    <p className="text-lg font-bold text-purple-800">
                      {formatCurrency(getTotalBalance())}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics; 