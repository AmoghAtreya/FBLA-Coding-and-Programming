
import { useState, useEffect } from 'react';
import { savingsGoalService } from '@/services/savingsGoalService';
import { SavingsGoal } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useSavingsGoals = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const fetchedGoals = await savingsGoalService.fetchUserGoals();
      setGoals(fetchedGoals);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch savings goals',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData: Omit<SavingsGoal, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const newGoal = await savingsGoalService.createGoal(goalData);
      setGoals(prev => [...prev, newGoal]);
      toast({
        title: 'Success',
        description: 'Savings goal created successfully'
      });
      return newGoal;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create savings goal',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const updateGoalProgress = async (goalId: string, currentAmount: number) => {
    try {
      const updatedGoal = await savingsGoalService.updateGoalProgress(goalId, currentAmount);
      setGoals(prev => prev.map(goal => goal.id === goalId ? updatedGoal : goal));
      toast({
        title: 'Progress Updated',
        description: 'Your savings goal progress has been updated'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update goal progress',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return { goals, loading, createGoal, updateGoalProgress, fetchGoals };
};
