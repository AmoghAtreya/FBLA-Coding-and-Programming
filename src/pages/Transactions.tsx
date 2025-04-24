import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Search, Filter, Plus, ArrowUpCircle, ArrowDownCircle, X, Calendar, List, FileText } from 'lucide-react';
import TransactionsTable from '@/components/TransactionsTable';
import TransactionCalendarView from '@/components/TransactionCalendarView';
import AddTransactionForm from '@/components/AddTransactionForm';
import TransactionReport from '@/components/TransactionReport';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Badge,
} from '@/components/ui/badge';
import { useTransactions } from '@/context/TransactionContext';
import { useAccounts } from '@/context/AccountContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { motion } from 'framer-motion';
import { Transaction } from '@/types';

type ViewMode = 'list' | 'calendar' | 'report';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const Transactions = () => {
  const { transactions, loading: isLoading, addNewTransaction } = useTransactions();
  const { accounts } = useAccounts();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSheet, setActiveSheet] = useState<'income' | 'expense' | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filters, setFilters] = useState<{
    type: string[];
    category: string[];
    amount: { min: number | null; max: number | null };
    date: { start: Date | null; end: Date | null };
  }>({
    type: [],
    category: [],
    amount: { min: null, max: null },
    date: { start: null, end: null },
  });

  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    transactions.forEach(transaction => {
      if (transaction.category) {
        uniqueCategories.add(transaction.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = 
        searchQuery === '' || 
        transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = 
        filters.type.length === 0 ||
        filters.type.includes(transaction.type || '');
      
      const matchesCategory = 
        filters.category.length === 0 ||
        filters.category.includes(transaction.category || '');
      
      const matchesAmount = 
        (!filters.amount.min || Math.abs(transaction.amount) >= filters.amount.min) &&
        (!filters.amount.max || Math.abs(transaction.amount) <= filters.amount.max);
      
      const matchesDate = 
        (!filters.date.start || new Date(transaction.transaction_date || transaction.date || '') >= filters.date.start) &&
        (!filters.date.end || new Date(transaction.transaction_date || transaction.date || '') <= filters.date.end);
      
      return matchesSearch && matchesType && matchesCategory && matchesAmount && matchesDate;
    });
  }, [transactions, searchQuery, filters]);

  const handleAddTransaction = (newTransaction: {
    transaction_date: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    account_name: string;
  }) => {
    addNewTransaction({
      transaction_date: newTransaction.transaction_date,
      type: newTransaction.type,
      amount: newTransaction.amount,
      category: newTransaction.category,
      description: newTransaction.description,
      account_name: newTransaction.account_name,
      status: 'Success',
    });
    setActiveSheet(null);
  };

  const toggleFilter = (type: 'type' | 'category', value: string) => {
    setFilters(prev => {
      const currentValues = [...prev[type]];
      const valueIndex = currentValues.indexOf(value);
      
      if (valueIndex === -1) {
        currentValues.push(value);
      } else {
        currentValues.splice(valueIndex, 1);
      }
      
      return { ...prev, [type]: currentValues };
    });
  };

  const clearFilters = () => {
    setFilters({
      type: [],
      category: [],
      amount: { min: null, max: null },
      date: { start: null, end: null },
    });
  };

  const getDefaultCategory = (type: 'income' | 'expense') => {
    if (type === 'income') {
      return 'Income';
    } else {
      return 'Other';
    }
  };

  const hasActiveFilters = filters.type.length > 0 || 
                          filters.category.length > 0 || 
                          filters.amount.min !== null || 
                          filters.amount.max !== null ||
                          filters.date.start !== null ||
                          filters.date.end !== null;

  return (
    <Layout>
      <div className="h-full flex flex-col">
        <motion.div 
          className="mb-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-2xl font-bold text-gray-800 text-left"
          >
            Transaction History
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-gray-500 text-left"
          >
            Manage and analyze your financial activities
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap justify-between items-center gap-4 mb-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                className="pl-10 w-64 bg-white transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`bg-white transition-colors duration-300 ${hasActiveFilters ? 'text-blue-600 border-blue-600' : ''}`}
                >
                  <Filter size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filters</h4>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs">
                        Clear all
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-2">Transaction Type</h5>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant={filters.type.includes('income') ? 'default' : 'outline'}
                        className="cursor-pointer transition-colors duration-200"
                        onClick={() => toggleFilter('type', 'income')}
                      >
                        Income
                      </Badge>
                      <Badge
                        variant={filters.type.includes('expense') ? 'default' : 'outline'}
                        className="cursor-pointer transition-colors duration-200"
                        onClick={() => toggleFilter('type', 'expense')}
                      >
                        Expense
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-2">Categories</h5>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <Badge
                          key={category}
                          variant={filters.category.includes(category) ? 'default' : 'outline'}
                          className="cursor-pointer transition-colors duration-200"
                          onClick={() => toggleFilter('category', category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-2">Amount Range</h5>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number"
                        placeholder="Min"
                        className="w-full"
                        value={filters.amount.min ?? ''}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          amount: { ...prev.amount, min: e.target.value ? parseFloat(e.target.value) : null }
                        }))}
                      />
                      <span>to</span>
                      <Input 
                        type="number"
                        placeholder="Max"
                        className="w-full"
                        value={filters.amount.max ?? ''}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          amount: { ...prev.amount, max: e.target.value ? parseFloat(e.target.value) : null }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {filters.type.map(type => (
                  <motion.div
                    key={type}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                      <X 
                        size={14} 
                        className="cursor-pointer" 
                        onClick={() => toggleFilter('type', type)} 
                      />
                    </Badge>
                  </motion.div>
                ))}
                {filters.category.map(category => (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1">
                      {category}
                      <X 
                        size={14} 
                        className="cursor-pointer" 
                        onClick={() => toggleFilter('category', category)} 
                      />
                    </Badge>
                  </motion.div>
                ))}
                {(filters.amount.min !== null || filters.amount.max !== null) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Amount: {filters.amount.min || 0} - {filters.amount.max || '∞'}
                      <X 
                        size={14} 
                        className="cursor-pointer" 
                        onClick={() => setFilters(prev => ({ ...prev, amount: { min: null, max: null } }))} 
                      />
                    </Badge>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
          
          <motion.div 
            variants={itemVariants} 
            className="flex items-center gap-4"
          >
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value: string) => setViewMode(value as ViewMode)}
              className="border bg-white rounded-md"
            >
              <ToggleGroupItem 
                value="list" 
                aria-label="List View"
                className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
              >
                <List size={18} />
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="calendar" 
                aria-label="Calendar View"
                className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
              >
                <Calendar size={18} />
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="report" 
                aria-label="Report View"
                className="data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
              >
                <FileText size={18} />
              </ToggleGroupItem>
            </ToggleGroup>
            
            <div className="flex gap-2">
              <Sheet open={activeSheet === 'income'} onOpenChange={(open) => setActiveSheet(open ? 'income' : null)}>
                <SheetTrigger asChild>
                  <Button 
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all duration-200"
                  >
                    <ArrowUpCircle size={16} />
                    <span>New Income</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Add New Income</SheetTitle>
                    <SheetDescription>
                      Enter the details for your new income transaction.
                    </SheetDescription>
                  </SheetHeader>
                  <AddTransactionForm 
                    onTransactionAdd={handleAddTransaction} 
                    defaultType="income"
                    hideTypeSelection={true}
                  />
                </SheetContent>
              </Sheet>

              <Sheet open={activeSheet === 'expense'} onOpenChange={(open) => setActiveSheet(open ? 'expense' : null)}>
                <SheetTrigger asChild>
                  <Button 
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transform hover:scale-105 transition-all duration-200"
                  >
                    <ArrowDownCircle size={16} />
                    <span>New Expense</span>
                  </Button>
                </SheetTrigger>
                <SheetContent className="sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>Add New Expense</SheetTitle>
                    <SheetDescription>
                      Enter the details for your new expense transaction.
                    </SheetDescription>
                  </SheetHeader>
                  <AddTransactionForm 
                    onTransactionAdd={handleAddTransaction}
                    defaultType="expense"
                    hideTypeSelection={true}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </motion.div>
        </motion.div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-12 w-12 rounded-full border-4 border-t-blue-600 border-gray-200 animate-spin"></div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 overflow-hidden"
            >
              {viewMode === 'list' ? (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden transition-shadow hover:shadow-md h-full">
                  <div className="p-4 border-b">
                    <h2 className="font-medium text-gray-800 text-left">All Transactions</h2>
                  </div>
                  <div className="h-[calc(100vh-270px)]">
                    <TransactionsTable 
                      transactions={filteredTransactions.map(t => ({
                        ...t,
                        status: t.status || 'Success'
                      }))} 
                    />
                  </div>
                </div>
              ) : viewMode === 'calendar' ? (
                <TransactionCalendarView 
                  transactions={filteredTransactions.map(t => ({
                    ...t,
                    status: t.status || 'Success'
                  }))} 
                />
              ) : (
                <div className="bg-white rounded-xl shadow-sm border overflow-y-auto transition-shadow hover:shadow-md h-full p-6">
                  <TransactionReport />
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Transactions;
