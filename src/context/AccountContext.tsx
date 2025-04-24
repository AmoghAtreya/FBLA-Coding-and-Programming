
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Account, fetchAccounts, addAccount, deleteAccount as deleteAccountService } from '@/services/accountService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

export interface AccountContextType {
  accounts: Account[];
  selectedAccount: Account | null;
  setSelectedAccount: (account: Account | null) => void;
  isLoading: boolean;
  refreshAccounts: () => Promise<void>;
  addNewAccount: (account: Omit<Account, 'id' | 'user_id' | 'created_at'>) => Promise<Account>;
  deleteAccount: (id: string) => Promise<void>;
  getTotalBalance: () => number;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const refreshAccounts = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const data = await fetchAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast({
        title: "Error",
        description: "Failed to load accounts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNewAccount = async (account: Omit<Account, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const newAccount = await addAccount(account);
      setAccounts([...accounts, newAccount]);
      toast({
        title: "Success",
        description: "Account added successfully",
      });
      return newAccount;
    } catch (error) {
      console.error('Error adding account:', error);
      toast({
        title: "Error",
        description: "Failed to add account",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      await deleteAccountService(id);
      setAccounts(accounts.filter(account => account.id !== id));
      if (selectedAccount && selectedAccount.id === id) {
        setSelectedAccount(null);
      }
      toast({
        title: "Success",
        description: "Account deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getTotalBalance = () => {
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  useEffect(() => {
    if (user) {
      refreshAccounts();
    }
  }, [user]);

  return (
    <AccountContext.Provider
      value={{
        accounts,
        selectedAccount,
        setSelectedAccount,
        isLoading,
        refreshAccounts,
        addNewAccount,
        deleteAccount,
        getTotalBalance,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccounts = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccounts must be used within an AccountProvider');
  }
  return context;
};
