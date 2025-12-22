import React from 'react';
import { ComboBox, type ComboBoxOption } from '@/components/common/ComboBox';
import { useApiData } from '@/hooks/useApiData';
import { fetchMenuGroupSelect } from '@/api/menugroupApi';

interface MenuGroupComboBoxProps {
  value?: number;
  onValueChange?: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MenuGroupComboBox({ 
  value, 
  onValueChange, 
  placeholder = "Select menu group...",
  className,
  disabled = false
}: MenuGroupComboBoxProps) {
  const { data: menuGroups, loading, error, refetch } = useApiData(fetchMenuGroupSelect);

  // Debug logging
  React.useEffect(() => {
    console.log('Menu groups data:', menuGroups);
    console.log('Loading:', loading);
    console.log('Error:', error);
  }, [menuGroups, loading, error]);

  // Transform menu groups to ComboBox options
  const options: ComboBoxOption[] = React.useMemo(() => 
    menuGroups.map(menuGroup => ({
      value: menuGroup.id || 0,
      label: menuGroup.nama || menuGroup.label || 'Unknown' // Use nama or label field
    })),
    [menuGroups]
  );

  if (error) {
    return (
      <div className="w-[200px]">
        <button 
          className="w-full p-2 border border-red-300 bg-red-50 text-red-700 rounded text-sm"
          onClick={refetch}
          disabled={loading}
        >
          {loading ? 'Retrying...' : 'Failed to load menu groups (click to retry)'}
        </button>
      </div>
    );
  }

  return (
    <ComboBox
      options={options}
      value={value}
      onValueChange={(val) => onValueChange && onValueChange(val as number)}
      placeholder={placeholder}
      className={className}
      loading={loading}
      disabled={disabled}
      searchable={true}
    />
  );
}

export default MenuGroupComboBox;
