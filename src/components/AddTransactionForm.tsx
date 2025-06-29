import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Transaction } from '@/types';
import { useAccounts } from '@/context/AccountContext'; 
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useTransactions } from '@/context/TransactionContext';

interface AddTransactionFormProps {
  onTransactionAdd: (transaction: {
    transaction_date: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    category_id?: string;
    description: string;
    account_name: string;
  }) => void;
  defaultType?: 'income' | 'expense';
  hideTypeSelection?: boolean;
}

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

// Common categories that users might want to use
const suggestedCategories = {
  income: [
    'Salary', 'Part-time Job', 'Freelance', 'Allowance', 'Scholarship', 'Grant', 'Investment', 'Gift', 'Side Hustle', 'Other Income'
  ],
  expense: [
    'Food & Dining', 'Groceries', 'Transportation', 'Gas', 'Rent', 'Utilities', 'Entertainment', 'Shopping', 'Clothing', 'Healthcare', 'Education', 'Books', 'Subscription', 'Phone Bill', 'Internet', 'Insurance', 'Personal Care', 'Gym', 'Travel', 'Coffee', 'Other'
  ]
};

const TransactionConfirmationModal: React.FC<{
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  transaction: any;
}> = ({ open, onConfirm, onCancel, transaction }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-2">Confirm Transaction</h2>
        <p className="mb-4 text-gray-600">This transaction is much higher than your usual {transaction.type}. Please review and confirm.</p>
        <div className="mb-4 border rounded p-3 bg-gray-50">
          <div className="mb-1"><span className="font-semibold">Description:</span> {transaction.description}</div>
          <div className="mb-1"><span className="font-semibold">Amount:</span> ${Math.abs(transaction.amount).toFixed(2)}</div>
          <div className="mb-1"><span className="font-semibold">Type:</span> {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</div>
          <div className="mb-1"><span className="font-semibold">Category:</span> {transaction.category}</div>
          <div className="mb-1"><span className="font-semibold">Account:</span> {transaction.account_name}</div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
};

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ 
  onTransactionAdd,
  defaultType = 'expense',
  hideTypeSelection = false
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>(defaultType);
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [accountName, setAccountName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { accounts } = useAccounts();
  const { user } = useAuth();
  const { toast } = useToast();
  const { transactions } = useTransactions();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<any>(null);

  // Reset category when type changes
  useEffect(() => {
    setCategory('');
    setCategoryId(undefined);
  }, [type]);

  // Set default account if accounts are available and none is selected
  useEffect(() => {
    if (accounts.length > 0 && !accountName) {
      setAccountName(accounts[0].name);
    }
  }, [accounts, accountName]);

  // Fetch categories from Supabase and refresh on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, type, color')
          .eq('user_id', user.id)
          .order('name', { ascending: true });

        if (error) {
          throw error;
        }

        if (data) {
          // Cast the type field to ensure it matches our expected type
          const typedCategories: Category[] = data.map(cat => ({
            ...cat,
            type: cat.type as 'income' | 'expense'
          }));
          setCategories(typedCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive"
        });
      }
    };

    fetchCategories();
  }, [user, toast]);

  const handleCategoryChange = (categoryName: string) => {
    setCategory(categoryName);
    // Find the category ID that matches the selected name
    const selectedCategory = categories.find(cat => cat.name === categoryName);
    setCategoryId(selectedCategory?.id);
  };

  const getAverage = (type: 'income' | 'expense') => {
    const filtered = transactions.filter(t => t.type === type);
    if (filtered.length === 0) return 0;
    return filtered.reduce((sum, t) => sum + Math.abs(t.amount), 0) / filtered.length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !accountName) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    // Calculate final amount based on transaction type
    const finalAmount = type === 'expense' 
      ? -Math.abs(parseFloat(amount)) 
      : Math.abs(parseFloat(amount));
    const newTransaction = {
      description,
      amount: finalAmount,
      type,
      category,
      category_id: categoryId, // Include category ID when available
      account_name: accountName,
      transaction_date: new Date().toISOString(),
    };
    // Check if amount is way above average
    const avg = getAverage(type);
    if (avg > 0 && Math.abs(finalAmount) > avg * 2) {
      setPendingTransaction(newTransaction);
      setShowConfirmation(true);
      return;
    }
    // Otherwise, proceed as normal
    setIsLoading(true);
    try {
      // Check if category exists, if not create it
      const existingCategory = categories.find(cat => cat.name === category && cat.type === type);
      if (!existingCategory) {
        try {
          const { data: newCategoryData } = await supabase
            .from('categories')
            .insert({
              name: category,
              type: type,
              color: type === 'income' ? '#22c55e' : '#f97316',
              user_id: user.id,
            })
            .select()
            .single();

          // Update the category ID for the transaction
          if (newCategoryData) {
            newTransaction.category_id = newCategoryData.id;
          }
        } catch (categoryError) {
          console.error('Error creating category:', categoryError);
        }
      } else {
        newTransaction.category_id = existingCategory.id;
      }

      onTransactionAdd(newTransaction);
      setDescription('');
      setAmount('');
      setCategory('');
      setCategoryId(undefined);
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Error adding transaction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    setShowConfirmation(false);
    setIsLoading(true);
    try {
      // Check if category exists, if not create it
      const existingCategory = categories.find(cat => cat.name === pendingTransaction.category && cat.type === pendingTransaction.type);
      if (!existingCategory) {
        try {
          const { data: newCategoryData } = await supabase
            .from('categories')
            .insert({
              name: pendingTransaction.category,
              type: pendingTransaction.type,
              color: pendingTransaction.type === 'income' ? '#22c55e' : '#f97316',
              user_id: user.id,
            })
            .select()
            .single();

          // Update the category ID for the transaction
          if (newCategoryData) {
            pendingTransaction.category_id = newCategoryData.id;
          }
        } catch (categoryError) {
          console.error('Error creating category:', categoryError);
        }
      } else {
        pendingTransaction.category_id = existingCategory.id;
      }

      onTransactionAdd(pendingTransaction);
      setDescription('');
      setAmount('');
      setCategory('');
      setCategoryId(undefined);
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Error adding transaction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setPendingTransaction(null);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPendingTransaction(null);
  };

  // Filter categories by the selected transaction type
  const filteredCategories = categories.filter(cat => cat.type === type);
  
  // Combine existing categories with suggested categories, removing duplicates
  const allCategoryOptions = React.useMemo(() => {
    const existingNames = filteredCategories.map(cat => cat.name);
    const suggested = suggestedCategories[type].filter(name => !existingNames.includes(name));
    return { existing: filteredCategories, suggested };
  }, [filteredCategories, type]);

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Transaction description"
            required
            className="transition-all duration-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              className="pl-7 transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
        </div>
        
        {!hideTypeSelection && (
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={(value: 'income' | 'expense') => setType(value)}>
              <SelectTrigger id="type" className="transition-all duration-300">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category" className="transition-all duration-300">
              <SelectValue placeholder={`Select ${type} category`} />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {/* Show existing categories from database first */}
              {allCategoryOptions.existing.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b">
                    💼 Your Categories
                  </div>
                  {allCategoryOptions.existing.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name} className="py-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0 ring-1 ring-gray-200" 
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-medium">{cat.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                  {allCategoryOptions.suggested.length > 0 && (
                    <div className="border-t my-1" />
                  )}
                </>
              )}
              
              {/* Show suggested categories */}
              {allCategoryOptions.suggested.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-blue-50 border-b">
                    ✨ Suggested Categories
                  </div>
                  {allCategoryOptions.suggested.map((categoryName) => (
                    <SelectItem key={categoryName} value={categoryName} className="py-2">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0 ring-1 ring-gray-200" 
                          style={{ backgroundColor: type === 'income' ? '#22c55e' : '#f97316' }}
                        />
                        <span>{categoryName}</span>
                        <span className="ml-auto text-xs text-gray-400">New</span>
                      </div>
                    </SelectItem>
                  ))}
                </>
              )}
              
              {/* Fallback if no categories */}
              {allCategoryOptions.existing.length === 0 && allCategoryOptions.suggested.length === 0 && (
                <SelectItem value="Other" className="py-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0 ring-1 ring-gray-200" 
                      style={{ backgroundColor: type === 'income' ? '#22c55e' : '#f97316' }}
                    />
                    <span>{type === 'income' ? 'Other Income' : 'Other'}</span>
                  </div>
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          
          {/* Helper text */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {allCategoryOptions.existing.length > 0 
                ? `${allCategoryOptions.existing.length} existing • ${allCategoryOptions.suggested.length} suggested`
                : 'Categories are created automatically'
              }
            </span>
            {category && !allCategoryOptions.existing.find(cat => cat.name === category) && (
              <span className="text-green-600 font-medium">✓ Will be created</span>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="account">Account</Label>
          <Select value={accountName} onValueChange={setAccountName}>
            <SelectTrigger id="account" className="transition-all duration-300">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.length > 0 ? (
                accounts.map((account) => (
                  <SelectItem key={account.id} value={account.name || "default-account"}>
                    {account.name || "Unnamed Account"}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-accounts">No accounts available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? 'Adding Transaction...' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
        </Button>
      </form>

      <TransactionConfirmationModal 
        open={showConfirmation}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        transaction={pendingTransaction}
      />
    </>
  );
};

export default AddTransactionForm;
