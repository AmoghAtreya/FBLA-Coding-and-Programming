
import { supabase } from "@/integrations/supabase/client";

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  accountNumber?: string;
  icon: string;
  color: string;
  user_id?: string;
  created_at?: string;
}

// Fetch all accounts for the current user
export const fetchAccounts = async () => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*');
  
  if (error) throw error;
  
  const formattedAccounts = data.map(account => ({
    id: account.id,
    name: account.name,
    type: account.type,
    balance: parseFloat(account.balance?.toString() || '0'),
    accountNumber: `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
    icon: account.icon || 'CreditCard',
    color: account.color || '#3b82f6',
    user_id: account.user_id,
    created_at: account.created_at
  }));

  return formattedAccounts;
};

// Add a new account
export const addAccount = async (account: Omit<Account, 'id' | 'user_id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('accounts')
    .insert({
      name: account.name,
      type: account.type,
      balance: account.balance,
      icon: account.icon,
      color: account.color,
      user_id: (await supabase.auth.getUser()).data.user?.id
    })
    .select();

  if (error) throw error;
  return data[0];
};

// Update account balance
export const updateAccountBalance = async (id: string, amount: number) => {
  // First get current balance
  const { data: currentData, error: fetchError } = await supabase
    .from('accounts')
    .select('balance')
    .eq('id', id)
    .single();
  
  if (fetchError) throw fetchError;
  
  const newBalance = parseFloat(currentData.balance?.toString() || '0') + amount;
  
  const { data, error } = await supabase
    .from('accounts')
    .update({ balance: newBalance })
    .eq('id', id)
    .select();

  if (error) throw error;
  return data[0];
};

// Delete an account
export const deleteAccount = async (id: string) => {
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};
