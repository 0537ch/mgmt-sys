import React from 'react';
import { ComboBox, type ComboBoxOption } from '@/components/common/ComboBox';
import { useApiData } from '@/hooks/useApiData';
import { fetchSystemsForComboBox } from '@/api/SystemApi';

interface SystemComboBoxProps {
  value?: number;
  onValueChange?: (value: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function SystemComboBox({ 
  value, 
  onValueChange, 
  placeholder = "Select system...",
  className,
  disabled = false
}: SystemComboBoxProps) {
  const { data: systems, loading, error, refetch } = useApiData(fetchSystemsForComboBox);

  // Transform systems to ComboBox options - only use "nama" for display
  const options: ComboBoxOption[] = React.useMemo(() =>
    systems.map(system => ({
      value: system.id || 0,
      label: system.nama // Only display the name field
    })),
    [systems]
  );

  if (error) {
    return (
      <div className="w-full">
        <button
          className="w-full p-2 border border-red-300 bg-red-50 text-red-700 rounded text-sm"
          onClick={refetch}
          disabled={loading}
        >
          {loading ? 'Retrying...' : 'Failed to load systems (click to retry)'}
        </button>
      </div>
    );
  }

  return (
    <ComboBox
      options={options}
      value={value || undefined} // Ensure empty string becomes undefined
      onValueChange={(val) => onValueChange && onValueChange(val as number)}
      placeholder={placeholder}
      className={className}
      loading={loading}
      disabled={disabled}
      searchable={true}
    />
  );
}

export default SystemComboBox;