import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction
} from '@/services/transactionService';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@/types';
import { useAuth } from './AuthContext';
import { useAccounts } from './AccountContext';

export interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  error: Error | null;
  isLoading: boolean; // Alias for loading for backward compatibility
  fetchAllTransactions: () => Promise<void>;
  addNewTransaction: (transaction: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">) => Promise<Transaction>;
  updateExistingTransaction: (id: string, transaction: Partial<Transaction>) => Promise<Transaction>;
  deleteExistingTransaction: (id: string) => Promise<boolean>;
  removeTransaction: (id: string) => Promise<boolean>; // Alias for deleteExistingTransaction
  getRecentTransactions: (limit?: number) => Transaction[];
  getTransactionsByType: (type: 'income' | 'expense') => Transaction[];
  getTransactionById: (id: string) => Transaction | undefined;
  getMonthlyTotals: () => { income: number; expense: number };
  getTransactionsSummary: () => { 
    incomePercentChange: number; 
    expensePercentChange: number;
    remainingPercentChange: number;
  };
  getTransactionsByPeriod: () => any; // Placeholder for backward compatibility
  setCategoryRefreshCallback: (callback: () => Promise<void>) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [categoryRefreshCallback, setCategoryRefreshCallbackState] = useState<(() => Promise<void>) | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { accounts, refreshAccounts } = useAccounts();

  // Wrapper function to safely set the callback
  const setCategoryRefreshCallback = (callback: (() => Promise<void>) | null) => {
    setCategoryRefreshCallbackState(callback);
  };

  const fetchAllTransactions = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await getTransactions();
      
      const processedData = data.map(item => ({
        ...item,
        type: item.type as "income" | "expense",
        date: item.transaction_date,
        channel: item.account_name,
        status: item.status || 'Success'
      }));
      
      setTransactions(processedData);
      setError(null);
      console.log("Fetched transactions:", processedData.length);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const addNewTransaction = async (transaction: Omit<Transaction, "id" | "user_id" | "created_at" | "updated_at">) => {
    try {
      console.log('Adding new transaction:', transaction);

      // Ensure all required fields are present
      if (!transaction.amount || !transaction.type) {
        throw new Error('Amount and type are required fields');
      }

      const result = await createTransaction({
        transaction_date: transaction.transaction_date || transaction.date || new Date().toISOString(),
        type: transaction.type,
        description: transaction.description || '',
        amount: transaction.amount,
        category: transaction.category || null,
        category_id: transaction.category_id || null,
        account_name: transaction.account_name || transaction.channel || ''
      });
      
      console.log('Transaction created, processing result:', result);
      
      const processedResult: Transaction = {
        ...result,
        date: result.transaction_date,
        channel: result.account_name,
        type: result.type as "income" | "expense",
        status: result.status || 'Success'
      };
      
      setTransactions(prev => [processedResult, ...prev]);
      
      await refreshAccounts();
      
      // Refresh categories if callback is set
      if (categoryRefreshCallback && typeof categoryRefreshCallback === 'function') {
        try {
          await categoryRefreshCallback();
        } catch (error) {
          console.warn('Error refreshing categories:', error);
        }
      }
      
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
      
      return processedResult;
    } catch (err) {
      console.error('Error adding transaction:', err);
      
      // Provide more specific error messages
      let errorMessage = "Failed to add transaction";
      if (err instanceof Error) {
        if (err.message.includes('amount')) {
          errorMessage = "Please enter a valid amount";
        } else if (err.message.includes('type')) {
          errorMessage = "Please select a transaction type";
        } else if (err.message.includes('authenticated')) {
          errorMessage = "Please sign in to add transactions";
        } else if (err.message.includes('duplicate')) {
          errorMessage = "This transaction already exists";
        } else {
          errorMessage = err.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateExistingTransaction = async (id: string, transaction: Partial<Transaction>) => {
    try {
      const updated = await updateTransaction(id, {
        transaction_date: transaction.transaction_date || transaction.date,
        type: transaction.type,
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
        account_name: transaction.account_name || transaction.channel
      });
      
      const processedResult: Transaction = {
        ...updated,
        date: updated.transaction_date,
        channel: updated.account_name,
        type: updated.type as "income" | "expense",
        status: updated.status || 'Success'
      };
      
      setTransactions(prev => 
        prev.map(item => item.id === id ? processedResult : item)
      );
      
      await refreshAccounts();
      
      // Refresh categories if callback is set
      if (categoryRefreshCallback && typeof categoryRefreshCallback === 'function') {
        try {
          await categoryRefreshCallback();
        } catch (error) {
          console.warn('Error refreshing categories:', error);
        }
      }
      
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
      
      return processedResult;
    } catch (err) {
      console.error('Error updating transaction:', err);
      toast({
        title: "Error",
        description: "Failed to update transaction",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteExistingTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      setTransactions(prev => prev.filter(item => item.id !== id));
      
      await refreshAccounts();
      
      // Refresh categories if callback is set
      if (categoryRefreshCallback && typeof categoryRefreshCallback === 'function') {
        try {
          await categoryRefreshCallback();
        } catch (error) {
          console.warn('Error refreshing categories:', error);
        }
      }
      
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
      return true;
    } catch (err) {
      console.error('Error deleting transaction:', err);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      });
      return false;
    }
  };

  const removeTransaction = deleteExistingTransaction;

  const getRecentTransactions = (limit = 5) => {
    return [...transactions]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  };

  const getTransactionsByType = (type: 'income' | 'expense') => {
    return transactions.filter(item => item.type === type);
  };

  const getTransactionById = (id: string) => {
    return transactions.find(item => item.id === id);
  };

  const getMonthlyTotals = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.transaction_date);
      return transactionDate >= firstDay;
    });
    
    return monthlyTransactions.reduce((acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else if (transaction.type === 'expense') {
        acc.expense += transaction.amount;
      }
      return acc;
    }, { income: 0, expense: 0 });
  };

  const getTransactionsSummary = () => {
    return { 
      incomePercentChange: 5, 
      expensePercentChange: 3,
      remainingPercentChange: 7
    };
  };

  const getTransactionsByPeriod = () => {
    return transactions;
  };

  useEffect(() => {
    if (user) {
      fetchAllTransactions();
    }
  }, [user]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        isLoading: loading,
        error,
        fetchAllTransactions,
        addNewTransaction,
        updateExistingTransaction,
        deleteExistingTransaction,
        removeTransaction,
        getRecentTransactions,
        getTransactionsByType,
        getTransactionById,
        getMonthlyTotals,
        getTransactionsSummary,
        getTransactionsByPeriod,
        setCategoryRefreshCallback
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
