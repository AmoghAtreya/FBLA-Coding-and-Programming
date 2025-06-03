import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface AccountSelectorProps {
  accounts: string[];
  defaultSelected: string;
  onSelect: (account: string) => void;
}

const AccountSelector: React.FC<AccountSelectorProps> = ({
  accounts,
  defaultSelected,
  onSelect
}) => {
  const [selected, setSelected] = useState(defaultSelected);

  const handleSelect = (account: string) => {
    setSelected(account);
    onSelect(account);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-white">
          <span className="font-medium">{selected}</span>
          <ChevronDown size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-gray-800 shadow-lg border border-gray-600 rounded-lg p-1">
        {accounts.map(account => (
          <DropdownMenuItem
            key={account}
            className={cn(
              "flex items-center justify-between cursor-pointer rounded-md px-3 py-2 text-sm",
              selected === account ? "bg-green-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
            )}
            onClick={() => handleSelect(account)}
          >
            {account}
            {selected === account && (
              <Check size={16} className="text-white" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountSelector;
