import React from 'react';
import { PencilIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Account {
  id: string | number;
  nipp: string;
  email: string;
  [key: string]: any;
}

interface ActionsCellProps {
  item: Account;
  onEdit: (account: Account) => void;
  onResetMac?: (account: Account) => void;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ item, onEdit, onResetMac }) => {
  const handleResetMac = () => {
    if (onResetMac) {
      onResetMac(item);
    } else {
      // Placeholder functionality since no API is available yet
      alert(`Reset MAC address for account: ${item.nipp}\n\nThis is a placeholder. API integration needed.`);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        className="text-primary hover:text-primary/80 transition-colors"
        onClick={() => onEdit(item)}
        title="Edit Account"
      >
        <PencilIcon className="h-4 w-4" />
      </button>
      <button
        className="text-orange-600 hover:text-orange-900 transition-colors"
        onClick={handleResetMac}
        title="Reset MAC Address"
      >
        <ArrowPathIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ActionsCell;