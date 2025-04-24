import React, { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types';
import { cn } from '@/lib/utils';

interface TransactionCalendarViewProps {
  transactions: Transaction[];
}

const TransactionCalendarView: React.FC<TransactionCalendarViewProps> = ({ transactions }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Helper to get the day of the week (0 = Sunday, 6 = Saturday)
  const getDay = (date: Date) => {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1; // Adjust to make Monday the first day (0)
  };

  // Calculate weeks for the month (array of arrays, each representing a week)
  const weeks = useMemo(() => {
    const weeksArray = [];
    let week = new Array(7).fill(null);
    
    // Fill in days from previous month to start the calendar on Monday
    const firstDayOfMonth = getDay(monthStart);
    for (let i = 0; i < firstDayOfMonth; i++) {
      week[i] = null;
    }
    
    // Fill in days from current month
    days.forEach((day, index) => {
      const dayOfWeek = getDay(day);
      week[dayOfWeek] = day;
      
      // If it's the end of the week or the last day of the month, add the week to the weeks array
      if (dayOfWeek === 6 || index === days.length - 1) {
        weeksArray.push([...week]);
        week = new Array(7).fill(null);
      }
    });
    
    return weeksArray;
  }, [monthStart, days]);

  // Group transactions by date for the current month
  const transactionsByDate = useMemo(() => {
    const grouped: Record<string, { 
      count: number, 
      total: number,
      income: number,
      expense: number
    }> = {};
    
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.transaction_date || transaction.date || '');
      
      // Only include transactions from the current month
      if (isSameMonth(transactionDate, currentDate)) {
        const dateKey = format(transactionDate, 'yyyy-MM-dd');
        
        if (!grouped[dateKey]) {
          grouped[dateKey] = { 
            count: 0, 
            total: 0,
            income: 0,
            expense: 0
          };
        }
        
        grouped[dateKey].count += 1;
        grouped[dateKey].total += transaction.amount;
        
        if (transaction.amount >= 0) {
          grouped[dateKey].income += transaction.amount;
        } else {
          grouped[dateKey].expense += Math.abs(transaction.amount);
        }
      }
    });
    
    return grouped;
  }, [transactions, currentDate]);
  
  const getDayContent = (day: Date | null) => {
    if (!day) return null;
    
    const dateKey = format(day, 'yyyy-MM-dd');
    const dayTransactions = transactionsByDate[dateKey];
    const hasTransactions = dayTransactions && dayTransactions.count > 0;
    
    return (
      <div 
        className={cn(
          "h-full w-full p-1",
          isToday(day) && "bg-blue-50 rounded",
          hasTransactions && "bg-opacity-70"
        )}
      >
        <div className="flex justify-between items-start">
          <span className={cn(
            "inline-block h-6 w-6 rounded-full text-xs flex items-center justify-center",
            isToday(day) ? "bg-blue-500 text-white" : "text-gray-500"
          )}>
            {format(day, 'd')}
          </span>
        </div>
        
        {hasTransactions ? (
          <div className={cn(
            "mt-1 p-1 rounded", 
            dayTransactions.total >= 0 ? "bg-green-100" : "bg-red-100"
          )}>
            <p className={cn(
              "text-sm font-medium",
              dayTransactions.total >= 0 ? "text-green-600" : "text-red-600"
            )}>
              ${Math.abs(dayTransactions.total).toFixed(2)}
            </p>
            <p className="text-xs text-gray-600">
              {dayTransactions.count} {dayTransactions.count === 1 ? 'transaction' : 'transactions'}
            </p>
          </div>
        ) : null}
      </div>
    );
  };

  const previousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };
  
  const nextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Set to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-medium text-gray-800">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={goToToday}>
          Today
        </Button>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-7 text-sm font-medium text-gray-500 border-b pb-2 mb-1">
          <div className="text-center">Mon</div>
          <div className="text-center">Tue</div>
          <div className="text-center">Wed</div>
          <div className="text-center">Thu</div>
          <div className="text-center">Fri</div>
          <div className="text-center">Sat</div>
          <div className="text-center">Sun</div>
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-gray-100">
          {weeks.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((day, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className={cn(
                    "h-28 bg-white border border-gray-100",
                    !day && "bg-gray-50"
                  )}
                >
                  {getDayContent(day)}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t text-center text-sm text-gray-500">
        Calendar shows transactions grouped by date for the current month
      </div>
    </div>
  );
};

export default TransactionCalendarView;
