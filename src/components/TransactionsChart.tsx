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
}

interface TransactionsChartProps {
  data: ChartData[];
  type?: 'area' | 'line' | 'bar';
}

const TransactionsChart: React.FC<TransactionsChartProps> = ({ data, type = 'area' }) => {
  const formatYAxis = (value: number) => {
    if (value >= 1000) return `$${value / 1000}k`;
    return `$${value}`;
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
          <p className="font-medium mb-2">{label}</p>
          <p className="text-sm text-green-600">
            Income: ${payload[0].value.toFixed(2)}
          </p>
          <p className="text-sm text-red-600">
            Expenses: ${payload[1].value.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  const chartProps = {
    data,
    margin: { top: 10, right: 10, left: 0, bottom: 0 }
  };

  const reverseData = (data: ChartData[]) => [...data].reverse();

  const handleChartClick = (data: any, index: number) => {
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
    <AreaChart {...chartProps} data={reverseData(data)} onClick={handleChartClick}>
      <defs>
        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
      <XAxis 
        dataKey="date" 
        tick={{ fontSize: 12, fill: '#6b7280' }}
        tickLine={false}
        axisLine={{ stroke: '#e5e7eb' }}
      />
      <YAxis 
        tickFormatter={formatYAxis} 
        tick={{ fontSize: 12, fill: '#6b7280' }}
        tickLine={false}
        axisLine={{ stroke: '#e5e7eb' }}
      />
      <Tooltip content={customTooltip} />
      <Legend
        iconType="circle"
        iconSize={8}
        formatter={(value) => <span className="text-sm capitalize">{value}</span>}
        wrapperStyle={{ paddingTop: '10px' }}
      />
      <Area 
        type="monotone" 
        dataKey="income" 
        stroke="#22c55e" 
        strokeWidth={2}
        fill="url(#colorIncome)" 
        activeDot={{ r: 6 }} 
        name="Income"
      />
      <Area 
        type="monotone" 
        dataKey="expenses" 
        stroke="#ef4444" 
        strokeWidth={2}
        fill="url(#colorExpenses)" 
        activeDot={{ r: 6 }} 
        name="Expenses"
      />
    </AreaChart>
  );

  const renderLineChart = () => (
    <LineChart {...chartProps} data={reverseData(data)} onClick={handleChartClick}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
      <XAxis 
        dataKey="date" 
        tick={{ fontSize: 12, fill: '#6b7280' }}
        tickLine={false}
        axisLine={{ stroke: '#e5e7eb' }}
      />
      <YAxis 
        tickFormatter={formatYAxis} 
        tick={{ fontSize: 12, fill: '#6b7280' }}
        tickLine={false}
        axisLine={{ stroke: '#e5e7eb' }}
      />
      <Tooltip content={customTooltip} />
      <Legend
        iconType="circle"
        iconSize={8}
        formatter={(value) => <span className="text-sm capitalize">{value}</span>}
        wrapperStyle={{ paddingTop: '10px' }}
      />
      <Line 
        type="monotone" 
        dataKey="income" 
        stroke="#22c55e" 
        strokeWidth={2}
        activeDot={{ r: 6 }} 
        name="Income"
        dot={{ stroke: '#22c55e', strokeWidth: 2, r: 4, fill: 'white' }}
      />
      <Line 
        type="monotone" 
        dataKey="expenses" 
        stroke="#ef4444" 
        strokeWidth={2}
        activeDot={{ r: 6 }} 
        name="Expenses"
        dot={{ stroke: '#ef4444', strokeWidth: 2, r: 4, fill: 'white' }}
      />
    </LineChart>
  );

  const renderBarChart = () => (
    <BarChart {...chartProps} data={reverseData(data)} onClick={handleChartClick}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
      <XAxis 
        dataKey="date" 
        tick={{ fontSize: 12, fill: '#6b7280' }}
        tickLine={false}
        axisLine={{ stroke: '#e5e7eb' }}
      />
      <YAxis 
        tickFormatter={formatYAxis} 
        tick={{ fontSize: 12, fill: '#6b7280' }}
        tickLine={false}
        axisLine={{ stroke: '#e5e7eb' }}
      />
      <Tooltip content={customTooltip} />
      <Legend
        iconType="circle"
        iconSize={8}
        formatter={(value) => <span className="text-sm capitalize">{value}</span>}
        wrapperStyle={{ paddingTop: '10px' }}
      />
      <Bar 
        dataKey="income" 
        fill="#22c55e" 
        name="Income"
        radius={[4, 4, 0, 0]}
      />
      <Bar 
        dataKey="expenses" 
        fill="#ef4444" 
        name="Expenses"
        radius={[4, 4, 0, 0]}
      />
    </BarChart>
  );

  return (
    <div className="h-[400px] w-full bg-white p-4 rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'line' ? renderLineChart() : 
         type === 'bar' ? renderBarChart() : 
         renderAreaChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default TransactionsChart;
