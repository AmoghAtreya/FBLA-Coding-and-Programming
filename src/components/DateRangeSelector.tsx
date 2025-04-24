
import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type DateRangePreset = 'today' | 'yesterday' | '7days' | '30days' | 'thisYear' | 'allTime' | 'custom';

interface DateRangeSelectorProps {
  startDate: Date;
  endDate: Date;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  onPresetChange?: (preset: DateRangePreset) => void;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ 
  startDate,
  endDate,
  onDateRangeChange,
  onPresetChange
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentPreset, setCurrentPreset] = useState<DateRangePreset>('30days');
  const [tempDateRange, setTempDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: startDate,
    to: endDate,
  });

  const handlePresetSelect = (preset: DateRangePreset) => {
    setCurrentPreset(preset);
    if (preset !== 'custom' && onPresetChange) {
      onPresetChange(preset);
    } else if (preset === 'custom') {
      setIsCalendarOpen(true);
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return;

    const range = {
      from: tempDateRange.from,
      to: tempDateRange.to,
    };

    if (!range.from || range.to) {
      range.from = date;
      range.to = undefined;
    } else {
      if (date < range.from) {
        range.to = range.from;
        range.from = date;
      } else {
        range.to = date;
      }
    }

    setTempDateRange(range);

    if (range.from && range.to) {
      onDateRangeChange(range.from, range.to);
      setCurrentPreset('custom');
      setIsCalendarOpen(false);
    }
  };

  const getDisplayText = () => {
    switch (currentPreset) {
      case 'today':
        return 'Today';
      case 'yesterday':
        return 'Yesterday';
      case '7days':
        return 'Last 7 days';
      case '30days':
        return 'Last 30 days';
      case 'thisYear':
        return 'This year';
      case 'allTime':
        return 'All time';
      case 'custom':
        return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`;
      default:
        return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`;
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-10 text-sm">
            <CalendarIcon className="h-4 w-4 mr-2" />
            {getDisplayText()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white p-0">
          <DropdownMenuItem onClick={() => handlePresetSelect('today')} className="cursor-pointer">
            Today
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePresetSelect('yesterday')} className="cursor-pointer">
            Yesterday
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePresetSelect('7days')} className="cursor-pointer">
            Last 7 days
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePresetSelect('30days')} className="cursor-pointer">
            Last 30 days
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePresetSelect('thisYear')} className="cursor-pointer">
            This year
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handlePresetSelect('allTime')} className="cursor-pointer">
            All time
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button 
        variant="outline" 
        className="h-10 text-sm" 
        onClick={() => setIsCalendarOpen(true)}
      >
        Custom Range
      </Button>

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="sr-only">
            Open Calendar
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white" align="start">
          <Calendar
            mode="range"
            defaultMonth={tempDateRange.from}
            selected={{
              from: tempDateRange.from,
              to: tempDateRange.to,
            }}
            onSelect={(range) => {
              if (range?.from) handleCalendarSelect(range.from);
              if (range?.to) handleCalendarSelect(range.to);
            }}
            numberOfMonths={2}
            initialFocus
            className="pointer-events-auto"
          />
          <div className="p-3 border-t border-gray-200 flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCalendarOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (tempDateRange.from && tempDateRange.to) {
                  onDateRangeChange(tempDateRange.from, tempDateRange.to);
                  setIsCalendarOpen(false);
                }
              }}
              disabled={!tempDateRange.from || !tempDateRange.to}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangeSelector;
