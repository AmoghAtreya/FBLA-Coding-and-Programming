
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

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  mode: 'view' | 'edit';
}

const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose, transaction, mode }) => {
  const { updateExistingTransaction, removeTransaction } = useTransactions();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Transaction>>({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        amount: Math.abs(transaction.amount),
        type: transaction.type || (transaction.amount >= 0 ? 'income' : 'expense'),
      });
    }
  }, [transaction]);

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

      await updateExistingTransaction(transaction.id, { 
        ...formData,
        amount,
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

  const categories = formData.type === 'income' 
    ? [
        { value: 'Income', label: 'Income' },
        { value: 'Salary', label: 'Salary' },
        { value: 'Allowance', label: 'Allowance' },
        { value: 'Gift', label: 'Gift' },
        { value: 'Other', label: 'Other' },
      ] 
    : [
        { value: 'Food and Drink', label: 'Food & Drink' },
        { value: 'Travel', label: 'Travel' },
        { value: 'Entertainment', label: 'Entertainment' },
        { value: 'Shopping', label: 'Shopping' },
        { value: 'Bills', label: 'Bills & Utilities' },
        { value: 'Other', label: 'Other' },
      ];

  const channels = [
    { value: 'Online', label: 'Online' },
    { value: 'In Store', label: 'In Store' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Cash', label: 'Cash' },
  ];

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
            <Select 
              value={formData.category || ''} 
              onValueChange={(value) => handleChange('category', value)}
              disabled={mode === 'view' || isSubmitting}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {(formData.type === 'income' 
                  ? [
                      { value: 'Income', label: 'Income' },
                      { value: 'Salary', label: 'Salary' },
                      { value: 'Allowance', label: 'Allowance' },
                      { value: 'Gift', label: 'Gift' },
                      { value: 'Other', label: 'Other' },
                    ] 
                  : [
                      { value: 'Food and Drink', label: 'Food & Drink' },
                      { value: 'Travel', label: 'Travel' },
                      { value: 'Entertainment', label: 'Entertainment' },
                      { value: 'Shopping', label: 'Shopping' },
                      { value: 'Bills', label: 'Bills & Utilities' },
                      { value: 'Other', label: 'Other' },
                    ]
                ).map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="channel">Payment Method</Label>
            <Select 
              value={formData.account_name || formData.channel || ''} 
              onValueChange={(value) => handleChange('account_name', value)}
              disabled={mode === 'view' || isSubmitting}
            >
              <SelectTrigger id="channel">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: 'Online', label: 'Online' },
                  { value: 'In Store', label: 'In Store' },
                  { value: 'Bank Transfer', label: 'Bank Transfer' },
                  { value: 'Cash', label: 'Cash' },
                ].map((channel) => (
                  <SelectItem key={channel.value} value={channel.value}>
                    {channel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
