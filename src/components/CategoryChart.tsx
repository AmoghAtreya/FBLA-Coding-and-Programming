import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Transaction } from '@/types';

interface CategoryChartProps {
  transactions: Transaction[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ transactions = [] }) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  // Process transactions into category data
  const categoryData = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    const categoryMap = new Map<string, number>();
    let totalExpenses = 0;

    // Process transactions, focusing on expenses for category breakdown
    transactions.forEach(transaction => {
      if (transaction.amount < 0) { // Only count expenses
        const category = transaction.category || 'Other';
        const amount = Math.abs(transaction.amount);
        categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
        totalExpenses += amount;
      }
    });

    if (totalExpenses === 0) {
      return [];
    }

    // Convert to chart data format
    const colors = [
      '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b',
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
    ];

    return Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
      percentage: Math.round((value / totalExpenses) * 100)
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  const getTips = (category: string) => {
    const tips: Record<string, string[]> = {
      'Food and Drink': [
        'Consider meal prepping to reduce eating out expenses',
        'Use grocery shopping lists to avoid impulse purchases',
        'Look for student meal deals and discounts'
      ],
      'Shopping': [
        'Wait 24 hours before making non-essential purchases',
        'Compare prices across different retailers',
        'Use student discounts when available'
      ],
      'Transportation': [
        'Consider using public transit or carpooling',
        'Look into student transit passes',
        'Plan your trips to save on fuel'
      ],
      'Entertainment': [
        'Look for free or low-cost entertainment options',
        'Use student discounts for movies and events',
        'Consider streaming services instead of individual rentals'
      ],
      'Education': [
        'Buy used textbooks or rent them',
        'Take advantage of library resources',
        'Look for online course alternatives'
      ],
      'Other': [
        'Track your spending in this category',
        'Set a monthly budget',
        'Look for ways to reduce costs'
      ]
    };
    return tips[category] || tips['Other'];
  };

  const onPieClick = (entry: any, index: number) => {
    setSelectedCategory({
      ...entry,
      tips: getTips(entry.name)
    });
  };

  // Show message if no data
  if (!categoryData || categoryData.length === 0) {
    return (
      <motion.div 
        className="h-[400px] flex items-center justify-center text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-lg">No expense data available</p>
          <p className="text-sm">Add some transactions to see your spending breakdown</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="h-[450px] relative w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              outerRadius={100}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
              onClick={onPieClick}
              className="cursor-pointer"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => {
                const formattedValue = typeof value === 'number' ? 
                  `$${value.toFixed(2)} (${props.payload.percentage}%)` : 
                  `${value} (${props.payload.percentage}%)`;
                return [formattedValue, name];
              }}
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[140px] overflow-y-auto px-2">
        {categoryData.map((entry, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-2 text-sm bg-gray-800/50 p-2 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
            onClick={() => onPieClick(entry, index)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></div>
            <div className="flex-1 min-w-0">
              <div className="truncate font-medium text-white">{entry.name}</div>
              <div className="text-gray-400 text-xs">{entry.percentage}%</div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedCategory?.color }}></div>
              {selectedCategory?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-gray-300">
                Amount spent: ${typeof selectedCategory?.value === 'number' ? 
                  selectedCategory.value.toFixed(2) : 
                  selectedCategory?.value}
              </p>
              <p className="text-gray-300">Percentage of total: {selectedCategory?.percentage}%</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-green-400">Tips to improve:</h4>
              <ul className="space-y-2">
                {selectedCategory?.tips?.map((tip: string, index: number) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 text-gray-300"
                  >
                    <span className="text-green-400">•</span>
                    {tip}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CategoryChart;
