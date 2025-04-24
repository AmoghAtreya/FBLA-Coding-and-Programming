/**
 * Savings Goals Page
 * 
 * Manages user's savings goals and tracks progress.
 * Features:
 * - Create new savings goals
 * - Track progress towards goals
 * - Visual progress indicators
 * - Suggested weekly savings calculations
 * - Goal completion tracking
 * - Interactive goal cards
 * 
 * Uses the savingsGoals context for managing goals state and actions.
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useSavingsGoals } from '@/hooks/useSavingsGoals';
import { formatCurrency } from '@/utils/formatters';
import { PlusIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SavingsGoal } from '@/types';

const SavingsGoalsPage: React.FC = () => {
  const { goals, createGoal, updateGoalProgress } = useSavingsGoals();
  const [newGoal, setNewGoal] = useState({
    name: '',
    target_amount: 0,
    description: '',
    target_date: '',
  });

  const handleCreateGoal = async () => {
    await createGoal({
      ...newGoal,
      current_amount: 0,
      is_completed: false,
    });
    setNewGoal({ name: '', target_amount: 0, description: '', target_date: '' });
  };

  const calculateProgress = (goal: SavingsGoal) => {
    return Math.min((goal.current_amount / goal.target_amount) * 100, 100);
  };

  const calculateWeeklySavings = (goal: SavingsGoal) => {
    if (!goal.target_date) return null;
    const targetDate = new Date(goal.target_date);
    const today = new Date();
    const weeksRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    if (weeksRemaining <= 0) return null;
    
    const amountToSave = goal.target_amount - goal.current_amount;
    return Math.ceil(amountToSave / weeksRemaining);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Savings Goals</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" /> New Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Savings Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input 
                placeholder="Goal Name" 
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
              />
              <Input 
                type="number" 
                placeholder="Target Amount" 
                value={newGoal.target_amount}
                onChange={(e) => setNewGoal({...newGoal, target_amount: Number(e.target.value)})}
              />
              <Input 
                type="date" 
                placeholder="Target Date"
                value={newGoal.target_date}
                onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
              />
              <Input 
                placeholder="Description (Optional)" 
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
              />
              <Button onClick={handleCreateGoal} className="w-full">Create Goal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="w-full">
            <CardHeader>
              <CardTitle>{goal.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-muted-foreground mb-2">
                  <span>Progress</span>
                  <span>
                    {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                  </span>
                </div>
                <Progress value={calculateProgress(goal)} />
              </div>
              {goal.target_date && (
                <div className="text-sm text-muted-foreground mb-2">
                  Target Date: {new Date(goal.target_date).toLocaleDateString()}
                </div>
              )}
              {calculateWeeklySavings(goal) && (
                <div className="text-sm text-muted-foreground">
                  Suggested Weekly Savings: {formatCurrency(calculateWeeklySavings(goal))}
                </div>
              )}
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => {
                  const additionalAmount = prompt('Enter amount to save:');
                  if (additionalAmount) {
                    updateGoalProgress(goal.id, goal.current_amount + Number(additionalAmount));
                  }
                }}
              >
                Add Savings
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavingsGoalsPage;
