
import { supabase } from "@/integrations/supabase/client";
import { SavingsGoal } from "@/types";

export const savingsGoalService = {
  async createGoal(goal: Omit<SavingsGoal, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('savings_goals')
      .insert({
        ...goal,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async fetchUserGoals() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;
    return data as SavingsGoal[];
  },

  async updateGoalProgress(goalId: string, currentAmount: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('savings_goals')
      .update({ current_amount: currentAmount })
      .eq('id', goalId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
