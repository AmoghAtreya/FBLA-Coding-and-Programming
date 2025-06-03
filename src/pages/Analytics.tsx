/**
 * Analytics Page
 * 
 * Professional financial analytics interface with:
 * - Advanced financial charts and insights
 * - Time period analysis
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
  Filter
} from 'lucide-react';
import { startOfDay, endOfDay, subDays, subMonths, format, isWithinInterval } from 'date-fns';

type TimePeriod = '7d' | '30d' | '3m' | '12m';

const Analytics = () => {
  const { transactions, isLoading } = useTransactions();
  const { getTotalBalance } = useAccounts();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30d');

  const timeRanges = {
    '7d': { label: '7 Days', days: 7 },
    '30d': { label: '30 Days', days: 30 },
    '3m': { label: '3 Months', days: 90 },
    '12m': { label: '12 Months', days: 365 }
  };

  const filteredTransactions = useMemo(() => {
    const days = timeRanges[timePeriod].days;
    const startDate = startOfDay(subDays(new Date(), days));
    const endDate = endOfDay(new Date());

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.created_at || transaction.date);
      return isWithinInterval(transactionDate, { start: startDate, end: endDate });
    });
  }, [transactions, timePeriod]);

  const chartData = useMemo(() => {
    const dateGroups: Record<string, { date: string, income: number, expenses: number }> = {};
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.created_at || transaction.date);
      const dateStr = format(date, 'MMM d');
      
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
  }, [filteredTransactions]);

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
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.transactionCount}</p>
                  <div className="flex items-center mt-1">
                    <BarChart3 className="h-3 w-3 text-blue-500 mr-1" />
                    <span className="text-xs text-blue-500">Last {timeRanges[timePeriod].label}</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Average Transaction</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.averageTransaction)}</p>
                  <div className="flex items-center mt-1">
                    <Target className="h-3 w-3 text-purple-500 mr-1" />
                    <span className="text-xs text-purple-500">Per transaction</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Expense Ratio</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.expenseToIncomeRatio.toFixed(1)}%</p>
                  <div className="flex items-center mt-1">
                    <PieChart className="h-3 w-3 text-orange-500 mr-1" />
                    <span className="text-xs text-orange-500">Of income</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <PieChart className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income vs Expenses Chart */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <TransactionsChart 
                  data={chartData}
                  type="area"
                />
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="bg-white border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <CategoryChart transactions={filteredTransactions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown Table */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No transaction data available for this period</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Income</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Expenses</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Net</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Transactions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryBreakdown.map((category, index) => (
                      <motion.tr 
                        key={category.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{category.name}</div>
                        </td>
                        <td className="py-4 px-4 text-right text-green-600 font-medium">
                          {formatCurrency(category.income)}
                        </td>
                        <td className="py-4 px-4 text-right text-red-600 font-medium">
                          {formatCurrency(category.expenses)}
                        </td>
                        <td className={`py-4 px-4 text-right font-medium ${
                          (category.income - category.expenses) >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(category.income - category.expenses)}
                        </td>
                        <td className="py-4 px-4 text-right text-gray-600">
                          {category.count}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics; 