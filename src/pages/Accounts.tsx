/**
 * Accounts Page
 * 
 * Financial accounts management interface.
 * Features:
 * - Account list display
 * - Add new accounts
 * - Account balance tracking
 * - Account type classification
 * - Account deletion
 * - Visual customization (icons, colors)
 * 
 * Account Types:
 * - Checking
 * - Savings
 * - Credit Cards
 * - Cash
 * 
 * Uses the accounts context for managing account state and actions.
 */

import React, { useState } from 'react';
import { useAccounts } from '@/context/AccountContext';
import Layout from '@/components/Layout';
import { Plus, Wallet, CreditCard, PiggyBank, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
};

const Accounts = () => {
  const { accounts, isLoading, addNewAccount, deleteAccount } = useAccounts();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: '',
    balance: 0,
    icon: 'Wallet',
    color: '#3b82f6'
  });

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addNewAccount(newAccount);
      setIsAddSheetOpen(false);
      setNewAccount({
        name: '',
        type: '',
        balance: 0,
        icon: 'Wallet',
        color: '#3b82f6'
      });
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    try {
      await deleteAccount(accountId);
      toast({
        title: "Account deleted",
        description: "The account has been successfully deleted",
      });
      setAccountToDelete(null);
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete the account",
        variant: "destructive",
      });
    }
  };

  const getAccountIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wallet':
        return <Wallet className="h-8 w-8" />;
      case 'CreditCard':
        return <CreditCard className="h-8 w-8" />;
      case 'PiggyBank':
        return <PiggyBank className="h-8 w-8" />;
      default:
        return <Wallet className="h-8 w-8" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const accountTypes = [
    { value: 'checking', label: 'Checking Account' },
    { value: 'savings', label: 'Savings Account' },
    { value: 'credit', label: 'Credit Card' },
    { value: 'cash', label: 'Cash' },
  ];

  const accountIcons = [
    { value: 'Wallet', label: 'Wallet' },
    { value: 'CreditCard', label: 'Credit Card' },
    { value: 'PiggyBank', label: 'Savings' },
  ];

  const accountColors = [
    { value: '#3b82f6', label: 'Blue' },
    { value: '#ef4444', label: 'Red' },
    { value: '#22c55e', label: 'Green' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#f97316', label: 'Orange' },
    { value: '#64748b', label: 'Gray' },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Accounts</h1>
        <p className="text-gray-500">Manage all your financial accounts in one place</p>
      </div>

      <div className="flex justify-end mb-6">
        <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
          <SheetTrigger asChild>
            <Button className="bg-finflow-blue flex items-center gap-2">
              <Plus size={16} />
              <span>Add New Account</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Add New Account</SheetTitle>
              <SheetDescription>
                Enter the details of your financial account.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleAddAccount} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Account Name</Label>
                <Input 
                  id="name" 
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                  placeholder="My Checking Account"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Account Type</Label>
                <Select 
                  value={newAccount.type} 
                  onValueChange={(value) => setNewAccount({...newAccount, type: value})}
                  required
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="balance">Initial Balance</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input 
                    id="balance"
                    type="number" 
                    step="0.01"
                    min="0"
                    className="pl-7"
                    value={newAccount.balance || ''}
                    onChange={(e) => setNewAccount({...newAccount, balance: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select 
                  value={newAccount.icon} 
                  onValueChange={(value) => setNewAccount({...newAccount, icon: value})}
                >
                  <SelectTrigger id="icon">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountIcons.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select 
                  value={newAccount.color} 
                  onValueChange={(value) => setNewAccount({...newAccount, color: value})}
                >
                  <SelectTrigger id="color">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountColors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }}></div>
                          <span>{color.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <Button type="submit" className="w-full">
                  Add Account
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-12 w-12 rounded-full border-4 border-t-blue-600 border-gray-200 animate-spin"></div>
        </div>
      ) : (
        <>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {accounts.map((account) => (
              <Card key={account.id} className="overflow-hidden animate-fade-in hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between p-6" style={{ backgroundColor: `${account.color}15` }}>
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 flex items-center justify-center rounded-full" 
                        style={{ backgroundColor: account.color }}
                      >
                        {getAccountIcon(account.icon)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{account.name}</h3>
                        <p className="text-sm text-gray-500">{account.type.charAt(0).toUpperCase() + account.type.slice(1)}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-red-600" onClick={() => setAccountToDelete(account.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="p-6 pt-4">
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-1">Available Balance</p>
                      <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-1">Account Number</p>
                      <p className="font-medium">{account.accountNumber}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {accounts.length === 0 && (
              <div className="col-span-3 py-16 text-center">
                <p className="text-gray-500 mb-4">You don't have any accounts yet.</p>
                <Button 
                  className="bg-finflow-blue"
                  onClick={() => setIsAddSheetOpen(true)}
                >
                  Add Your First Account
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}

      <AlertDialog open={!!accountToDelete} onOpenChange={() => setAccountToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this account and all its associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => accountToDelete && handleDeleteAccount(accountToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Accounts;
