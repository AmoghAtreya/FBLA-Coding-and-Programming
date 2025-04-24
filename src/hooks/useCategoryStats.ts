
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch categories for user
        const { data: cats, error: catErr } = await supabase
          .from("categories")
          .select("*")
          .eq("user_id", user.id);

        if (catErr) throw catErr;

        // Fetch transactions for user (we'll aggregate locally)
        const { data: txs, error: txErr } = await supabase
          .from("transactions")
          .select("id, category, category_id, amount, type, user_id")
          .eq("user_id", user.id);

        if (txErr) throw txErr;

        // Calculate spent, count, and percentages per expense category
        const expenseCategories = cats.filter((c: any) => c.type === "expense");
        const totalSpent = txs
          .filter(
            (tx: any) =>
              tx.type === "expense" &&
              tx.category_id &&
              expenseCategories.find((cat) => cat.id === tx.category_id)
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
          
          // Calculate percentage based on total expenses or budget
          let percentage = 0;
          if (cat.type === "expense") {
            if (totalSpent > 0) {
              // Calculate as percentage of total spending
              percentage = Math.round((spent / totalSpent) * 100);
            }
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
      }
      setLoading(false);
    };

    fetchData();
  }, [user]);

  // Custom refresh function that will reload the data
  const refresh = async () => {
    if (user) {
      try {
        setLoading(true);
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
        console.error("Error refreshing category stats:", e);
      } finally {
        setLoading(false);
      }
    }
  };

  return { categories, loading, error, refresh };
}
