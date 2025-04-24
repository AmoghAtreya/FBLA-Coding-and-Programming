
export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date?: string;
  description?: string;
  category?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  description?: string;
  amount: number;
  type: 'income' | 'expense';
  category?: string;
  category_id?: string;
  account_name?: string;
  transaction_date?: string;
  date?: string;
  channel?: string;
  status?: string;
  created_at: string;
  updated_at?: string;
}

export interface UserSettings {
  id?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  birth_date?: string;
  theme?: string;
  currency?: string;
  notifications_enabled?: boolean;
  updated_at?: string;
  created_at?: string;
}
