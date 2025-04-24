
import React from 'react';
import { ArrowDownRight, ArrowUpRight, CreditCard, DollarSign, Wallet } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  dateRange: string;
  amount: number;
  percentChange: number;
  type: 'income' | 'expense' | 'remaining';
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  dateRange,
  amount,
  percentChange,
  type
}) => {
  const getIcon = () => {
    switch (type) {
      case 'income':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'expense':
        return <CreditCard className="h-5 w-5 text-red-500" />;
      case 'remaining':
        return <Wallet className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'income':
        return 'bg-green-50';
      case 'expense':
        return 'bg-red-50';
      case 'remaining':
        return 'bg-blue-50';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 transition-all hover:shadow-md h-full">
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-lg ${getBgColor()}`}>
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-700 text-left">{title}</h3>
          <div className="text-xs text-gray-500 text-left mt-1">{dateRange}</div>
        </div>
      </div>
      
      <div className="text-left">
        <div className="text-2xl font-bold mb-2">
          ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        
        <div className="flex items-center gap-2">
          {percentChange > 0 ? (
            <div className="flex items-center text-green-500 text-sm font-medium">
              <ArrowUpRight className="h-4 w-4" />
              <span>{Math.abs(percentChange)}%</span>
            </div>
          ) : (
            <div className="flex items-center text-red-500 text-sm font-medium">
              <ArrowDownRight className="h-4 w-4" />
              <span>{Math.abs(percentChange)}%</span>
            </div>
          )}
          <span className="text-gray-500 text-sm">vs. last period</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
