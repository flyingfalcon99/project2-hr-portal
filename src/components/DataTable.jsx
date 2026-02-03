import React, { useState, useMemo } from 'react';
import { useIsMobile, TABLE_RESPONSIVE, TOUCH_SIZES } from '@/utils/responsiveUtils';
import Badge from './Badge';

/**
 * Reusable DataTable Component with Responsive Design
 * Desktop: Traditional table layout
 * Mobile: Card/list layout
 * 
 * @param {array} data - Table data (array of objects)
 * @param {array} columns - Column definitions
 * @param {boolean} sortable - Enable column sorting
 * @param {boolean} paginated - Enable pagination
 * @param {number} pageSize - Items per page
 * @param {function} onRowClick - Row click handler
 * @param {boolean} selectable - Enable row selection
 * @param {function} onSelectionChange - Selection change handler
 * @param {string} className - Additional CSS classes
 * @param {boolean} striped - Alternate row colors
 * @param {boolean} loading - Show loading state
 * @param {string} emptyMessage - Message when no data
 * @param {boolean} responsive - Enable responsive card view on mobile (default: true)
 */
const DataTable = ({
  data = [],
  columns = [],
  sortable = true,
  paginated = true,
  pageSize = 10,
  onRowClick,
  selectable = false,
  onSelectionChange,
  className = '',
  striped = true,
  loading = false,
  emptyMessage = 'No data available',
  responsive = true,
}) => {
  const isMobile = useIsMobile();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Handle sorting
  const handleSort = (columnKey) => {
    if (!sortable) return;

    let direction = 'asc';
    if (sortConfig.key === columnKey && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key: columnKey, direction });
    setCurrentPage(1);
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [data, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!paginated) return sortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, paginated]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle row selection
  const handleRowSelect = (index) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
    if (onSelectionChange) {
      onSelectionChange(Array.from(newSelected));
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      if (onSelectionChange) onSelectionChange([]);
    } else {
      const newSelected = new Set(paginatedData.map((_, i) => i));
      setSelectedRows(newSelected);
      if (onSelectionChange) onSelectionChange(Array.from(newSelected));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin">
          <svg className="w-8 h-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {/* Mobile Card View */}
      {isMobile && responsive && (
        <div className="space-y-3">
          {paginatedData.map((row, rowIndex) => (
            <div
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`
                border border-gray-200 rounded-lg p-4 space-y-3 
                transition-all duration-200 active:bg-primary-50
                ${onRowClick ? 'cursor-pointer' : ''}
                ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : 'bg-white'}
              `}
            >
              {selectable && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(rowIndex)}
                    onChange={() => handleRowSelect(rowIndex)}
                    onClick={(e) => e.stopPropagation()}
                    className={`${TOUCH_SIZES.medium} text-primary-600 border-gray-300 rounded focus:ring-primary-500`}
                  />
                </div>
              )}

              {columns.map((column) => (
                <div key={`${rowIndex}-${column.key}`} className="flex justify-between items-start gap-2 text-sm">
                  <span className="font-semibold text-gray-700 min-w-max">{column.label}:</span>
                  <span className="text-gray-900 text-right flex-1">
                    {column.render ? column.render(row[column.key], row) : renderCell(row[column.key])}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Desktop Table View */}
      {!isMobile || !responsive && (
        <div className={TABLE_RESPONSIVE.wrapper}>
          <table className={`${TABLE_RESPONSIVE.table} border border-gray-200 rounded-lg overflow-hidden`}>
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {selectable && (
                  <th className="px-4 md:px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                      onChange={handleSelectAll}
                      className={`${TOUCH_SIZES.medium} text-primary-600 border-gray-300 rounded focus:ring-primary-500`}
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    onClick={() => handleSort(column.key)}
                    className={`px-4 md:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap ${
                      sortable && column.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.label}</span>
                      {sortable && column.sortable !== false && sortConfig.key === column.key && (
                        <span className="text-primary-600 text-sm">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    border-b border-gray-200 transition-colors text-sm
                    ${onRowClick ? 'cursor-pointer hover:bg-primary-50' : ''}
                    ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''}
                  `}
                >
                  {selectable && (
                    <td className="px-4 md:px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(rowIndex)}
                        onChange={() => handleRowSelect(rowIndex)}
                        onClick={(e) => e.stopPropagation()}
                        className={`${TOUCH_SIZES.medium} text-primary-600 border-gray-300 rounded focus:ring-primary-500`}
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={`${rowIndex}-${column.key}`} className="px-4 md:px-6 py-4 text-gray-900 whitespace-nowrap">
                      {column.render ? column.render(row[column.key], row) : renderCell(row[column.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {paginated && totalPages > 1 && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 md:px-6">
          <p className="text-xs sm:text-sm text-gray-600">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </p>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`${TOUCH_SIZES.medium} px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              Previous
            </button>

            {isMobile && totalPages > 5 ? (
              <div className="flex gap-1">
                <button
                  key="first"
                  onClick={() => setCurrentPage(1)}
                  className={`${TOUCH_SIZES.medium} px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                    currentPage === 1
                      ? 'bg-primary-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  1
                </button>
                {currentPage > 3 && <span className="px-2 py-2 text-gray-500">...</span>}
                {Array.from(
                  { length: Math.min(3, totalPages - 2) },
                  (_, i) => Math.max(2, currentPage - 1) + i
                )
                  .filter((page) => page < totalPages)
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`${TOUCH_SIZES.medium} px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                        currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                {currentPage < totalPages - 2 && <span className="px-2 py-2 text-gray-500">...</span>}
                <button
                  key="last"
                  onClick={() => setCurrentPage(totalPages)}
                  className={`${TOUCH_SIZES.medium} px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm ${
                    currentPage === totalPages
                      ? 'bg-primary-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {totalPages}
                </button>
              </div>
            ) : (
              Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`
                    ${TOUCH_SIZES.medium} px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm
                    ${currentPage === page
                      ? 'bg-primary-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  {page}
                </button>
              ))
            )}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`${TOUCH_SIZES.medium} px-3 sm:px-4 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Helper function to render cell content
 */
const renderCell = (value) => {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object' && value.type) {
    // React component
    return value;
  }
  return String(value);
};

export default DataTable;
