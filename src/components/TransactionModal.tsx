import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransactions } from '@/context/TransactionContext';
import { Transaction } from '@/types';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  mode: 'view' | 'edit';
}

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
}

interface FormData {
  description?: string;
  amount?: string; // Keep as string for form handling
  type?: 'income' | 'expense';
  category?: string;
  account_name?: string;
  channel?: string;
  transaction_date?: string;
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

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, transaction, mode }) => {
  const { updateExistingTransaction, removeTransaction } = useTransactions();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description || '',
        amount: Math.abs(transaction.amount).toString(),
        type: transaction.type || 'expense',
        category: transaction.category || '',
        account_name: transaction.account_name || '',
        channel: transaction.channel || '',
        transaction_date: transaction.transaction_date || transaction.date || '',
      });
    }
  }, [transaction]);

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
    if (!transaction || !formData.description || !formData.amount) {
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

      if (formData.category && !existingCategory) {
        try {
          const { data: newCategoryData } = await supabase
            .from('categories')
            .insert({
              name: formData.category,
              type: formData.type || 'expense',
              color: (formData.type || 'expense') === 'income' ? '#22c55e' : '#f97316',
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

      await updateExistingTransaction(transaction.id, { 
        ...formData,
        amount,
        category_id: categoryId,
      });
      toast({
        title: "Success",
        description: "Transaction updated successfully.",
      });
      onClose();
    } catch (error) {
      console.error('Failed to update transaction:', error);
      toast({
        title: "Error",
        description: "Failed to update transaction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!transaction) return;

    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setIsSubmitting(true);
      try {
        await removeTransaction(transaction.id);
        toast({
          title: "Success",
          description: "Transaction deleted successfully.",
        });
        onClose();
      } catch (error) {
        console.error('Failed to delete transaction:', error);
        toast({
          title: "Error",
          description: "Failed to delete transaction. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!transaction) return null;

  const isViewOnly = mode === 'view';

  // Filter categories by the selected transaction type
  const filteredCategories = categories.filter(cat => cat.type === (formData.type || 'expense'));
  
  // Combine existing categories with suggested categories, removing duplicates
  const allCategoryOptions = React.useMemo(() => {
    const currentType = (formData.type || 'expense') as keyof typeof suggestedCategories;
    const existingNames = filteredCategories.map(cat => cat.name);
    const suggested = suggestedCategories[currentType].filter(name => !existingNames.includes(name));
    return { existing: filteredCategories, suggested };
  }, [filteredCategories, formData.type]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => isSubmitting && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{mode === 'view' ? 'Transaction Details' : 'Edit Transaction'}</DialogTitle>
          <DialogDescription>
            {mode === 'view' 
              ? 'View the details of this transaction.' 
              : 'Make changes to your transaction here.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description"
              value={formData.description || ''} 
              onChange={(e) => handleChange('description', e.target.value)}
              disabled={mode === 'view' || isSubmitting}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
                  className="pl-7"
                  value={formData.amount || ''} 
                  onChange={(e) => handleChange('amount', e.target.value)}
                  disabled={mode === 'view' || isSubmitting}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={formData.type || 'expense'} 
                onValueChange={(value: 'income' | 'expense') => handleChange('type', value)}
                disabled={mode === 'view' || isSubmitting}
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
            <Label htmlFor="category">Category</Label>
            {isViewOnly ? (
              <div className="bg-gray-50 p-2 rounded border">
                {formData.category || 'No category'}
              </div>
            ) : (
              <>
                <Select 
                  value={formData.category || ''} 
                  onValueChange={(value) => handleChange('category', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder={`Select ${formData.type || 'expense'} category`} />
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
                                style={{ backgroundColor: (formData.type || 'expense') === 'income' ? '#22c55e' : '#f97316' }}
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
                            style={{ backgroundColor: (formData.type || 'expense') === 'income' ? '#22c55e' : '#f97316' }}
                          />
                          <span>{(formData.type || 'expense') === 'income' ? 'Other Income' : 'Other'}</span>
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
              </>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="account">Account</Label>
            {isViewOnly ? (
              <div className="bg-gray-50 p-2 rounded border">
                {formData.account_name || formData.channel || 'No account'}
              </div>
            ) : (
              <Select 
                value={formData.account_name || formData.channel || ''} 
                onValueChange={(value) => handleChange('account_name', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="account">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: 'Online', label: 'Online' },
                    { value: 'In Store', label: 'In Store' },
                    { value: 'Bank Transfer', label: 'Bank Transfer' },
                    { value: 'Cash', label: 'Cash' },
                  ].map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          {mode === 'view' && transaction && (
            <div className="space-y-2">
              <Label>Date</Label>
              <div className="bg-gray-50 p-2 rounded border">
                {format(new Date(transaction.transaction_date || transaction.date || ''), 'PPP')}
              </div>
            </div>
          )}
          
          <div className="flex justify-between pt-4">
            {mode !== 'view' && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
            
            <div className="space-x-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {mode === 'view' ? 'Close' : 'Cancel'}
              </Button>
              
              {mode !== 'view' && (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
