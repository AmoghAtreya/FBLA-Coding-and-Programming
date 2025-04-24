/**
 * Categories Page
 * 
 * Manages transaction categories and their budgets.
 * Features:
 * - Create/Edit/Delete categories
 * - Category budget management
 * - Expense tracking by category
 * - Visual spending breakdown
 * - Category color customization
 * - Separate handling for income and expense categories
 * 
 * Components:
 * - Category cards with progress indicators
 * - Category creation/edit modal
 * - Pie chart visualization
 * - Budget tracking
 */

import React, { useState, useMemo, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Plus, Pencil, Trash2 } from 'lucide-react';
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
  const { fetchAllTransactions } = useTransactions();
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

  const pieChartLoading = isLoading;

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

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-start">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold mb-2">Categories</h1>
          <p className="text-gray-500">Organize your finances by categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-finflow-blue flex items-center gap-2">
              <Plus size={16} />
              <span>Add Category</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              <DialogDescription>
                {isEditMode ? 'Update your category details.' : 'Create a new category to organize your transactions.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input 
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="e.g., Groceries"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Category Type</Label>
                <Select 
                  value={newCategory.type} 
                  onValueChange={(value: 'income' | 'expense') => setNewCategory({...newCategory, type: value})}
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
              <div className="space-y-2">
                <Label htmlFor="budget">Monthly Budget {newCategory.type === 'expense' ? '(spending limit)' : ''}</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newCategory.budget}
                    onChange={(e) => setNewCategory({...newCategory, budget: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                    className="pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="grid grid-cols-4 gap-2">
                  {categoryColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewCategory({...newCategory, color: color.value})}
                      className={`h-10 rounded-md ${color.bg} ${newCategory.color === color.value ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleSaveCategory}>
                {isEditMode ? 'Update Category' : 'Add Category'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-12 w-12 rounded-full border-4 border-t-blue-600 border-gray-200 animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Expense Categories</h2>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        fetchAllTransactions();
                        refresh();
                      }}
                    >
                      Refresh Data
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {expenseCategories.map(category => (
                      <div 
                        key={category.id} 
                        className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center" 
                              style={{backgroundColor: category.color}}
                            >
                              <span className="text-white font-semibold">{category.name.charAt(0)}</span>
                            </div>
                            <div className="flex flex-col">
                              <h3 className="font-medium text-base">{category.name}</h3>
                              <p className="text-sm text-gray-500">{category.transactions} transactions</p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <button 
                              onClick={() => handleEditCategory(category)}
                              className="text-gray-500 hover:text-gray-700 p-1"
                            >
                              <Pencil size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCategory(category.id!)}
                              className="text-gray-500 hover:text-red-600 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="mt-auto">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Spent: {formatCurrency(category.spent || 0)}</span>
                            <span>Budget: {formatCurrency(category.budget || 0)}</span>
                          </div>
                          <Progress 
                            value={category.budget > 0 ? Math.min((category.spent / category.budget) * 100, 100) : 0} 
                            className="h-2"
                            indicatorColor={category.color}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
                  {pieChartLoading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                      <div className="h-12 w-12 rounded-full border-4 border-t-blue-600 border-gray-200 animate-spin mb-4"></div>
                      <p className="text-gray-500">Loading chart...</p>
                    </div>
                  ) : pieChartData.length > 0 ? (
                    <div className="w-full flex flex-col items-center">
                      <CategoryChart 
                        data={pieChartData}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64">
                      <p className="text-gray-500 mb-4">No expense transactions yet</p>
                      <Button onClick={() => setIsDialogOpen(true)}>
                        Add Your First Category
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="w-full">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Income Categories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {incomeCategories.map(category => (
                    <div 
                      key={category.id}
                      className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center mr-3" 
                            style={{backgroundColor: category.color}}
                          >
                            <span className="text-white">{category.name.charAt(0)}</span>
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleEditCategory(category)}
                            className="text-gray-500 hover:text-gray-700 p-1"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(category.id!)}
                            className="text-gray-500 hover:text-red-600 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {incomeCategories.length === 0 && (
                    <div className="text-center py-6 col-span-full">
                      <p className="text-gray-500 mb-3">No income categories yet</p>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setNewCategory({...newCategory, type: 'income'});
                          setIsDialogOpen(true);
                        }}
                      >
                        Add Income Category
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <AlertDialog open={!!currentCategoryId} onOpenChange={() => setCurrentCategoryId(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this category and all its associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => currentCategoryId && handleDeleteCategory(currentCategoryId)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Categories;
