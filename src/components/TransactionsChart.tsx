import React from 'react';
import { 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export interface ChartData {
  date: string;
  income: number;
  expenses: number;
  net?: number;
}

interface TransactionsChartProps {
  data: ChartData[];
  type?: 'area' | 'line' | 'bar';
  height?: number;
  showNet?: boolean;
  timePeriod?: string;
}

const TransactionsChart: React.FC<TransactionsChartProps> = ({ 
  data, 
  type = 'area', 
  height = 400,
  showNet = false,
  timePeriod = 'monthly'
}) => {
  const formatYAxis = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
    return `$${value}`;
  };

  const formatXAxis = (value: string) => {
    // Truncate long date labels for better display
    if (value.length > 10) {
      return value.substring(0, 10) + '...';
    }
    return value;
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const income = payload.find((p: any) => p.dataKey === 'income')?.value || 0;
      const expenses = payload.find((p: any) => p.dataKey === 'expenses')?.value || 0;
      const net = income - expenses;
      
      return (
        <div className="bg-white dark:bg-gray-800 p-4 shadow-lg rounded-lg border border-gray-200 dark:border-gray-600">
          <p className="font-medium mb-2 text-gray-900 dark:text-white">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Income: ${income.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
              <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
              Expenses: ${expenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="border-t pt-1 mt-2">
              <p className={`text-sm font-semibold flex items-center ${
                net >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className={`w-3 h-3 rounded-full mr-2 ${
                  net >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                Net: ${Math.abs(net).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const chartProps = {
    data,
    margin: { top: 20, right: 30, left: 20, bottom: 5 }
  };

  const reverseData = (data: ChartData[]) => {
    // Sort by date to ensure proper chronological order
    const sorted = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted;
  };

  const processedData = reverseData(data).map(item => ({
    ...item,
    net: item.income - item.expenses
  }));

  const handleChartClick = (data: any, index: number) => {
    if (!data) return;
    
    const chatMessage = `Here's a summary of your finances for ${data.date}:
- Income: $${data.income.toFixed(2)}
- Expenses: $${data.expenses.toFixed(2)}
- Net: $${(data.income - data.expenses).toFixed(2)}

Would you like some advice on managing your finances for this period?`;

    const chatInput = document.querySelector('.chat-input') as HTMLInputElement;
    const sendButton = document.querySelector('.chat-send-button') as HTMLButtonElement;
    
    if (chatInput && sendButton) {
      const chatToggle = document.querySelector('.chat-toggle') as HTMLButtonElement;
      if (chatToggle && !document.querySelector('.chat-window')?.classList.contains('scale-100')) {
        chatToggle.click();
      }
      
      chatInput.value = chatMessage;
      sendButton.click();
    }
  };

  const renderAreaChart = () => (
    <AreaChart {...chartProps} data={processedData} onClick={handleChartClick}>
      <defs>
        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
        </linearGradient>
        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
        </linearGradient>
        <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.2)" />
      <XAxis 
        dataKey="date" 
        tick={{ fontSize: 12, fill: '#9ca3af' }}
        tickLine={false}
        axisLine={false}
        tickFormatter={formatXAxis}
        interval={data.length > 10 ? Math.floor(data.length / 10) : 0}
      />
      <YAxis 
        tickFormatter={formatYAxis} 
        tick={{ fontSize: 12, fill: '#9ca3af' }}
        tickLine={false}
        axisLine={false}
      />
      <Tooltip content={customTooltip} />
      <Area 
        type="monotone" 
        dataKey="income" 
        stroke="#22c55e" 
        strokeWidth={2}
        fill="url(#colorIncome)" 
        activeDot={{ r: 4, stroke: '#22c55e', strokeWidth: 2 }} 
        name="Income"
      />
      <Area 
        type="monotone" 
        dataKey="expenses" 
        stroke="#ef4444" 
        strokeWidth={2}
        fill="url(#colorExpenses)" 
        activeDot={{ r: 4, stroke: '#ef4444', strokeWidth: 2 }} 
        name="Expenses"
      />
      {showNet && (
        <Area 
          type="monotone" 
          dataKey="net" 
          stroke="#3b82f6" 
          strokeWidth={2}
          fill="url(#colorNet)" 
          activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2 }} 
          name="Net"
        />
      )}
    </AreaChart>
  );

  const renderLineChart = () => (
    <LineChart {...chartProps} data={processedData} onClick={handleChartClick}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.2)" />
      <XAxis 
        dataKey="date" 
        tick={{ fontSize: 12, fill: '#9ca3af' }}
        tickLine={false}
        axisLine={{ stroke: '#4b5563' }}
        tickFormatter={formatXAxis}
        interval={data.length > 10 ? Math.floor(data.length / 10) : 0}
      />
      <YAxis 
        tickFormatter={formatYAxis} 
        tick={{ fontSize: 12, fill: '#9ca3af' }}
        tickLine={false}
        axisLine={{ stroke: '#4b5563' }}
      />
      <Tooltip content={customTooltip} />
      <Legend
        iconType="circle"
        iconSize={8}
        formatter={(value) => <span className="text-sm capitalize text-gray-600">{value}</span>}
        wrapperStyle={{ paddingTop: '10px' }}
      />
      <Line 
        type="monotone" 
        dataKey="income" 
        stroke="#22c55e" 
        strokeWidth={3}
        activeDot={{ r: 6 }} 
        name="Income"
        dot={{ stroke: '#22c55e', strokeWidth: 2, r: 4, fill: '#ffffff' }}
      />
      <Line 
        type="monotone" 
        dataKey="expenses" 
        stroke="#ef4444" 
        strokeWidth={3}
        activeDot={{ r: 6 }} 
        name="Expenses"
        dot={{ stroke: '#ef4444', strokeWidth: 2, r: 4, fill: '#ffffff' }}
      />
      {showNet && (
        <Line 
          type="monotone" 
          dataKey="net" 
          stroke="#3b82f6" 
          strokeWidth={3}
          activeDot={{ r: 6 }} 
          name="Net"
          dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4, fill: '#ffffff' }}
        />
      )}
    </LineChart>
  );

  const renderBarChart = () => (
    <BarChart {...chartProps} data={processedData} onClick={handleChartClick}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.2)" />
      <XAxis 
        dataKey="date" 
        tick={{ fontSize: 12, fill: '#9ca3af' }}
        tickLine={false}
        axisLine={{ stroke: '#4b5563' }}
        tickFormatter={formatXAxis}
        interval={data.length > 10 ? Math.floor(data.length / 10) : 0}
      />
      <YAxis 
        tickFormatter={formatYAxis} 
        tick={{ fontSize: 12, fill: '#9ca3af' }}
        tickLine={false}
        axisLine={{ stroke: '#4b5563' }}
      />
      <Tooltip content={customTooltip} />
      <Legend
        iconType="circle"
        iconSize={8}
        formatter={(value) => <span className="text-sm capitalize text-gray-600">{value}</span>}
        wrapperStyle={{ paddingTop: '10px' }}
      />
      <Bar 
        dataKey="income" 
        fill="#22c55e" 
        name="Income"
        radius={[2, 2, 0, 0]}
      />
      <Bar 
        dataKey="expenses" 
        fill="#ef4444" 
        name="Expenses"
        radius={[2, 2, 0, 0]}
      />
      {showNet && (
        <Bar 
          dataKey="net" 
          fill="#3b82f6" 
          name="Net"
          radius={[2, 2, 0, 0]}
        />
      )}
    </BarChart>
  );

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'line' ? renderLineChart() : 
         type === 'bar' ? renderBarChart() : 
         renderAreaChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionsChart;
