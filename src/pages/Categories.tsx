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

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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
import { Plus, Pencil, Trash2, Target, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
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

  useEffect(() => {
    fetchAllTransactions();
    refresh();
  }, []);

  const expenseCategories = categories?.filter(cat => cat.type === 'expense') ?? [];
  const incomeCategories = categories?.filter(cat => cat.type === 'income') ?? [];

  const pieChartData = useMemo(() => {
    return expenseCategories
      .map(category => ({
        name: category.name,
        value: category.spent,
        percentage: category.percentage,
        color: category.color,
      }))
      .filter(entry => entry.value > 0);
  }, [expenseCategories]);

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

  // Calculate summary statistics
  const totalBudget = expenseCategories.reduce((sum, cat) => sum + (cat.budget || 0), 0);
  const totalSpent = expenseCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalIncome = incomeCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const budgetUsagePercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

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
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-500 mt-1">Organize your finances by categories and track spending</p>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
                  <div className="flex items-center mt-1">
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    <span className="text-xs text-red-500">{budgetUsagePercentage.toFixed(0)}% of budget</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Remaining Budget</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(Math.max(0, totalBudget - totalSpent))}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Expense Categories */}
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Expense Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {expenseCategories.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">No expense categories yet</p>
                    <Button 
                      onClick={() => setIsDialogOpen(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Add First Category
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {expenseCategories.map((category) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <div>
                              <h3 className="font-medium text-gray-900">{category.name}</h3>
                              <p className="text-sm text-gray-500">
                                {formatCurrency(category.spent)} of {formatCurrency(category.budget || 0)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCategoryToDelete(category.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {category.budget > 0 && (
                          <div className="mt-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-gray-500">Budget Progress</span>
                              <span className="text-xs text-gray-500">
                                {((category.spent / category.budget) * 100).toFixed(0)}%
                              </span>
                            </div>
                            <Progress 
                              value={(category.spent / category.budget) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Income Categories */}
            {incomeCategories.length > 0 && (
              <Card className="bg-white border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Income Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {incomeCategories.map((category) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">{category.name}</h3>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(category.spent)} received
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCategoryToDelete(category.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chart Section */}
          <div className="space-y-6">
            <Card className="bg-white border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Spending Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {expenseCategories.length > 0 ? (
                  <div className="h-[300px]">
                    <CategoryChart transactions={transactions} />
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No spending data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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
      </div>
    </Layout>
  );
};

export default Categories;
