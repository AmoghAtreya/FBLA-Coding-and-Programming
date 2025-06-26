/**
 * Accounts Page
 * 
 * Professional accounts management interface with:
 * - Account cards with clean design
 * - Account type organization
 * - Balance tracking with modern cards
 * - Professional color scheme
 * - Account creation and management
 * - Stripe credit card integration
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccounts } from '@/context/AccountContext';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Plus, Wallet, CreditCard, PiggyBank, MoreVertical, Trash2, Edit, Eye, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { AddCreditCardModal } from '@/components/AddCreditCardModal';
import { PaymentModal } from '@/components/PaymentModal';
import { fetchStripeAccounts, type StripeAccount } from '@/services/stripeService';

const Accounts = () => {
  const { accounts, isLoading, addNewAccount, deleteAccount } = useAccounts();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const location = useLocation();
  const [activeCardType, setActiveCardType] = useState<'personal' | 'business' | 'all'>('all');
  
  // Stripe-related state
  const [stripeAccounts, setStripeAccounts] = useState<StripeAccount[]>([]);
  const [isLoadingStripe, setIsLoadingStripe] = useState(true);
  const [showAddCreditCard, setShowAddCreditCard] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(100);
  const [customerId, setCustomerId] = useState<string>('');
  
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: '',
    balance: 0,
    icon: 'Wallet',
    color: '#3b82f6'
  });

  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountType, setNewAccountType] = useState('checking');
  const [newAccountBalance, setNewAccountBalance] = useState('');

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  // Handle URL parameters for card type
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get('type');
    if (type === 'personal' || type === 'business') {
      setActiveCardType(type);
    }
  }, [location.search]);

  // Load Stripe accounts on component mount
  useEffect(() => {
    const loadStripeAccounts = async () => {
      try {
        setIsLoadingStripe(true);
        const { accounts, customerId } = await fetchStripeAccounts();
        setStripeAccounts(accounts);
        if (customerId) {
          setCustomerId(customerId);
        }
      } catch (error) {
        console.error('Error loading Stripe accounts:', error);
        toast({
          title: "Error",
          description: "Failed to load credit card information",
          variant: "destructive",
        });
      } finally {
        setIsLoadingStripe(false);
      }
    };

    loadStripeAccounts();
  }, []);

  // Handler for successful credit card addition
  const handleCreditCardAdded = async () => {
    toast({
      title: "Success",
      description: "Credit card added successfully!",
    });
    // Reload Stripe accounts
    try {
      const { accounts, customerId } = await fetchStripeAccounts();
      setStripeAccounts(accounts);
      if (customerId) {
        setCustomerId(customerId);
      }
    } catch (error) {
      console.error('Error reloading Stripe accounts:', error);
    }
  };

  // Handler for successful payment
  const handlePaymentSuccess = (paymentIntent: any) => {
    toast({
      title: "Payment Successful",
      description: `Payment of $${paymentAmount.toFixed(2)} processed successfully!`,
    });
    // You might want to add the payment as a transaction here
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccount.name.trim()) return;
    
    try {
      await addNewAccount({
        name: newAccount.name.trim(),
        type: newAccount.type,
        balance: newAccount.balance,
        icon: newAccount.icon,
        color: newAccount.color
      });
      
      setNewAccount({
        name: '',
        type: '',
        balance: 0,
        icon: 'Wallet',
        color: '#3b82f6'
      });
      setIsAddSheetOpen(false);
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!selectedAccount) return;
    
    try {
      await deleteAccount(selectedAccount.id);
      setShowDeleteDialog(false);
      setSelectedAccount(null);
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete the account",
        variant: "destructive",
      });
    }
  };

  const handleEditAccount = (account: any) => {
    setSelectedAccount(account);
    setNewAccount({
      name: account.name,
      type: account.type || 'checking',
      balance: account.balance,
      icon: account.icon,
      color: account.color
    });
    setIsAddSheetOpen(true);
  };

  const getAccountIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wallet':
        return <Wallet className="h-6 w-6" />;
      case 'CreditCard':
        return <CreditCard className="h-6 w-6" />;
      case 'PiggyBank':
        return <PiggyBank className="h-6 w-6" />;
      default:
        return <Wallet className="h-6 w-6" />;
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

  // Calculate summary statistics
  const activeAccounts = accounts.filter(account => account.balance > 0).length;
  const checkingAccounts = accounts.filter(account => account.type === 'checking');
  const savingsAccounts = accounts.filter(account => account.type === 'savings');

  // Filter cards based on active tab
  const filteredStripeAccounts = stripeAccounts.filter(card => {
    if (activeCardType === 'personal') {
      return card.name?.toLowerCase().includes('personal') || !card.name?.toLowerCase().includes('business');
    } else if (activeCardType === 'business') {
      return card.name?.toLowerCase().includes('business');
    }
    return true; // Show all for 'all' tab
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="h-12 w-12 rounded-full border-4 border-t-green-500 border-gray-300 animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Accounts</h1>
            <p className="text-gray-500 mt-1">Manage all your financial accounts in one place</p>
          </div>
          <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
            <SheetTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New Account
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
                      <span className="text-gray-400">$</span>
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
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    Add Account
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        {/* Card Type Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveCardType('all')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeCardType === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>All Cards</span>
          </button>
          <button
            onClick={() => setActiveCardType('personal')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeCardType === 'personal'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Personal Card</span>
          </button>
          <button
            onClick={() => setActiveCardType('business')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeCardType === 'business'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Building className="h-4 w-4" />
            <span>Business Card</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Balance</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBalance)}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Active Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">{activeAccounts}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Savings Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(savingsAccounts.reduce((sum, acc) => sum + acc.balance, 0))}
                  </p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <PiggyBank className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stripe Credit Cards Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Credit Cards</h2>
              <p className="text-gray-500 text-sm">Manage your credit cards with Stripe</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowAddCreditCard(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Credit Card
              </Button>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-24"
                  min="1"
                  step="0.01"
                />
                <Button
                  onClick={() => setShowPaymentModal(true)}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                  disabled={!paymentAmount || paymentAmount <= 0}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay ${paymentAmount.toFixed(2)}
                </Button>
              </div>
            </div>
          </div>

          {isLoadingStripe ? (
            <div className="flex justify-center items-center h-32">
              <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 border-gray-300 animate-spin"></div>
            </div>
          ) : filteredStripeAccounts.length === 0 ? (
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activeCardType === 'all' ? 'No credit cards added' : 
                   activeCardType === 'personal' ? 'No personal cards found' : 
                   'No business cards found'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {activeCardType === 'all' ? 'Add a credit card to start making secure payments with Stripe.' :
                   activeCardType === 'personal' ? 'Add a personal credit card or switch to view all cards.' :
                   'Add a business credit card or switch to view all cards.'}
                </p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowAddCreditCard(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Credit Card
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStripeAccounts.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            {card.name?.toLowerCase().includes('business') ? 
                              <Building className="h-4 w-4" /> : 
                              <User className="h-4 w-4" />
                            }
                          </div>
                          <div>
                            <p className="text-sm opacity-90">
                              {card.name?.toLowerCase().includes('business') ? 'Business Card' : 'Personal Card'}
                            </p>
                            <p className="text-xs opacity-70">Stripe Powered</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <div className="w-6 h-6 bg-orange-500 rounded-full opacity-90"></div>
                            <div className="w-6 h-6 bg-red-500 rounded-full opacity-90 -ml-2"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-lg font-mono tracking-widest">{card.accountNumber}</p>
                        </div>
                        
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xs opacity-70 mb-1">EXPIRES</p>
                            <p className="text-sm font-mono">{card.expiryDate || 'MM/YY'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs opacity-70 mb-1">CARD TYPE</p>
                            <p className="text-sm font-semibold">{card.name}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Regular Accounts Grid */}
        {accounts.length === 0 ? (
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No accounts yet</h3>
              <p className="text-gray-500 mb-4">You don't have any accounts set up. Add your first account to get started.</p>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setIsAddSheetOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-0">
                    {/* Account Header */}
                    <div 
                      className="p-6 rounded-t-lg"
                      style={{ backgroundColor: `${account.color}15` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-12 h-12 flex items-center justify-center rounded-xl text-white" 
                            style={{ backgroundColor: account.color }}
                          >
                            {getAccountIcon(account.icon)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{account.name}</h3>
                            <p className="text-sm text-gray-500 capitalize">{account.type} Account</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditAccount(account)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Account
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 cursor-pointer" 
                              onClick={() => {
                                setSelectedAccount(account);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Account Details */}
                    <div className="p-6 space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Available Balance</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(account.balance)}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Account Number</p>
                          <p className="font-mono text-sm text-gray-700">{account.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Status</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Last updated</span>
                          <span className="text-gray-700">Today</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={() => setShowDeleteDialog(false)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove all associated data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Stripe Modals */}
        <AddCreditCardModal
          isOpen={showAddCreditCard}
          onClose={() => setShowAddCreditCard(false)}
          onSuccess={handleCreditCardAdded}
          customerId={customerId}
        />

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          amount={paymentAmount}
          description="Test payment"
        />
      </div>
    </Layout>
  );
};

export default Accounts;
