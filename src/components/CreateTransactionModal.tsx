import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransactions } from '@/context/TransactionContext';
import { useAccounts } from '@/context/AccountContext';
import { useToast } from '@/hooks/use-toast';

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'income' | 'expense';
}

const CreateTransactionModal: React.FC<CreateTransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultType = 'expense' 
}) => {
  const { addNewTransaction } = useTransactions();
  const { accounts } = useAccounts();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const categories = {
    income: [
      'Salary',
      'Allowance', 
      'Gift',
      'Investment',
      'Business',
      'Other Income'
    ],
    expense: [
      'Food and Drink',
      'Travel',
      'Entertainment',
      'Shopping',
      'Bills',
      'Healthcare',
      'Education',
      'Transportation',
      'Other'
    ]
  };

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

      await addNewTransaction({
        description: formData.description,
        amount,
        type: formData.type as 'income' | 'expense',
        category: formData.category,
        account_name: formData.account_name,
        transaction_date: formData.date,
        date: formData.date
      });

      toast({
        title: "Success",
        description: "Transaction created successfully!",
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to create transaction:', error);
      toast({
        title: "Error",
        description: "Failed to create transaction. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => isSubmitting && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create New Transaction</DialogTitle>
          <DialogDescription>
            Add a new {formData.type} transaction to your financial records.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input 
              id="description"
              value={formData.description} 
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="What was this transaction for?"
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
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories[formData.type as keyof typeof categories].map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.name}>
                      {account.name}
                    </SelectItem>
                  ))}
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
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? 'Creating...' : 'Create Transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionModal; 