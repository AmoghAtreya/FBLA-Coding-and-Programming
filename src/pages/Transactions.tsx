/**
 * Transactions Page
 * 
 * Professional transaction management interface with:
 * - Summary statistics cards
 * - Modern controls with search/filters
 * - Clean table layout
 * - Professional card-based design
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import TransactionsChart from '@/components/TransactionsChart';
import DateRangeSelector, { DateRangePreset } from '@/components/DateRangeSelector';
import AccountSelector from '@/components/AccountSelector';
import { useTransactions } from '@/context/TransactionContext';
import { useAccounts } from '@/context/AccountContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  ArrowUpDown,
  DollarSign
} from 'lucide-react';
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

const Transactions = () => {
  const { transactions, loading: transactionsLoading, fetchAllTransactions } = useTransactions();
  const { accounts } = useAccounts();
  
  const [dateRange, setDateRange] = useState({
    startDate: startOfDay(subDays(new Date(), 30)),
    endDate: endOfDay(new Date())
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('All accounts');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCreateTransaction, setShowCreateTransaction] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const accountNames = ['All accounts', ...accounts.map(acc => acc.name)];
  
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
        
      const matchesSearch = searchTerm === '' || 
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category?.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCategory = selectedCategory === 'All categories' ||
        transaction.category === selectedCategory;
        
      return isInDateRange && isInAccount && matchesSearch && matchesCategory;
    });
  }, [transactions, dateRange, selectedAccount, searchTerm, selectedCategory]);

  const calculateSummary = () => {
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalTransactions = filteredTransactions.length;

    filteredTransactions.forEach(transaction => {
      if (transaction.amount >= 0) {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += Math.abs(transaction.amount);
      }
    });

    const netAmount = totalIncome - totalExpenses;
    
    return {
      totalTransactions,
      totalIncome,
      totalExpenses,
      netAmount
    };
  };

  const { totalTransactions, totalIncome, totalExpenses, netAmount } = calculateSummary();

  const handleDateRangeChange = (startDate: Date, endDate: Date) => {
    setDateRange({ 
      startDate: startOfDay(startDate), 
      endDate: endOfDay(endDate) 
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
  };

  const chartData = useMemo(() => {
    const dateGroups: Record<string, { date: string, income: number, expenses: number }> = {};
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
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

  if (transactionsLoading) {
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
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-500 mt-1">Manage and track all your financial transactions</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Income</p>
                  <p className="text-2xl font-bold text-gray-900">${totalIncome.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-500">+12%</span>
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
                  <p className="text-2xl font-bold text-gray-900">${totalExpenses.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-xs text-red-500">+8%</span>
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
                  <p className="text-sm font-medium text-gray-500 mb-1">Net Amount</p>
                  <p className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${Math.abs(netAmount).toLocaleString()}
                  </p>
                  <div className="flex items-center mt-1">
                    {netAmount >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-xs ${netAmount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {netAmount >= 0 ? 'Profit' : 'Loss'}
                    </span>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  netAmount >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <DollarSign className={`h-5 w-5 ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <Card className="bg-white border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search transactions by description, category, or amount..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Categories</option>
                  {Array.from(new Set(transactions.map(t => t.category).filter(Boolean))).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Accounts</option>
                  {accountNames.map(account => (
                    <option key={account} value={account}>{account}</option>
                  ))}
                </select>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All categories');
                    setSelectedAccount('All accounts');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900">Transaction Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <TransactionsChart data={chartData} type="area" />
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="bg-white border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-gray-900">Transaction History</CardTitle>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500"
                  onClick={() => {
                    const startDate = dateRange.startDate.toISOString().split('T')[0];
                    const endDate = dateRange.endDate.toISOString().split('T')[0];
                    setDateRange({
                      startDate: new Date(startDate),
                      endDate: new Date(endDate)
                    });
                  }}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Select dates
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-500"
                  onClick={() => {
                    const csvContent = 'Date,Description,Amount,Category,Account\n' + 
                      filteredTransactions.map(t => 
                        `${format(new Date(t.date), 'yyyy-MM-dd')},"${t.description || t.category}",${t.amount},"${t.category}","${t.channel}"`
                      ).join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
                    a.click();
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    // Open transaction creation modal
                    setShowCreateTransaction(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Description</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Account</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <motion.tr 
                      key={transaction.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            transaction.amount >= 0 ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            {transaction.amount >= 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {transaction.description || 'No description'}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {(transaction.id as string).slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                          {transaction.category || 'Uncategorized'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-bold ${
                          transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount >= 0 ? '+' : '-'}
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {format(new Date(transaction.date), 'MMM d, yyyy')}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {transaction.channel || 'Unknown'}
                      </td>
                      <td className="py-4 px-4">
                        <Badge className="bg-green-100 text-green-700 border-0">
                          Completed
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Transactions;
