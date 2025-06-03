import { supabase } from "../integrations/supabase/client";
import { Transaction } from "../types";

// Function to get all transactions for the authenticated user
export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("User not authenticated");
    }

    // Try with 'date' column first, fallback to 'transaction_date' if needed
    let { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false });

    // If 'date' column doesn't exist, try 'transaction_date'
    if (error && error.code === '42703') {
      const { data: retryData, error: retryError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('transaction_date', { ascending: false });
      
      data = retryData;
      error = retryError;
    }

    // If both fail, try without ordering
    if (error && error.code === '42703') {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session.user.id);
      
      data = fallbackData;
      error = fallbackError;
    }

    if (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }

    // Ensure the type field is correctly cast to "income" | "expense"
    const typedData = data?.map(item => {
      const itemAny = item as any; // Type assertion to access flexible properties
      return {
        ...item,
        // Ensure type is either "income" or "expense"
        type: (item.type === "income" || item.type === "expense") 
          ? (item.type as "income" | "expense") 
          : (item.amount >= 0 ? "income" as const : "expense" as const),
        date: itemAny.date || item.transaction_date || item.created_at, // Flexible date handling
        channel: itemAny.channel || item.account_name, // Flexible channel handling
        transaction_date: itemAny.date || item.transaction_date || item.created_at // Ensure transaction_date exists
      };
    }) || [];

    // Sort by date if we couldn't order in the query
    return typedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

// Function to create a new transaction
export const createTransaction = async (transaction: Partial<Transaction>): Promise<Transaction> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("User not authenticated");
    }

    // Ensure required fields are present
    const newTransaction = {
      ...transaction,
      user_id: session.user.id,
      created_at: new Date().toISOString(),
      // Ensure amount is not undefined
      amount: transaction.amount || 0,
      // Ensure type is a valid value
      type: (transaction.type === "income" || transaction.type === "expense") 
        ? transaction.type 
        : "expense"
    };

    // Remove non-existent columns before sending to the database
    delete (newTransaction as any).account_id;

    const { data, error } = await supabase
      .from('transactions')
      .insert(newTransaction)
      .select()
      .single();

    if (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }

    // Update the account balance based on the transaction
    if (transaction.account_name) {
      try {
        // Get the account by name
        const { data: accountData, error: accountError } = await supabase
          .from('accounts')
          .select('id, balance')
          .eq('name', transaction.account_name)
          .eq('user_id', session.user.id)
          .single();

        if (!accountError && accountData) {
          // Update the account balance
          const newBalance = parseFloat(accountData.balance?.toString() || '0') + parseFloat(String(transaction.amount || 0));
          
          await supabase
            .from('accounts')
            .update({ balance: newBalance })
            .eq('id', accountData.id);
        }
      } catch (accError) {
        console.error("Error updating account balance:", accError);
        // Don't throw this error, just log it - the transaction was still created
      }
    }

    // Ensure the returned data has the correct type
    return {
      ...data,
      type: data.type === "income" ? "income" : "expense",
      date: data.transaction_date,
      channel: data.account_name
    } as Transaction;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
};

