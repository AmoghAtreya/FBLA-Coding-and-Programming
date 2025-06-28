import { CategoryStats } from "@/hooks/useCategoryStats";
import { Transaction } from "@/types";

const GEMINI_API_KEY = "AIzaSyAImXEl2c6IhS98CnzPlKzK40GmitaBMxk";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

interface BudgetSuggestion {
  categoryId: string;
  categoryName: string;
  suggestedBudget: number;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
}

interface AIBudgetAnalysis {
  overallRecommendation: string;
  categorySuggestions: BudgetSuggestion[];
  spendingInsights: string[];
  warningAreas: string[];
  optimizationTips: string[];
}

export const generateBudgetSuggestions = async (
  monthlyIncome: number,
  categories: CategoryStats[],
  recentTransactions: Transaction[]
): Promise<AIBudgetAnalysis> => {
  try {
    // Prepare spending analysis data
    const spendingAnalysis = analyzeSpendingPatterns(categories, recentTransactions);
    
    const prompt = `
You are a professional financial advisor AI. Analyze the following financial data and provide detailed budget recommendations:

MONTHLY INCOME: $${monthlyIncome}

CURRENT CATEGORIES AND SPENDING:
${categories.map(cat => `
- ${cat.name} (${cat.type}): 
  * Current Budget: $${cat.budget || 0}
  * Actual Spent: $${cat.spent}
  * Transactions: ${cat.transactions}
  * Percentage of Total: ${cat.percentage}%
`).join('')}

SPENDING PATTERNS:
${spendingAnalysis}

RECENT TRANSACTION TRENDS:
- Total Transactions: ${recentTransactions.length}
- Average Transaction: $${recentTransactions.length > 0 ? (recentTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / recentTransactions.length).toFixed(2) : 0}
- Expense Categories: ${categories.filter(c => c.type === 'expense').length}
- Income Categories: ${categories.filter(c => c.type === 'income').length}

Please provide a comprehensive budget analysis in JSON format with the following structure:
{
  "overallRecommendation": "Brief overall financial advice (2-3 sentences)",
  "categorySuggestions": [
    {
      "categoryId": "category_id",
      "categoryName": "category_name",
      "suggestedBudget": 500,
      "reasoning": "Why this amount is recommended",
      "priority": "high|medium|low"
    }
  ],
  "spendingInsights": ["insight1", "insight2", "insight3"],
  "warningAreas": ["warning1", "warning2"],
  "optimizationTips": ["tip1", "tip2", "tip3", "tip4"]
}

Focus on:
1. 50/30/20 rule adaptation for their specific situation
2. Areas where they're overspending or underspending
3. Realistic budget allocations based on their history
4. Emergency fund recommendations
5. Optimization opportunities
6. Risk areas that need attention

Be specific, actionable, and consider their actual spending patterns.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates[0]?.content?.parts[0]?.text;
    
    if (!aiResponse) {
      throw new Error('No response from Gemini API');
    }

    // Parse the JSON response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }

    const parsedResponse: AIBudgetAnalysis = JSON.parse(jsonMatch[0]);
    
    // Validate and enhance the response
    return {
      ...parsedResponse,
      categorySuggestions: parsedResponse.categorySuggestions.map(suggestion => ({
        ...suggestion,
        suggestedBudget: Math.max(0, suggestion.suggestedBudget) // Ensure positive budgets
      }))
    };

  } catch (error) {
    console.error('Error generating AI budget suggestions:', error);
    
    // Fallback to rule-based suggestions
    return generateFallbackSuggestions(monthlyIncome, categories);
  }
};

const analyzeSpendingPatterns = (categories: CategoryStats[], transactions: Transaction[]): string => {
  const totalSpent = categories.filter(c => c.type === 'expense').reduce((sum, c) => sum + c.spent, 0);
  const topSpendingCategories = categories
    .filter(c => c.type === 'expense')
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);

  const recentTrends = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category || 'Other';
      acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
      return acc;
    }, {} as Record<string, number>);

  return `
- Total Monthly Spending: $${totalSpent}
- Top 3 Spending Categories: ${topSpendingCategories.map(c => `${c.name} ($${c.spent})`).join(', ')}
- Categories with High Transaction Frequency: ${categories.filter(c => c.transactions > 10).map(c => c.name).join(', ')}
- Recent Spending Distribution: ${Object.entries(recentTrends).slice(0, 5).map(([cat, amount]) => `${cat}: $${amount}`).join(', ')}
  `;
};

const generateFallbackSuggestions = (monthlyIncome: number, categories: CategoryStats[]): AIBudgetAnalysis => {
  const expenseCategories = categories.filter(c => c.type === 'expense');
  
  return {
    overallRecommendation: `Based on your $${monthlyIncome} monthly income, I recommend following the 50/30/20 rule: 50% for needs ($${(monthlyIncome * 0.5).toFixed(2)}), 30% for wants ($${(monthlyIncome * 0.3).toFixed(2)}), and 20% for savings ($${(monthlyIncome * 0.2).toFixed(2)}).`,
    categorySuggestions: expenseCategories.map(category => ({
      categoryId: category.id,
      categoryName: category.name,
      suggestedBudget: Math.max(category.spent * 1.1, monthlyIncome * 0.05), // 10% above current spending or 5% of income
      reasoning: `Based on your current spending of $${category.spent}, this allows for some flexibility while maintaining control.`,
      priority: category.spent > monthlyIncome * 0.1 ? 'high' : 'medium'
    })),
    spendingInsights: [
      `You have ${expenseCategories.length} expense categories to manage`,
      `Your largest expense category represents ${expenseCategories.length > 0 ? Math.max(...expenseCategories.map(c => c.percentage)) : 0}% of total spending`,
      'Consider reviewing categories with zero transactions for potential consolidation'
    ],
    warningAreas: [
      'Ensure you have an emergency fund covering 3-6 months of expenses',
      'Review any categories where spending exceeds 25% of income'
    ],
    optimizationTips: [
      'Set up automatic transfers to savings accounts',
      'Review and categorize all transactions monthly',
      'Consider using the envelope budgeting method for discretionary spending',
      'Track your progress weekly to stay on target'
    ]
  };
};

export const generateSpendingInsights = async (transactions: Transaction[]): Promise<string[]> => {
  if (transactions.length === 0) return ['No transaction data available for analysis.'];
  
  try {
    const prompt = `
Analyze these financial transactions and provide 3-4 key spending insights:

TRANSACTION DATA:
${transactions.slice(0, 50).map(t => `
- ${t.description || 'Transaction'}: $${t.amount} (${t.type}) - ${t.category || 'Uncategorized'}
`).join('')}

Total Transactions: ${transactions.length}
Total Expenses: $${transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0)}
Total Income: $${transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)}

Provide insights as a JSON array of strings: ["insight1", "insight2", "insight3"]
Focus on patterns, trends, and actionable observations.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1024,
        }
      })
    });

    const data = await response.json();
    const aiResponse = data.candidates[0]?.content?.parts[0]?.text;
    
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return ['AI analysis temporarily unavailable.'];
  } catch (error) {
    console.error('Error generating spending insights:', error);
    return ['Unable to generate spending insights at this time.'];
  }
}; 