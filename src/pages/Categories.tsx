/**
 * Categories Page
 * 
 * Professional category management interface with:
 * - Category cards with clean design
 * - Budget tracking and progress indicators
 * - Visual spending breakdown
 * - Category creation and management
 * - Professional color scheme
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
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
import { Plus, Pencil, Trash2, Target, TrendingUp, TrendingDown, BarChart3, Calendar, DollarSign, Users, Search, Calculator, ChevronRight, ChevronLeft, X, CheckCircle } from 'lucide-react';
import CategoryChart from '@/components/CategoryChart';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoryStats } from "@/hooks/useCategoryStats";
import { useTransactions } from "@/context/TransactionContext";
import { generateBudgetSuggestions, generateSpendingInsights } from "@/services/aiService";

const categoryColors = [
  { value: '#f97316', label: 'Orange', bg: 'bg-orange-500' },
  { value: '#3b82f6', label: 'Blue', bg: 'bg-blue-500' },
  { value: '#8b5cf6', label: 'Purple', bg: 'bg-purple-500' },
  { value: '#ec4899', label: 'Pink', bg: 'bg-pink-500' },
  { value: '#ef4444', label: 'Red', bg: 'bg-red-500' },
  { value: '#22c55e', label: 'Green', bg: 'bg-green-500' },
  { value: '#14b8a6', label: 'Teal', bg: 'bg-teal-500' },
  { value: '#64748b', label: 'Gray', bg: 'bg-gray-500' },
];

const Categories = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { fetchAllTransactions, transactions } = useTransactions();
  const { categories, loading: isLoading, error, refresh } = useCategoryStats();

  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
    color: '#f97316',
    icon: '',
    budget: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<string | undefined>(undefined);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Budgeting System State
  const [isBudgetingOpen, setIsBudgetingOpen] = useState(false);
  const [budgetingStep, setBudgetingStep] = useState(1);
  const [budgetData, setBudgetData] = useState({
    monthlyIncome: 0,
    totalBudget: 0,
    categoryBudgets: {} as Record<string, number>,
  });
  
  // AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [spendingInsights, setSpendingInsights] = useState<string[]>([]);

  useEffect(() => {
    fetchAllTransactions();
    refresh();
  }, []);

  // Debounced AI analysis when monthly income changes
  useEffect(() => {
    if (budgetData.monthlyIncome > 0 && categories.length > 0 && transactions.length > 0) {
      const timeoutId = setTimeout(() => {
        generateAIAnalysis();
      }, 1500); // Wait 1.5 seconds after user stops typing

      return () => clearTimeout(timeoutId);
    } else {
      // Clear analysis if income is 0 or data is not available
      setAiAnalysis(null);
      setSpendingInsights([]);
    }
  }, [budgetData.monthlyIncome, categories.length, transactions.length]);

  const expenseCategories = categories?.filter(cat => cat.type === 'expense') ?? [];
  const incomeCategories = categories?.filter(cat => cat.type === 'income') ?? [];

  // Filter categories based on active filter and search term
  const filteredCategories = useMemo(() => {
    let cats = categories;
    
    // Filter by type
    if (activeFilter === 'expense') {
      cats = expenseCategories;
    } else if (activeFilter === 'income') {
      cats = incomeCategories;
    }
    
    // Filter by search term
    if (searchTerm) {
      cats = cats.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return cats;
  }, [categories, activeFilter, searchTerm, expenseCategories, incomeCategories]);

  const handleSaveCategory = async () => {
    if (!user) return;
    try {
      if (!newCategory.name) {
        toast({
          title: "Error",
          description: "Category name is required",
          variant: "destructive",
        });
        return;
      }
      
      const budgetValue = typeof newCategory.budget === 'number' ? 
        newCategory.budget : 
        parseFloat(newCategory.budget as unknown as string) || 0;
      
      let result;
      if (isEditMode && currentCategoryId) {
        const { data, error } = await supabase
          .from('categories')
          .update({
            name: newCategory.name,
            type: newCategory.type,
            color: newCategory.color,
            icon: newCategory.icon,
            budget: budgetValue,
          })
          .eq('id', currentCategoryId)
          .select();
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        result = data?.[0];
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        const { data, error } = await supabase
          .from('categories')
          .insert({
            name: newCategory.name,
            type: newCategory.type,
            color: newCategory.color,
            icon: newCategory.icon,
            budget: budgetValue,
            user_id: user.id,
          })
          .select();
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        result = data?.[0];
        toast({
          title: "Success",
          description: "Category added successfully",
        });
      }
      
      await refresh();
      resetForm();
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save category",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      await fetchAllTransactions();
      await refresh();
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const handleEditCategory = (category: any) => {
    setNewCategory({
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon || '',
      budget: category.budget || 0
    });
    setCurrentCategoryId(category.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setNewCategory({
      name: '',
      type: 'expense',
      color: '#f97316',
      icon: '',
      budget: 0,
    });
    setCurrentCategoryId(undefined);
    setIsEditMode(false);
    setIsDialogOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getBudgetStatus = (category: any) => {
    if (!category.budget || category.budget === 0) return 'no-budget';
    const percentage = (category.spent / category.budget) * 100;
    if (percentage >= 100) return 'over-budget';
    if (percentage >= 80) return 'near-limit';
    return 'on-track';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over-budget': return 'bg-red-100 text-red-800';
      case 'near-limit': return 'bg-yellow-100 text-yellow-800';
      case 'on-track': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'over-budget': return 'Over Budget';
      case 'near-limit': return 'Near Limit';
      case 'on-track': return 'On Track';
      default: return 'No Budget';
    }
  };

  // AI Analysis Functions
  const generateAIAnalysis = async () => {
    if (budgetData.monthlyIncome === 0) return;
    
    setIsLoadingAI(true);
    try {
      const analysis = await generateBudgetSuggestions(
        budgetData.monthlyIncome,
        categories,
        transactions
      );
      setAiAnalysis(analysis);
      
      // Pre-populate category budgets with AI suggestions
      const aiCategoryBudgets: Record<string, number> = {};
      analysis.categorySuggestions.forEach(suggestion => {
        aiCategoryBudgets[suggestion.categoryId] = suggestion.suggestedBudget;
      });
      
      setBudgetData(prev => ({
        ...prev,
        categoryBudgets: { ...prev.categoryBudgets, ...aiCategoryBudgets }
      }));

      // Show success notification for live updates
      toast({
        title: "✨ AI Analysis Complete",
        description: `Updated budget suggestions for ${analysis.categorySuggestions.length} categories`,
        duration: 3000,
      });
      
      // Get spending insights
      const insights = await generateSpendingInsights(transactions);
      setSpendingInsights(insights);
      
    } catch (error) {
      console.error('Error generating AI analysis:', error);
      toast({
        title: "AI Analysis Error",
        description: "Unable to generate AI suggestions. Using fallback recommendations.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Budgeting Functions  
  const handleBudgetingNext = () => {
    if (budgetingStep < 4) {
      setBudgetingStep(budgetingStep + 1);
    }
  };

  const handleBudgetingPrev = () => {
    if (budgetingStep > 1) {
      setBudgetingStep(budgetingStep - 1);
    }
  };

  const handleBudgetingClose = () => {
    setIsBudgetingOpen(false);
    setBudgetingStep(1);
    setBudgetData({
      monthlyIncome: 0,
      totalBudget: 0,
      categoryBudgets: {},
    });
    setAiAnalysis(null);
    setSpendingInsights([]);
    setIsLoadingAI(false);
  };

  const handleSaveBudgets = async () => {
    try {
      // Update category budgets in the database
      const updates = Object.entries(budgetData.categoryBudgets).map(([categoryId, budget]) => 
        supabase
          .from('categories')
          .update({ budget })
          .eq('id', categoryId)
      );
      
      await Promise.all(updates);
      
      toast({
        title: "Success",
        description: "Budget plan saved successfully!",
      });
      
      await refresh();
      handleBudgetingClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save budget plan",
        variant: "destructive",
      });
    }
  };

  const updateCategoryBudget = (categoryId: string, budget: number) => {
    setBudgetData(prev => ({
      ...prev,
      categoryBudgets: {
        ...prev.categoryBudgets,
        [categoryId]: budget
      }
    }));
  };

  // Calculate summary statistics
  const totalBudget = expenseCategories.reduce((sum, cat) => sum + (cat.budget || 0), 0);
  const totalSpent = expenseCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalIncome = incomeCategories.reduce((sum, cat) => sum + cat.spent, 0);

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
        {/* Header with Stats */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CATEGORIES</h1>
              <p className="text-gray-500 mt-1">Manage your financial categories</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsBudgetingOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Start Budgeting
              </Button>
              <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">ACTIVE</span>
              </div>
              <div className="bg-gray-100 rounded-full p-1 text-gray-600 font-bold">
                {categories.length}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">ALL</div>
              <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">EXPENSES</div>
              <div className="text-2xl font-bold text-red-600">{expenseCategories.length}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">INCOME</div>
              <div className="text-2xl font-bold text-green-600">{incomeCategories.length}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">OVER BUDGET</div>
              <div className="text-2xl font-bold text-red-600">
                {expenseCategories.filter(cat => getBudgetStatus(cat) === 'over-budget').length}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs and Search */}
        <div className="flex justify-between items-center">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ALL {categories.length}
            </button>
            <button
              onClick={() => setActiveFilter('expense')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'expense'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              EXPENSES {expenseCategories.length}
            </button>
            <button
              onClick={() => setActiveFilter('income')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === 'income'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              INCOME {incomeCategories.length}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Name or Type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    setIsEditMode(false);
                    resetForm();
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{isEditMode ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                  <DialogDescription>
                    {isEditMode 
                      ? 'Update your category details and budget settings.' 
                      : 'Create a new category to organize your transactions and set budget limits.'
                    }
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category-name">Category Name</Label>
                    <Input
                      id="category-name"
                      placeholder="e.g., Groceries, Entertainment"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category-type">Type</Label>
                    <Select value={newCategory.type} onValueChange={(value: 'income' | 'expense') => setNewCategory({...newCategory, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category-budget">Budget (Optional)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="category-budget"
                        type="number"
                        step="0.01"
                        min="0"
                        className="pl-8"
                        placeholder="0.00"
                        value={newCategory.budget || ''}
                        onChange={(e) => setNewCategory({...newCategory, budget: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex flex-wrap gap-2">
                      {categoryColors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            newCategory.color === color.value 
                              ? 'border-gray-900 scale-110' 
                              : 'border-gray-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setNewCategory({...newCategory, color: color.value})}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveCategory}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isEditMode ? 'Update Category' : 'Add Category'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="space-y-3">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'No categories match your search' : 'No categories yet'}
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Add First Category
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-6 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  <div>CATEGORY</div>
                  <div>ACTIVITY</div>
                  <div>BUDGET</div>
                  <div>STATUS</div>
                  <div>TYPE</div>
                  <div className="text-right">ACTIONS</div>
                </div>
              </div>

              {/* Category Cards */}
              {filteredCategories.map((category) => {
                const status = getBudgetStatus(category);
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 rounded-lg shadow-sm border hover:shadow-md transition-all"
                    style={{ 
                      backgroundColor: category.color + '08',
                      borderColor: category.color + '20'
                    }}
                  >
                    <div className="grid grid-cols-6 gap-4 items-center">
                      {/* Category Info */}
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-12 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: category.color + '20', color: category.color, border: `2px solid ${category.color}40` }}
                        >
                          {category.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-500">
                            {category.type === 'expense' ? 'Expense Category' : 'Income Category'}
                          </p>
                        </div>
                      </div>

                      {/* Activity */}
                      <div>
                        <p className="text-sm text-gray-900 font-medium">
                          {category.type === 'expense' ? 'Spent' : 'Received'} {formatCurrency(category.spent)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {category.transactions || 0} transactions
                        </p>
                      </div>

                      {/* Budget */}
                      <div>
                        <p className="text-sm text-gray-900 font-medium">
                          {category.budget ? formatCurrency(category.budget) : 'No budget'}
                        </p>
                        {category.budget > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-500 ease-out"
                                style={{ 
                                  width: `${Math.min((category.spent / category.budget) * 100, 100)}%`,
                                  backgroundColor: category.spent > category.budget ? '#ef4444' : category.color
                                }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Spent: {formatCurrency(category.spent)}</span>
                              <span>{Math.round((category.spent / category.budget) * 100)}%</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      <div>
                        <Badge 
                          className={`${getStatusColor(status)} border-0`}
                        >
                          <div className="w-2 h-2 rounded-full bg-current mr-1"></div>
                          {getStatusText(status)}
                        </Badge>
                      </div>

                      {/* Type */}
                      <div>
                        <Badge 
                          variant="outline" 
                          className={category.type === 'expense' ? 'text-red-600 border-red-200' : 'text-green-600 border-green-200'}
                        >
                          {category.type === 'expense' ? 'Expense' : 'Income'}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCategoryToDelete(category.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the category
                and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => categoryToDelete && handleDeleteCategory(categoryToDelete)}
              >
                Delete Category
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Budgeting Center Modal */}
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ease-in-out ${
          isBudgetingOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={handleBudgetingClose} />
          
          <div className={`relative bg-white rounded-xl shadow-2xl w-[680px] max-h-[90vh] transform transition-all duration-300 ease-in-out ${
            isBudgetingOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
          }`}>
            <div className="h-full flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold">Budget Setup</h2>
                <p className="text-blue-100 text-sm">Step {budgetingStep} of 4</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBudgetingClose}
                className="text-white hover:bg-blue-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="px-8 py-6 bg-gray-50 border-b">
              {/* Step Indicators */}
              <div className="relative max-w-2xl mx-auto mb-6">
                <div className="flex items-center justify-between">
                  {/* Background Line - positioned between circles */}
                  <div className="absolute top-8 left-8 right-8 h-0.5 bg-gray-300"></div>
                  
                  {/* Active Progress Line */}
                  <div 
                    className="absolute top-8 left-8 h-0.5 bg-blue-600 transition-all duration-500"
                    style={{ 
                      width: budgetingStep === 1 ? '0%' : 
                             budgetingStep === 2 ? 'calc(33.33% - 16px)' :
                             budgetingStep === 3 ? 'calc(66.66% - 16px)' :
                             'calc(100% - 32px)'
                    }}
                  ></div>
                  
                  {[
                    { step: 1, label: 'Welcome', icon: '👋' },
                    { step: 2, label: 'Income', icon: '💰' },
                    { step: 3, label: 'Categories', icon: '📊' },
                    { step: 4, label: 'Review', icon: '✅' }
                  ].map((item) => {
                    // Check if current step is completed
                    const isStep1Complete = true; // Welcome step is always complete
                    const isStep2Complete = budgetData.monthlyIncome > 0;
                    const isStep3Complete = Object.values(budgetData.categoryBudgets).some(budget => budget > 0);
                    const isStep4Complete = true; // Review step is always accessible if reached
                    
                    // Determine if we can navigate to each step
                    const canNavigateToStep = (stepNumber: number) => {
                      if (stepNumber <= budgetingStep) return true; // Can always go back to completed steps
                      if (stepNumber === budgetingStep + 1) {
                        // Can only go to next step if current step is complete
                        if (budgetingStep === 1 && isStep1Complete) return true;
                        if (budgetingStep === 2 && isStep2Complete) return true;
                        if (budgetingStep === 3 && isStep3Complete) return true;
                        if (budgetingStep === 4 && isStep4Complete) return true;
                      }
                      return false;
                    };
                    
                    const isClickable = canNavigateToStep(item.step);
                    const isCompleted = budgetingStep > item.step;
                    const isCurrent = budgetingStep === item.step;
                    
                    return (
                      <div key={item.step} className="flex flex-col items-center relative z-10">
                        {/* Step Circle */}
                        <button
                          onClick={() => {
                            if (isClickable) {
                              setBudgetingStep(item.step);
                            }
                          }}
                          disabled={!isClickable}
                          className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium transition-all duration-300 ${
                            isCompleted
                              ? 'bg-blue-600 text-white shadow-lg cursor-pointer hover:bg-blue-700' 
                              : isCurrent
                              ? 'bg-blue-600 text-white shadow-lg cursor-pointer hover:bg-blue-700'
                              : isClickable
                              ? 'bg-gray-300 text-gray-600 cursor-pointer hover:bg-gray-400'
                              : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-60'
                          } ${isClickable ? 'hover:scale-105' : ''}`}
                        >
                          {isCompleted ? '✓' : item.icon}
                        </button>
                        
                        {/* Step Label */}
                        <span className={`text-sm mt-3 font-medium transition-colors duration-300 ${
                          budgetingStep >= item.step ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Progress Info */}
              <div className="flex justify-between items-center max-w-2xl mx-auto">
                <span className="text-sm text-gray-600 font-medium">
                  Progress: {Math.round((budgetingStep / 4) * 100)}% Complete
                </span>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4].map(step => (
                    <div 
                      key={step}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        budgetingStep >= step ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {budgetingStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calculator className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Budget Setup</h3>
                    <p className="text-gray-600 mb-6">Let's create a personalized budget plan to help you manage your finances better.</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">What we'll do:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Set your monthly income target</li>
                      <li>• Get AI-powered budget recommendations</li>
                      <li>• Allocate budgets to your expense categories</li>
                      <li>• Review and save your personalized budget plan</li>
                      <li>• Track your progress with smart insights</li>
                    </ul>
                  </div>

                  {spendingInsights.length > 0 && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-4 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                        <span className="text-purple-600 mr-2">🤖</span>
                        AI Spending Insights
                      </h4>
                      <ul className="text-sm text-purple-800 space-y-1">
                        {spendingInsights.map((insight, index) => (
                          <li key={index}>• {insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-4 rounded-lg">
                      <div className="text-xl font-bold text-green-600 leading-tight">{categories.length}</div>
                      <div className="text-xs text-green-700 mt-1">Categories</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-4 rounded-lg">
                      <div className="text-lg font-bold text-blue-600 leading-tight break-all">{formatCurrency(totalSpent)}</div>
                      <div className="text-xs text-blue-700 mt-1">Last Month</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 p-4 rounded-lg">
                      <div className="text-xl font-bold text-purple-600 leading-tight">{expenseCategories.length}</div>
                      <div className="text-xs text-purple-700 mt-1">Expenses</div>
                    </div>
                  </div>
                </div>
              )}

              {budgetingStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Your Monthly Income</h3>
                    <p className="text-gray-600 mb-4">Enter your expected monthly income to help us recommend budget allocations.</p>
                  </div>

                                      <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="monthly-income">Monthly Income</Label>
                          {budgetData.monthlyIncome > 0 && (
                            <div className="flex items-center space-x-2">
                              {isLoadingAI ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                  <span className="text-xs text-blue-600 font-medium">AI Analyzing...</span>
                                </>
                              ) : aiAnalysis ? (
                                <div className="flex items-center space-x-1">
                                  <div className="rounded-full h-3 w-3 bg-green-500"></div>
                                  <span className="text-xs text-green-600 font-medium">✨ AI Ready</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-1">
                                  <div className="animate-pulse rounded-full h-3 w-3 bg-yellow-400"></div>
                                  <span className="text-xs text-yellow-600 font-medium">⏳ Preparing...</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="relative mt-1">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            id="monthly-income"
                            type="number"
                            step="0.01"
                            min="0"
                            className="pl-8 text-lg"
                            placeholder="5,000.00"
                            value={budgetData.monthlyIncome || ''}
                            onChange={(e) => setBudgetData(prev => ({
                              ...prev,
                              monthlyIncome: parseFloat(e.target.value) || 0
                            }))}
                          />
                        </div>
                      </div>

                                        {budgetData.monthlyIncome > 0 && (
                      <>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-2">50/30/20 Rule Recommendation</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-green-800">Fixed Expenses (50%)</span>
                              <span className="font-medium text-green-900 text-right break-all">{formatCurrency(budgetData.monthlyIncome * 0.5)}</span>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-green-800">Discretionary (30%)</span>
                              <span className="font-medium text-green-900 text-right break-all">{formatCurrency(budgetData.monthlyIncome * 0.3)}</span>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-green-800">Savings (20%)</span>
                              <span className="font-medium text-green-900 text-right break-all">{formatCurrency(budgetData.monthlyIncome * 0.2)}</span>
                            </div>
                          </div>
                        </div>

                        {budgetData.monthlyIncome > 0 && (
                          <>
                            {isLoadingAI ? (
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg animate-pulse">
                                <div className="flex items-center justify-center space-x-3">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                  <span className="text-blue-800 font-medium">🤖 AI is analyzing your spending patterns...</span>
                                </div>
                                <p className="text-sm text-blue-600 text-center mt-2">
                                  Creating personalized budget recommendations based on your financial data
                                </p>
                              </div>
                            ) : budgetData.monthlyIncome > 0 && !aiAnalysis ? (
                              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 p-4 rounded-lg">
                                <div className="flex items-center justify-center space-x-3">
                                  <div className="animate-pulse rounded-full h-6 w-6 bg-yellow-400 flex items-center justify-center">
                                    <span className="text-yellow-800 text-sm">⏳</span>
                                  </div>
                                  <span className="text-yellow-800 font-medium">🤖 Preparing AI analysis...</span>
                                </div>
                                <p className="text-sm text-yellow-700 text-center mt-2">
                                  AI will analyze your data in a moment
                                </p>
                              </div>
                            ) : null}
                          </>
                        )}

                        {aiAnalysis && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-4 rounded-lg"
                          >
                            <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                              <span className="text-purple-600 mr-2">🤖</span>
                              AI Financial Advisor
                              <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Live Updated
                              </span>
                            </h4>
                            <p className="text-sm text-purple-800 italic">
                              "{aiAnalysis.overallRecommendation}"
                            </p>
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {budgetingStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Allocate Category Budgets</h3>
                    <p className="text-gray-600 mb-4">Set spending limits for each expense category.</p>
                  </div>

                                    <div className="space-y-4">
                                          {expenseCategories.map((category) => {
                        const aiSuggestion = aiAnalysis?.categorySuggestions?.find(s => s.categoryId === category.id);
                        return (
                                                    <motion.div 
                            key={category.id} 
                            initial={{ opacity: 0.8 }}
                            animate={{ 
                              opacity: 1,
                              borderLeftColor: aiSuggestion ? '#8b5cf6' : category.color
                            }}
                            transition={{ duration: 0.3 }}
                            className={`p-4 rounded-lg border-l-4 ${
                              aiSuggestion ? 'border-l-purple-500' : 'border-l-gray-300'
                            }`}
                            style={{
                              backgroundColor: category.color + '08',
                              borderColor: category.color + '20'
                            }}
                          >
                                                        <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div 
                                  className="w-10 h-6 rounded-md flex items-center justify-center text-sm font-bold"
                                  style={{ backgroundColor: category.color + '20', color: category.color, border: `2px solid ${category.color}40` }}
                                >
                                  {category.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-gray-900 truncate">{category.name}</h4>
                                  {aiSuggestion && (
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                      aiSuggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                                      aiSuggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-green-100 text-green-700'
                                    }`}>
                                      {aiSuggestion.priority} priority
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 break-all">
                                  Last month: {formatCurrency(category.spent)}
                                </p>
                                {aiSuggestion && (
                                  <p className="text-xs text-purple-600 mt-1 italic flex items-center">
                                    💡 AI suggests: {formatCurrency(aiSuggestion.suggestedBudget)}
                                    {budgetData.categoryBudgets[category.id] === aiSuggestion.suggestedBudget && (
                                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                        Applied
                                      </span>
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                className="pl-8"
                                placeholder="0.00"
                                value={budgetData.categoryBudgets[category.id] || category.budget || ''}
                                onChange={(e) => updateCategoryBudget(category.id, parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            
                                                        {aiSuggestion && (
                              <div className="bg-white bg-opacity-90 backdrop-blur-sm p-3 rounded border border-purple-200">
                                <p className="text-xs text-purple-800">
                                  <span className="font-medium">🤖 AI Reasoning:</span> {aiSuggestion.reasoning}
                                </p>
                                {aiSuggestion.suggestedBudget !== (budgetData.categoryBudgets[category.id] || 0) && (
                                  <button
                                    onClick={() => updateCategoryBudget(category.id, aiSuggestion.suggestedBudget)}
                                    className="mt-2 text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-full transition-colors"
                                  >
                                    Apply AI Suggestion
                                  </button>
                                )}
                              </div>
                            )}
                           </div>
                         </motion.div>
                       );
                     })}

                                         <div className="bg-blue-50 p-4 rounded-lg">
                       <div className="flex justify-between items-center gap-4">
                         <span className="font-medium text-blue-900">Total Allocated:</span>
                         <span className="text-lg font-bold text-blue-900 text-right break-all">
                           {formatCurrency(Object.values(budgetData.categoryBudgets).reduce((sum, budget) => sum + budget, 0))}
                         </span>
                       </div>
                       {budgetData.monthlyIncome > 0 && (
                         <div className="text-sm text-blue-800 mt-1 text-center">
                           {Math.round((Object.values(budgetData.categoryBudgets).reduce((sum, budget) => sum + budget, 0) / budgetData.monthlyIncome) * 100)}% of income
                         </div>
                       )}
                     </div>
                  </div>
                </div>
              )}

              {budgetingStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Your Budget Plan</h3>
                    <p className="text-gray-600 mb-6">Review your budget allocations before saving.</p>
                  </div>

                  <div className="space-y-4">
                                         <div className="bg-blue-50 p-4 rounded-lg">
                       <h4 className="font-medium text-blue-900 mb-3">Budget Summary</h4>
                       <div className="space-y-2 text-sm">
                         <div className="flex justify-between items-center">
                           <span className="text-blue-800">Monthly Income:</span>
                           <span className="font-medium text-blue-900 text-right break-all">{formatCurrency(budgetData.monthlyIncome)}</span>
                         </div>
                         <div className="flex justify-between items-center">
                           <span className="text-blue-800">Total Budget:</span>
                           <span className="font-medium text-blue-900 text-right break-all">
                             {formatCurrency(Object.values(budgetData.categoryBudgets).reduce((sum, budget) => sum + budget, 0))}
                           </span>
                         </div>
                         <div className="flex justify-between items-center border-t pt-2">
                           <span className="text-blue-800">Remaining:</span>
                           <span className="font-medium text-blue-900 text-right break-all">
                             {formatCurrency(budgetData.monthlyIncome - Object.values(budgetData.categoryBudgets).reduce((sum, budget) => sum + budget, 0))}
                           </span>
                         </div>
                       </div>
                     </div>

                                        <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Category Budgets:</h4>
                        <div className="space-y-2">
                          {Object.entries(budgetData.categoryBudgets).map(([categoryId, budget]) => {
                            const category = expenseCategories.find(cat => cat.id === categoryId);
                            if (!category || budget === 0) return null;
                            
                            return (
                                                          <div 
                              key={categoryId} 
                              className="flex items-center justify-between gap-4 p-3 rounded-lg"
                              style={{
                                backgroundColor: category.color + '10',
                                border: `1px solid ${category.color}20`
                              }}
                            >
                              <div className="flex items-center space-x-3 min-w-0 flex-1">
                                <div 
                                  className="w-8 h-5 rounded-md flex-shrink-0 flex items-center justify-center text-xs font-bold"
                                  style={{ backgroundColor: category.color + '30', color: category.color, border: `1px solid ${category.color}50` }}
                                >
                                  {category.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-gray-900 truncate">{category.name}</span>
                              </div>
                              <span className="font-medium text-gray-900 text-right break-all flex-shrink-0">{formatCurrency(budget)}</span>
                            </div>
                            );
                          })}
                        </div>
                      </div>

                      {aiAnalysis && (
                        <>
                          {aiAnalysis.warningAreas && aiAnalysis.warningAreas.length > 0 && (
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 p-4 rounded-lg">
                              <h4 className="font-medium text-red-900 mb-2 flex items-center">
                                <span className="text-red-600 mr-2">⚠️</span>
                                Areas to Watch
                              </h4>
                              <ul className="text-sm text-red-800 space-y-1">
                                {aiAnalysis.warningAreas.map((warning: string, index: number) => (
                                  <li key={index}>• {warning}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {aiAnalysis.optimizationTips && aiAnalysis.optimizationTips.length > 0 && (
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-4 rounded-lg">
                              <h4 className="font-medium text-green-900 mb-2 flex items-center">
                                <span className="text-green-600 mr-2">💡</span>
                                Optimization Tips
                              </h4>
                              <ul className="text-sm text-green-800 space-y-1">
                                {aiAnalysis.optimizationTips.slice(0, 4).map((tip: string, index: number) => (
                                  <li key={index}>• {tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {aiAnalysis.spendingInsights && aiAnalysis.spendingInsights.length > 0 && (
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-4 rounded-lg">
                              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                                <span className="text-blue-600 mr-2">📊</span>
                                Smart Insights
                              </h4>
                              <ul className="text-sm text-blue-800 space-y-1">
                                {aiAnalysis.spendingInsights.map((insight: string, index: number) => (
                                  <li key={index}>• {insight}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={budgetingStep === 1 ? handleBudgetingClose : handleBudgetingPrev}
                  disabled={budgetingStep === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  {budgetingStep === 1 ? 'Cancel' : 'Previous'}
                </Button>
                
                <div className="flex flex-col items-end">
                  {/* Completion hint */}
                  {budgetingStep === 2 && budgetData.monthlyIncome === 0 && (
                    <span className="text-xs text-amber-600 mb-2 font-medium">
                      💡 Please enter your monthly income to continue
                    </span>
                  )}
                  {budgetingStep === 3 && !Object.values(budgetData.categoryBudgets).some(budget => budget > 0) && (
                    <span className="text-xs text-amber-600 mb-2 font-medium">
                      💡 Set at least one category budget to continue
                    </span>
                  )}
                  
                  <Button
                    onClick={budgetingStep === 4 ? handleSaveBudgets : handleBudgetingNext}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={
                      (budgetingStep === 2 && budgetData.monthlyIncome === 0) ||
                      (budgetingStep === 3 && !Object.values(budgetData.categoryBudgets).some(budget => budget > 0))
                    }
                  >
                    {budgetingStep === 4 ? 'Save Budget Plan' : 'Next'}
                    {budgetingStep !== 4 && <ChevronRight className="h-4 w-4 ml-2" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
