import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import type { WorkBook } from 'xlsx';
import { ArrowDownTrayIcon, ArrowPathIcon, PlusIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

// Define TypeScript interfaces for the DataTable props
interface Column {
  key: string;
  label: string;
  searchable?: boolean;
  sortable?: boolean;
  exportable?: boolean;
  isBoolean?: boolean;
  isDate?: boolean;
  nested?: boolean;
  trueLabel?: string;
  falseLabel?: string;
  trueColor?: string;
  falseColor?: string;
  render?: (item: any) => React.ReactNode;
}

// Define a generic data item type
interface DataItem {
  [key: string]: any;
  id?: string | number;
}

interface DataTableProps {
  data: DataItem[];
  columns: Column[];
  title?: string;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onAdd?: () => void;
  onEdit?: (item: DataItem) => void;
  onExport?: (data: DataItem[]) => any;
  itemsPerPage?: number;
  showAddButton?: boolean;
  showExportButton?: boolean;
  showRefreshButton?: boolean;
  refreshing?: boolean;
}

const DataTable = ({
  data,
  columns,
  title,
  loading,
  error,
  onRefresh,
  onAdd,
  onEdit,
  onExport,
  itemsPerPage = 10,
  showAddButton = true,
  showExportButton = true,
  showRefreshButton = true,
  refreshing = false
}: DataTableProps) => {
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [sortOrder, setSortOrder] = useState<string>(columns[0]?.key || '');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Initialize search terms for all searchable columns
  React.useEffect(() => {
    const initialSearchTerms: Record<string, string> = {};
    columns.forEach(column => {
      if (column.searchable !== false) {
        initialSearchTerms[column.key] = '';
      }
    });
    setSearchTerms(initialSearchTerms);
  }, [columns]);

  const handleSortClick = (field: string) => {
    if (sortOrder === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOrder(field);
      setSortDirection('asc');
    }
  };

  const handleSearchChange = (field: string, value: string) => {
    setSearchTerms(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  const filteredData = data.filter((item: DataItem) => {
    return columns.every(column => {
      if (column.searchable === false) return true;
      const searchTerm = searchTerms[column.key] || '';
      if (searchTerm === '') return true;
      
      let itemValue = item[column.key];
      
      // Handle nested properties
      if (column.nested) {
        const keys = column.key.split('.');
        itemValue = keys.reduce((obj, key) => obj?.[key], item);
      }
      
      // Handle date formatting for search
      if (column.isDate && itemValue) {
        itemValue = new Date(itemValue).toLocaleDateString();
      }
      
      // Handle boolean values
      if (column.isBoolean || typeof itemValue === 'boolean') {
        const boolValue = typeof itemValue === 'boolean' ? itemValue : itemValue === 'true' || itemValue === true;
        return boolValue.toString() === searchTerm;
      }
      
      return (itemValue || '').toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let comparison = 0;
    let aValue = a[sortOrder];
    let bValue = b[sortOrder];
    
    // Handle nested properties
    const column = columns.find(col => col.key === sortOrder);
    if (column?.nested) {
      const keys = sortOrder.split('.');
      aValue = keys.reduce((obj, key) => obj?.[key], a);
      bValue = keys.reduce((obj, key) => obj?.[key], b);
    }
    
    // Handle date sorting
    if (column?.isDate) {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
      comparison = aValue - bValue;
    } else {
      // Handle string comparison
      aValue = (aValue || '').toString();
      bValue = (bValue || '').toString();
      comparison = aValue.localeCompare(bValue);
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const exportToExcel = () => {
    console.log('Export button clicked'); // Debug log
    console.log('Sorted data length:', sortedData.length); // Debug log
    
    try {
      if (onExport) {
        console.log('Calling onExport callback'); // Debug log
        onExport(sortedData);
      } else {
        console.log('Using default export functionality'); // Debug log
        // Default export functionality
        const exportData = sortedData.map((item: DataItem) => {
          const exportItem: Record<string, any> = {};
          columns.forEach(column => {
            if (column.exportable !== false) {
              let value = item[column.key];
               
              // Handle nested properties
              if (column.nested) {
                const keys = column.key.split('.');
                value = keys.reduce((obj: any, key) => obj?.[key], item);
              }
               
              // Handle boolean values
              if (typeof value === 'boolean') {
                value = value ? 'Yes' : 'No';
              }
               
              // Handle dates
              if (column.isDate && value) {
                value = new Date(value).toLocaleDateString();
              }
               
              exportItem[column.label] = value || '';
            }
          });
          return exportItem;
        });
        console.log('Export data prepared:', exportData.length, 'rows'); // Debug log

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb: WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, title || "Data");
        
        const today = new Date().toLocaleDateString().replace(/\//g, '-');
        const fileName = `${(title || '').toLowerCase().replace(/\s+/g, '_')}_data_${today}.xlsx`;
        console.log('Writing file:', fileName); // Debug log
        
        // Use XLSX.write with proper typing
        XLSX.writeFile(wb, fileName);
        console.log('File written successfully'); // Debug log
      }
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      // Fallback: try a simpler approach
      try {
        const simpleData = sortedData.map((item: DataItem) => {
          const exportItem: Record<string, any> = {};
          columns.forEach(column => {
            if (column.exportable !== false) {
              exportItem[column.label] = item[column.key] || '';
            }
          });
          return exportItem;
        });
        
        const ws = XLSX.utils.json_to_sheet(simpleData);
        const wb: WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, title || "Data");
        
        const fileName = `${(title || 'data')}.xlsx`;
        XLSX.writeFile(wb, fileName);
      } catch (fallbackError) {
        console.error('Fallback export also failed:', fallbackError);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full"> {/* Changed h-64 to h-full */}
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-muted-foreground">Loading {title?.toLowerCase() || 'data'.toLowerCase()}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    // Changed space-y-6 to gap-4 to better control flex layout spacing
    <div className="h-full flex flex-col gap-4">
      
      {/* Header Section - Shrinks/Grows as needed but doesn't scroll */}
      <div className="shrink-0">
        <h1 className="text-2xl font-bold text-foreground mb-4">{title || 'Data'} ({data.length} Total)</h1>
        <div className="flex items-center space-x-4">
          {showAddButton && onAdd && (
            <button
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-lg transition-colors"
              onClick={onAdd}
            >
              <PlusIcon className='h-5 w-5 text-foreground'/>
            </button>
          )}
          {showExportButton && (
            <button
              type="button"
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Export button clicked via onClick'); // Debug log
                exportToExcel();
              }}
            >
              <ArrowDownTrayIcon className='h-5 w-5 text-foreground'/>
            </button>
          )}
          {showRefreshButton && (
            <button
              className={`bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${refreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={onRefresh}
              disabled={refreshing}
            >
              <ArrowPathIcon className={`h-5 w-5 text-foreground ${refreshing ? 'animate-spin' : ''}`}/>
            </button>
          )}
        </div>
      </div>

      {/* Table Container
         min-h-0 is CRITICAL: it allows this flex child to shrink smaller than its content,
         which triggers the overflow-auto to kick in.
      */}
      <div className="flex-1 min-h-0 bg-card rounded-xl shadow-lg flex flex-col overflow-hidden border border-border/50">
        
        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto relative">
          <table className="w-full">
            {/* Sticky Header */}
            <thead className="bg-muted/50 sticky top-0 z-10 border-b border-border shadow-sm">
              <tr>
                {columns.map(column => (
                  <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">
                    {column.searchable !== false ? (
                      <div className="flex flex-col space-y-2">
                        <div
                          className="flex items-center cursor-pointer hover:bg-muted p-1 rounded"
                          onClick={() => column.sortable !== false && handleSortClick(column.key)}
                        >
                          {column.label}
                          {sortOrder === column.key && (
                            <span className="ml-1 text-primary">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                        {column.isBoolean ? (
                          <select
                            value={searchTerms[column.key] || ''}
                            onChange={(e) => handleSearchChange(column.key, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-2 py-1 text-xs border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring font-normal bg-background"
                          >
                            <option value="">All</option>
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder={`Search...`}
                            value={searchTerms[column.key] || ''}
                            onChange={(e) => handleSearchChange(column.key, e.target.value)}
                            className="w-full px-2 py-1 text-xs border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring font-normal bg-background"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {column.label}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentItems.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-muted/50 transition-colors">
                  {columns.map(column => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {column.render ? column.render(item) : (
                        <>
                          {column.isBoolean ? (
                            <div className="flex items-center">
                              {item[column.key] === true ? (
                                <CheckCircleIcon className="h-5 w-5 text-green-500" title={column.trueLabel || 'Active'} />
                              ) : (
                                <XCircleIcon className="h-5 w-5 text-red-500" title={column.falseLabel || 'Inactive'} />
                              )}
                            </div>
                          ) : column.isDate ? (
                            new Date(item[column.key]).toLocaleDateString()
                          ) : column.nested ? (
                            (() => {
                              const keys = column.key.split('.');
                              return keys.reduce((obj, key) => obj?.[key], item) || '';
                            })()
                          ) : (
                            item[column.key] || ''
                          )}
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section - Fixed at bottom */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-border bg-card shrink-0 z-20">
          <span className="text-sm text-foreground">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedData.length)} of {sortedData.length} results
          </span>
          <div className="space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md text-sm ${currentPage === 1 ? 'bg-muted text-muted-foreground/50 cursor-not-allowed' : 'bg-background border border-border hover:bg-muted'}`}
            >
              Previous
            </button>
              
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1
              if (totalPages > 5 && currentPage > 3) pageNum = currentPage - 2 + i
              if (pageNum > totalPages) return null
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-md text-sm ${currentPage === pageNum ? 'bg-primary text-primary-foreground' : 'bg-background border border-border hover:bg-muted'}`}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-3 py-1 rounded-md text-sm ${currentPage === totalPages || totalPages === 0 ? 'bg-muted text-muted-foreground/50 cursor-not-allowed' : 'bg-background border border-border hover:bg-muted'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;