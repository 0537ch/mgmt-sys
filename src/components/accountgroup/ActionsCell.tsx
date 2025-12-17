import React from 'react';
import { PencilIcon,ListBulletIcon,PuzzlePieceIcon } from '@heroicons/react/24/outline';

interface AccGroupItem {
  id?: number;
  namaGroup?: string;
  codeGroup?: string;
  idSistem?: string;
  isAdministrator?: boolean;
  status?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

interface ActionsCellProps {
  item: AccGroupItem;
  onEdit: (item: AccGroupItem) => void;
  onShowSettingmenu: (item: AccGroupItem) => void;
  onShowSettingFeature: (item: AccGroupItem) => void;
}

const ActionsCell: React.FC<ActionsCellProps> = ({ item, onEdit, onShowSettingmenu, onShowSettingFeature }) => {
  return (
    <div>
      <button
        className="text-blue-600 hover:text-blue-900"
        onClick={() => onEdit(item)}
      >
        <PencilIcon className="h-4 w-4" />
      </button>
        <button
          className="hover:text-purple-900 text-purple-600 px-2 "
          onClick={() => onShowSettingmenu(item)}
        >
          <ListBulletIcon className="h-4 w-4" />
        </button>
        <button
          className="text-green-600 hover:text-green-900"
          onClick={() => onShowSettingFeature(item)}
        >
          <PuzzlePieceIcon className="h-4 w-4"/>
        </button>
    </div>
  );
};

export default ActionsCell;