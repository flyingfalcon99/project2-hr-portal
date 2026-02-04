import { useState } from 'react';
import PropTypes from 'prop-types';
import { hasActiveFilters } from '@/utils/filterUtils';

/**
 * FilterPanel Component
 * 
 * Reusable filter component with dropdown and clear functionality
 * Displays filter criteria and active filter count
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilterChange - Callback when filter changes
 * @param {Array} props.filterGroups - Array of filter group configurations
 * @param {Object} props.filterCounts - Object with count of results for each criterion (optional)
 * @param {boolean} props.isOpen - Whether dropdown is open (optional)
 * @param {Function} props.onToggle - Callback to toggle dropdown (optional)
 * 
 * @example
 * <FilterPanel
 *   filters={{ department: 'Engineering', status: 'active' }}
 *   onFilterChange={(name, value) => setFilters({...filters, [name]: value})}
 *   filterGroups={[
 *     {
 *       name: 'department',
 *       label: 'Department',
 *       options: ['All Departments', 'Engineering', 'Sales']
 *     },
 *     {
 *       name: 'status',
 *       label: 'Status',
 *       options: ['All Status', 'active', 'inactive']
 *     }
 *   ]}
 * />
 */
function FilterPanel({ filters, onFilterChange, filterGroups, filterCounts = {}, isOpen, onToggle }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const activeDropdown = isOpen !== undefined ? isOpen : dropdownOpen;

  const handleToggle = () => {
    if (onToggle) {
      onToggle(!activeDropdown);
    } else {
      setDropdownOpen(!dropdownOpen);
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    filterGroups.forEach((group) => {
      clearedFilters[group.name] = group.options?.[0] || '';
    });
    onFilterChange(clearedFilters);
  };

  const activeFilterCount = Object.entries(filters).filter(([key]) => {
    if (!filters[key] || filters[key] === '' || filters[key] === 'All Departments' || filters[key] === 'All Status' || filters[key] === 'All Types' || filters[key] === 'All Positions') {
      return false;
    }
    return true;
  }).length;

  return (
    <div className="relative inline-block">
      {/* Filter Button */}
      <button
        onClick={handleToggle}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border
          transition-all duration-200
          ${
            activeDropdown
              ? 'bg-primary-50 border-primary-300 text-primary-700'
              : 'bg-white border-secondary-200 text-secondary-700 hover:border-secondary-300'
          }
        `}
        aria-haspopup="true"
        aria-expanded={activeDropdown}
      >
        {/* Filter Icon */}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>

        <span className="font-medium">Filters</span>

        {/* Active Filter Badge */}
        {activeFilterCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-600 rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {activeDropdown && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-secondary-200 rounded-lg shadow-lg z-40 p-4">
          {/* Filter Groups */}
          <div className="space-y-4">
            {filterGroups.map((group) => (
              <div key={group.name}>
                <label className="block text-sm font-semibold text-secondary-900 mb-2">
                  {group.label}
                </label>

                {group.type === 'date-range' ? (
                  // Date Range Input
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={filters[group.startDateName] || ''}
                      onChange={(e) => onFilterChange(group.startDateName, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Start date"
                    />
                    <input
                      type="date"
                      value={filters[group.endDateName] || ''}
                      onChange={(e) => onFilterChange(group.endDateName, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="End date"
                    />
                  </div>
                ) : group.type === 'select' ? (
                  // Select Dropdown
                  <select
                    value={filters[group.name] || ''}
                    onChange={(e) => onFilterChange(group.name, e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {group.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                        {filterCounts[option] !== undefined && ` (${filterCounts[option]})`}
                      </option>
                    ))}
                  </select>
                ) : (
                  // Checkboxes (for multiple selection)
                  <div className="space-y-2">
                    {group.options?.map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(filters[group.name] || []).includes(option)}
                          onChange={(e) => {
                            const current = filters[group.name] || [];
                            if (e.target.checked) {
                              onFilterChange(group.name, [...current, option]);
                            } else {
                              onFilterChange(
                                group.name,
                                current.filter((item) => item !== option)
                              );
                            }
                          }}
                          className="w-4 h-4 rounded border-secondary-300"
                        />
                        <span className="text-sm text-secondary-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-secondary-200">
            <button
              onClick={() => {
                handleToggle();
              }}
              className="flex-1 px-3 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
            >
              Apply
            </button>

            {hasActiveFilters(filters) && (
              <button
                onClick={() => {
                  handleClearFilters();
                  handleToggle();
                }}
                className="flex-1 px-3 py-2 text-sm font-medium text-secondary-700 bg-secondary-100 hover:bg-secondary-200 rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

FilterPanel.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  filterGroups: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['select', 'checkbox', 'date-range']),
      options: PropTypes.array,
      startDateName: PropTypes.string,
      endDateName: PropTypes.string,
    })
  ).isRequired,
  filterCounts: PropTypes.object,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default FilterPanel;