// Function to update a transaction
export const updateTransaction = async (id: string, updates: Record<string, any>): Promise<Transaction> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("User not authenticated");
    }

    // Get the original transaction to calculate the balance difference
    const { data: originalTransaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error("Error fetching original transaction:", fetchError);
      throw fetchError;
    }

    // Map any potential client-side field names to database field names
    const mappedUpdates: Record<string, any> = {};
    
    // Map field names
    if (updates.accountName !== undefined) {
      mappedUpdates.account_name = updates.accountName;
    }
    if (updates.channel !== undefined) {
      mappedUpdates.account_name = updates.channel;
    }
    if (updates.date !== undefined) {
      mappedUpdates.transaction_date = updates.date;
    }
    
    // Add all other fields directly
    Object.keys(updates).forEach(key => {
      if (!['accountName', 'channel', 'date', 'account_id'].includes(key)) {
        mappedUpdates[key] = updates[key];
      }
    });

    // Remove non-existent columns before sending to the database
    delete mappedUpdates.account_id;

    const { data, error } = await supabase
      .from('transactions')
      .update(mappedUpdates)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }

    // Update account balances if needed
    try {
      const oldAmount = originalTransaction.amount || 0;
      const newAmount = updates.amount !== undefined ? updates.amount : oldAmount;
      const amountDifference = newAmount - oldAmount;
      
      // If there's an amount difference or the account changed, we need to update account balance(s)
      if (amountDifference !== 0 || 
          (updates.account_name && updates.account_name !== originalTransaction.account_name)) {
        
        // If account changed, subtract amount from old account
        if (updates.account_name && updates.account_name !== originalTransaction.account_name) {
          // Reverse the original transaction's effect on the old account
          const { data: oldAccount, error: oldAccountError } = await supabase
            .from('accounts')
            .select('id, balance')
            .eq('name', originalTransaction.account_name)
            .eq('user_id', session.user.id)
            .single();
            
          if (!oldAccountError && oldAccount) {
            const oldAccountBalance = parseFloat(oldAccount.balance?.toString() || '0') - parseFloat(String(oldAmount));
            await supabase
              .from('accounts')
              .update({ balance: oldAccountBalance })
              .eq('id', oldAccount.id);
          }
          
          // Add the new amount to the new account
          const { data: newAccount, error: newAccountError } = await supabase
            .from('accounts')
            .select('id, balance')
            .eq('name', updates.account_name)
            .eq('user_id', session.user.id)
            .single();
            
          if (!newAccountError && newAccount) {
            const newAccountBalance = parseFloat(newAccount.balance?.toString() || '0') + parseFloat(String(newAmount));
            await supabase
              .from('accounts')
              .update({ balance: newAccountBalance })
              .eq('id', newAccount.id);
          }
        } else {
          // Just update the existing account with the difference
          const accountName = updates.account_name || originalTransaction.account_name;
          
          const { data: account, error: accountError } = await supabase
            .from('accounts')
            .select('id, balance')
            .eq('name', accountName)
            .eq('user_id', session.user.id)
            .single();
            
          if (!accountError && account) {
            const updatedBalance = parseFloat(account.balance?.toString() || '0') + parseFloat(String(amountDifference));
            await supabase
              .from('accounts')
              .update({ balance: updatedBalance })
              .eq('id', account.id);
          }
        }
      }
    } catch (accError) {
      console.error("Error updating account balance on transaction update:", accError);
      // Don't throw this error, just log it - the transaction was still updated
    }

    // Ensure the returned data has the correct type
    return {
      ...data,
      type: data.type === "income" ? "income" : "expense",
      date: data.transaction_date,
      channel: data.account_name
    } as Transaction;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

// Function to delete a transaction
export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("User not authenticated");
    }

    // Get the transaction details before deleting
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error("Error fetching transaction for deletion:", fetchError);
      throw fetchError;
    }

    // Delete the transaction
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }

    // Update the account balance
    try {
      if (transaction.account_name) {
        // Get the account by name
        const { data: accountData, error: accountError } = await supabase
          .from('accounts')
          .select('id, balance')
          .eq('name', transaction.account_name)
          .eq('user_id', session.user.id)
          .single();

        if (!accountError && accountData) {
          // Reverse the effect of the transaction on the account balance
          const newBalance = parseFloat(accountData.balance?.toString() || '0') - parseFloat(String(transaction.amount));
          
          await supabase
            .from('accounts')
            .update({ balance: newBalance })
            .eq('id', accountData.id);
        }
      }
    } catch (accError) {
      console.error("Error updating account balance on transaction deletion:", accError);
      // We've already deleted the transaction, so just log this error
    }
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

// Function to get transaction statistics
export const getTransactionStats = async (
  startDate: string,
  endDate: string
): Promise<{ totalIncome: number; totalExpenses: number }> => {
  try {
    const transactions = await getTransactions();
    
    const filteredTransactions = transactions.filter(
      (transaction) => {
        const date = new Date(transaction.transaction_date || transaction.date || '');
        return date >= new Date(startDate) && date <= new Date(endDate);
      }
    );

    const stats = filteredTransactions.reduce(
      (acc, transaction) => {
        if (transaction.amount > 0) {
          acc.totalIncome += transaction.amount;
        } else {
          acc.totalExpenses += Math.abs(transaction.amount);
        }
        return acc;
      },
      { totalIncome: 0, totalExpenses: 0 }
    );

    return stats;
  } catch (error) {
    console.error("Error getting transaction stats:", error);
    throw error;
  }
};
