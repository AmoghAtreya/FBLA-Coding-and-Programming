import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTransactions } from '@/context/TransactionContext';
import { useAccounts } from '@/context/AccountContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'income' | 'expense';
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

const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultType = 'expense' 
}) => {
  const { addNewTransaction } = useTransactions();
  const { accounts } = useAccounts();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: defaultType,
    category: '',
    account_name: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        description: '',
        amount: '',
        type: defaultType,
        category: '',
        account_name: accounts.length > 0 ? accounts[0].name : '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [isOpen, defaultType, accounts]);

  // Fetch user's existing categories
  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name, type, color')
          .eq('user_id', user.id)
          .order('name', { ascending: true });

        if (error) throw error;

        if (data) {
          const typedCategories: Category[] = data.map(cat => ({
            ...cat,
            type: cat.type as 'income' | 'expense'
          }));
          setCategories(typedCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [user, isOpen]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.category || !formData.account_name) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const amount = formData.type === 'expense' 
        ? -Math.abs(Number(formData.amount)) 
        : Math.abs(Number(formData.amount));

      // Check if category exists, if not create it
      const existingCategory = categories.find(cat => cat.name === formData.category && cat.type === formData.type);
      let categoryId = existingCategory?.id;

      if (!existingCategory) {
        try {
          const { data: newCategoryData } = await supabase
            .from('categories')
            .insert({
              name: formData.category,
              type: formData.type,
              color: formData.type === 'income' ? '#22c55e' : '#f97316',
              user_id: user.id,
            })
            .select()
            .single();
          
          if (newCategoryData) {
            categoryId = newCategoryData.id;
          }
        } catch (categoryError) {
          console.error('Error creating category:', categoryError);
        }
      }

      await addNewTransaction({
        description: formData.description,
        amount,
        type: formData.type as 'income' | 'expense',
        category: formData.category,
        category_id: categoryId,
        account_name: formData.account_name,
        transaction_date: formData.date,
        date: formData.date
      });

      toast({
        title: "Success",
        description: "Transaction added successfully!",
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter categories by the selected transaction type
  const filteredCategories = categories.filter(cat => cat.type === formData.type);
  
  // Combine existing categories with suggested categories, removing duplicates
  const allCategoryOptions = React.useMemo(() => {
    const existingNames = filteredCategories.map(cat => cat.name);
    const suggested = suggestedCategories[formData.type as keyof typeof suggestedCategories].filter(name => !existingNames.includes(name));
    return { existing: filteredCategories, suggested };
  }, [filteredCategories, formData.type]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Enter the details for your new {formData.type} transaction.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input 
              id="description"
              placeholder="Enter transaction description"
              value={formData.description} 
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <Input 
                  id="amount"
                  type="number" 
                  step="0.01"
                  min="0" 
                  className="pl-7"
                  value={formData.amount} 
                  onChange={(e) => handleChange('amount', e.target.value)}
                  placeholder="0.00"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: 'income' | 'expense') => handleChange('type', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleChange('category', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder={`Select ${formData.type} category`} />
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
                            style={{ backgroundColor: formData.type === 'income' ? '#22c55e' : '#f97316' }}
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
                        style={{ backgroundColor: formData.type === 'income' ? '#22c55e' : '#f97316' }}
                      />
                      <span>{formData.type === 'income' ? 'Other Income' : 'Other'}</span>
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
              {formData.category && !allCategoryOptions.existing.find(cat => cat.name === formData.category) && (
                <span className="text-green-600 font-medium">✓ Will be created</span>
              )}
            </div>
          </div>
          
            <div className="space-y-2">
              <Label htmlFor="account">Account *</Label>
              <Select 
                value={formData.account_name} 
                onValueChange={(value) => handleChange('account_name', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="account">
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
            
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input 
                id="date"
                type="date" 
                value={formData.date} 
                onChange={(e) => handleChange('date', e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
        </form>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
            onClick={handleSubmit} 
              disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
            {isSubmitting ? 'Adding...' : `Add ${formData.type === 'income' ? 'Income' : 'Expense'}`}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionModal; 