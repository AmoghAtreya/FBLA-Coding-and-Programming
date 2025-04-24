
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
import { useToast } from '@/components/ui';

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

  // Fetch categories from Supabase
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !category || !accountName) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
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
    
    try {
      onTransactionAdd(newTransaction);
      
      // Reset form
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

  // Filter categories by the selected transaction type
  const filteredCategories = categories.filter(cat => cat.type === type);

  return (
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
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name || "placeholder-value"}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.name || "Unnamed Category"}
                  </div>
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-categories">No categories available</SelectItem>
            )}
          </SelectContent>
        </Select>
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
      
      <div className="pt-4">
        <Button
          type="submit"
          className="w-full bg-finflow-blue hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
        </Button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
