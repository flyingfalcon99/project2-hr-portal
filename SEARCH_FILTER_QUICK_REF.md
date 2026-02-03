# Search & Filter Quick Reference

## Quick Start

### Using Search & Filters in Employee Management

```jsx
import { useCallback, useState, useMemo } from 'react';
import { filterEmployees, debounce, hasActiveFilters, getUniquePositions, getUniqueDepartments } from '../utils/filterUtils';
import FilterPanel from '../components/FilterPanel';
import { useNotification } from '../store/useNotification';

export default function EmployeeManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: 'All Departments',
    position: 'All Positions',
    status: 'All Status',
  });
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Debounce search
  const debouncedSearch = useCallback(
    debounce((term) => {
      setDebouncedSearchTerm(term);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Apply filters
  const filteredEmployees = useMemo(() => {
    return filterEmployees(employees, {
      search: debouncedSearchTerm,
      department: filters.department,
      position: filters.position,
      status: filters.status,
    });
  }, [employees, debouncedSearchTerm, filters]);

  return (
    <div>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name, email, phone, or position..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filter Panel */}
      {filterPanelOpen && (
        <FilterPanel
          filters={filters}
          onFilterChange={(name, value) => setFilters(prev => ({ ...prev, [name]: value }))}
          filterGroups={[
            { name: 'department', label: 'Department', type: 'select', options: getUniqueDepartments(employees) },
            { name: 'position', label: 'Position', type: 'select', options: getUniquePositions(employees) },
            { name: 'status', label: 'Status', type: 'select', options: ['All Status', 'Active', 'Inactive'] },
          ]}
        />
      )}

      {/* Results */}
      <div>
        Showing {filteredEmployees.length} of {employees.length} employees
      </div>
    </div>
  );
}
```

### Using Search & Filters in Leave Requests

```jsx
import { useCallback, useState, useMemo } from 'react';
import { filterLeaves, debounce, hasActiveFilters, getUniqueLeaveTypes, getLeaveCountByStatus } from '../utils/filterUtils';

export default function LeaveRequests() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    leaveType: 'All Types',
    startDate: '',
    endDate: '',
    employeeId: '',
  });

  const debouncedSearch = useCallback(
    debounce((term) => {
      setDebouncedSearchTerm(term);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const filteredLeaves = useMemo(() => {
    return filterLeaves(leaveRequests, {
      search: debouncedSearchTerm,
      leaveType: filters.leaveType,
      startDate: filters.startDate,
      endDate: filters.endDate,
      employeeId: filters.employeeId,
    });
  }, [leaveRequests, debouncedSearchTerm, filters]);

  return (
    <div>
      {/* Search */}
      <input
        type="text"
        placeholder="Search by employee name or leave details..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filters */}
      <select value={filters.leaveType} onChange={(e) => setFilters(prev => ({ ...prev, leaveType: e.target.value }))}>
        <option>All Types</option>
        {getUniqueLeaveTypes(leaveRequests).map(type => <option key={type}>{type}</option>)}
      </select>

      <input type="date" value={filters.startDate} onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))} />
      <input type="date" value={filters.endDate} onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))} />

      {/* Results */}
      <div>Showing {filteredLeaves.length} leave requests</div>
    </div>
  );
}
```

## Common Patterns

### Clear All Filters

```jsx
const handleClearFilters = () => {
  setSearchTerm('');
  setDebouncedSearchTerm('');
  setFilters({
    department: 'All Departments',
    position: 'All Positions',
    status: 'All Status',
  });
  showInfo('Filters Cleared', 'All search and filter criteria have been reset');
};
```

### Display Active Filters as Chips

```jsx
{hasActiveFilters(filters) && (
  <div className="flex flex-wrap gap-2">
    {filters.department !== 'All Departments' && (
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
        <span>{filters.department}</span>
        <button onClick={() => setFilters(prev => ({ ...prev, department: 'All Departments' }))}>✕</button>
      </div>
    )}
    {/* Repeat for other filters */}
  </div>
)}
```

### Show Results Count

```jsx
<div className="text-sm text-secondary-600">
  Showing <strong>{filteredEmployees.length}</strong> employees (of {employees.length})
</div>
```

### Export Filtered Results

```jsx
const handleExport = () => {
  try {
    // Get headers
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Position', 'Department', 'Status'];
    
    // Get filtered data
    const data = filteredEmployees.map(emp => [
      emp.id,
      `${emp.firstName} ${emp.lastName}`,
      emp.email,
      emp.phone,
      emp.position,
      emp.department,
      emp.status,
    ]);

    // Create CSV
    const csv = [headers, ...data].map(row => row.join(',')).join('\n');
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employees.csv';
    a.click();
    
    showSuccess('Export Successful', 'CSV file downloaded successfully');
  } catch (err) {
    showError('Export Failed', 'Could not generate CSV file');
  }
};
```

