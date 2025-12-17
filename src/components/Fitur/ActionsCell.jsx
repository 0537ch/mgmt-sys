import React from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';

const ActionsCell = ({ item, onEdit }) => {
  return (
    <button className="text-blue-600 hover:text-blue-900" onClick={() => onEdit(item)}>
      <PencilIcon className="h-4 w-4" />
    </button>
  );
};

export default ActionsCell;