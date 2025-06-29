
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface CategoryStats {
  id: string;
  name: string;
  color: string;
  icon?: string;
  type: "income" | "expense";
  budget?: number;
  spent: number;
  percentage: number;
  transactions: number;
  created_at?: string;
}

export function useCategoryStats() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // Consolidated data fetching function
  const fetchData = useCallback(async () => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    // Debounce: Don't fetch if we fetched less than 1 second ago
    const now = Date.now();
    if (now - lastFetchTime < 1000) {
      return;
    }
    setLastFetchTime(now);

    try {
      setLoading(true);
      setError(null);
      
      // Fetch categories for user
      const { data: cats, error: catErr } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", user.id);

      if (catErr) throw catErr;

      // Fetch transactions for user
      const { data: txs, error: txErr } = await supabase
        .from("transactions")
        .select("id, category, category_id, amount, type, user_id")
        .eq("user_id", user.id);

      if (txErr) throw txErr;

      // Calculate spent, count, and percentages
      const expenseCategories = cats.filter((c: any) => c.type === "expense");
      const totalSpent = txs
        .filter(
          (tx: any) =>
            tx.type === "expense" &&
            (tx.category_id || tx.category) &&
            (tx.category_id ? 
              expenseCategories.find((cat) => cat.id === tx.category_id) : 
              expenseCategories.find((cat) => cat.name === tx.category))
        )
        .reduce((acc, tx: any) => acc + (typeof tx.amount === "number" ? Math.abs(tx.amount) : 0), 0);

      // Map categories with real values
      const aggregatedData: CategoryStats[] = cats.map((cat: any) => {
        // Find all transactions for this category
        const catTxs = txs.filter((tx: any) =>
          tx.category_id === cat.id ||
          (tx.category === cat.name && tx.type === cat.type)
        );
        
        const spent = cat.type === "expense"
          ? catTxs.reduce(
              (acc, tx: any) => acc + (typeof tx.amount === "number" ? Math.abs(tx.amount) : 0),
              0
            )
          : 0;
        
        const transactions = catTxs.length;
        
        // Calculate percentage based on total expenses
        let percentage = 0;
        if (cat.type === "expense" && totalSpent > 0) {
          percentage = Math.round((spent / totalSpent) * 100);
        }
        
        return {
          id: cat.id,
          name: cat.name,
          type: cat.type,
          color: cat.color || "#f97316", // Default color if none provided
          icon: cat.icon,
          budget: cat.budget || 0,
          spent,
          percentage,
          transactions,
          created_at: cat.created_at
        };
      });

      setCategories(aggregatedData);
    } catch (e: any) {
      setError(e);
      console.error("Error fetching category stats:", e);
    } finally {
      setLoading(false);
    }
  }, [user, lastFetchTime]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Custom refresh function that will reload the data
  const refresh = useCallback(async () => {
    setLastFetchTime(0); // Reset debounce for manual refresh
    await fetchData();
  }, [fetchData]);

  return { categories, loading, error, refresh };
}