## Filter Utility Functions

### Core Filtering

| Function | Purpose | Example |
|----------|---------|---------|
| `filterEmployees()` | Apply all employee filters | `filterEmployees(emps, {search, dept, pos, status})` |
| `filterLeaves()` | Apply all leave filters | `filterLeaves(leaves, {search, type, dates, empId})` |
| `filterEmployeesBySearch()` | Search employees | `filterEmployeesBySearch(emps, 'John')` |
| `filterLeavesByDateRange()` | Filter by date range | `filterLeavesByDateRange(leaves, '2024-01-01', '2024-01-31')` |

### Data Extraction

| Function | Purpose | Returns |
|----------|---------|---------|
| `getUniquePositions()` | Get all positions | `['Manager', 'Developer', 'Designer']` |
| `getUniqueDepartments()` | Get all departments | `['IT', 'HR', 'Finance']` |
| `getUniqueLeaveTypes()` | Get all leave types | `['Sick Leave', 'Vacation', 'Personal']` |
| `getLeaveCountByStatus()` | Count by status | `{pending: 5, approved: 3, rejected: 1}` |

### Utilities

| Function | Purpose | Example |
|----------|---------|---------|
| `debounce()` | Debounce function calls | `debounce(handleSearch, 300)` |
| `hasActiveFilters()` | Check if filters applied | `hasActiveFilters(filters)` |
| `formatDateRange()` | Format dates for display | `formatDateRange('2024-01-01', '2024-01-31')` |
| `getPaginatedResults()` | Get page data | `getPaginatedResults(data, page, 10)` |

## State Structure

### Employee Filters Object

```javascript
{
  department: 'All Departments' | 'IT' | 'HR' | ...,
  position: 'All Positions' | 'Manager' | 'Developer' | ...,
  status: 'All Status' | 'Active' | 'Inactive',
}
```

### Leave Filters Object

```javascript
{
  leaveType: 'All Types' | 'Sick Leave' | 'Vacation' | ...,
  startDate: '' | 'YYYY-MM-DD',
  endDate: '' | 'YYYY-MM-DD',
  employeeId: '' | 'emp-id',
}
```

## Common Issues & Solutions

### Issue: Search not updating

**Solution**: Check debounce is wired correctly
```jsx
const debouncedSearch = useCallback(debounce((term) => {
  setDebouncedSearchTerm(term);
}, 300), []);

useEffect(() => {
  debouncedSearch(searchTerm);
}, [searchTerm, debouncedSearch]);
```

### Issue: Filters not combining

**Solution**: Verify AND logic in filter function
```javascript
export function filterEmployees(employees, filters) {
  let result = employees;
  
  if (filters.search) result = filterEmployeesBySearch(result, filters.search);
  if (filters.department && filters.department !== 'All Departments')
    result = filterEmployeesByDepartment(result, filters.department);
  
  return result; // All criteria applied
}
```

### Issue: Results count not updating

**Solution**: Verify useMemo dependencies
```jsx
const filteredEmployees = useMemo(() => {
  return filterEmployees(employees, {
    search: debouncedSearchTerm,
    department: filters.department,
    position: filters.position,
    status: filters.status,
  });
}, [employees, debouncedSearchTerm, filters]); // All deps included
```

### Issue: Debounce causing lag

**Solution**: Increase delay in debounce call
```jsx
debounce((term) => {
  setDebouncedSearchTerm(term);
}, 500)  // Increased from 300ms
```

## Performance Tips

1. **Use debounce for search** - 300ms is a good default
2. **Use useMemo for filtered results** - Prevents unnecessary recalculations
3. **Use useCallback for handlers** - Prevents child re-renders
4. **Combine multiple filters** - Do all filtering in one pass
5. **Paginate large datasets** - Don't render all rows at once

## Files Reference

| File | Purpose | Size |
|------|---------|------|
| `src/utils/filterUtils.js` | Filter utilities | 430+ lines |
| `src/components/FilterPanel.jsx` | Reusable filter component | 200+ lines |
| `src/pages/EmployeeManagement.jsx` | Employee page with filters | Modified |
| `src/pages/LeaveRequestsPage.jsx` | Leave page with filters | Modified |

## See Also

- [Search & Filter Guide](SEARCH_FILTER_GUIDE.md) - Full documentation
- [filterUtils.js](src/utils/filterUtils.js) - Utility functions
- [FilterPanel.jsx](src/components/FilterPanel.jsx) - Component source
