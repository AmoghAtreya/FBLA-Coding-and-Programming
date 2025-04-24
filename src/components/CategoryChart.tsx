
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CategoryChartProps {
  data: {
    name: string;
    value: number;
    color: string;
    percentage: number;
  }[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const RADIAN = Math.PI / 180;

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
      // Add more categories as needed
    };
    return tips[category] || ['Track your spending in this category', 'Set a monthly budget', 'Look for ways to reduce costs'];
  };

  const onPieClick = (entry: any, index: number) => {
    setSelectedCategory({
      ...entry,
      tips: getTips(entry.name)
    });
  };

  return (
    <motion.div 
      className="h-[550px] relative w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              outerRadius={130}
              innerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
              onClick={onPieClick}
              className="cursor-pointer"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => {
                // Format the value based on its type
                const formattedValue = typeof value === 'number' ? 
                  `$${value.toFixed(2)} (${props.payload.percentage}%)` : 
                  `${value} (${props.payload.percentage}%)`;
                return [formattedValue, name];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[180px] overflow-y-auto px-2">
        {data.map((entry, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => onPieClick(entry, index)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></div>
            <div className="flex-1 min-w-0">
              <div className="truncate font-medium text-gray-900">{entry.name}</div>
              <div className="text-gray-500 text-xs">{entry.percentage}%</div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedCategory?.color }}></div>
              {selectedCategory?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">
                Amount spent: ${typeof selectedCategory?.value === 'number' ? 
                  selectedCategory.value.toFixed(2) : 
                  selectedCategory?.value}
              </p>
              <p className="text-gray-600">Percentage of total: {selectedCategory?.percentage}%</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Tips to improve:</h4>
              <ul className="space-y-2">
                {selectedCategory?.tips.map((tip: string, index: number) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 text-gray-600"
                  >
                    <span className="text-blue-500">•</span>
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
