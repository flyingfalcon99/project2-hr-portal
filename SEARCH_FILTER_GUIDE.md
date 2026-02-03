# Search & Filter System Guide

## Overview

The HR Portal includes a comprehensive search and filter system that enables users to efficiently discover and manage employees and leave requests. The system uses:

- **Centralized filter utilities** for reusable, testable filtering logic
- **Debounced search** (300ms default) for performance optimization
- **Reusable FilterPanel component** for consistent UI across pages
- **Redux notifications** for user feedback on filter actions
- **Active filter visualization** with chip-style tags

## Architecture

### Core Components

#### 1. **filterUtils.js** - Utility Library
Location: `src/utils/filterUtils.js`

Core Functions:

```javascript
// Debouncing
debounce(func, delay) - Debounces function calls

// Employee Filtering
filterEmployees(employees, filters) - Main wrapper
filterEmployeesBySearch(employees, searchTerm) - Multi-field search
filterEmployeesByDepartment(employees, department)
filterEmployeesByPosition(employees, position)
filterEmployeesByStatus(employees, status)

// Leave Filtering
filterLeaves(leaves, filters) - Main wrapper
filterLeavesBySearch(leaves, searchTerm) - Multi-field search
filterLeavesByStatus(leaves, status)
filterLeavesByType(leaves, type)
filterLeavesByDateRange(leaves, startDate, endDate)
filterLeavesByEmployee(leaves, employeeId)

// Data Extraction
getUniquePositions(employees)
getUniqueDepartments(employees)
getUniqueLeaveTypes(leaves)
getLeaveCountByStatus(leaves)

// Utilities
hasActiveFilters(filters) - Checks if any filters applied
formatDateRange(startDate, endDate) - Format for display
getPaginatedResults(data, page, perPage) - Pagination
getTotalPages(dataLength, perPage) - Calculate pages
```

#### 2. **FilterPanel.jsx** - Reusable Component
Location: `src/components/FilterPanel.jsx`

```jsx
<FilterPanel
  filters={filters}
  onFilterChange={handleFilterChange}
  filterGroups={[
    { name: 'department', label: 'Department', type: 'select', options: [...] },
    { name: 'status', label: 'Status', type: 'select', options: [...] },
    { name: 'dates', label: 'Date Range', type: 'date-range', 
      startDateName: 'startDate', endDateName: 'endDate' }
  ]}
  filterCounts={{ department: 5, status: 3 }}
  isOpen={filterPanelOpen}
  onToggle={() => setFilterPanelOpen(!filterPanelOpen)}
/>
```

### Integration Points

## Employee Management Page

### Features

1. **Global Search**
   - Searches by: name, email, phone, position
   - Debounced (300ms) for performance
   - Resets pagination on search

2. **Multi-Criteria Filtering**
   - Department filter
   - Position filter
   - Employee status filter

3. **Active Filters Display**
   - Shows applied filters as removable chips
   - Click ✕ to remove individual filters
   - "Clear All" button when filters active

4. **Results Count**
   - Displays "X employees (of Y)" 
   - Updates in real-time

5. **CSV Export**
   - Exports currently filtered results
   - Shows notification on success/error

### Implementation

```jsx
// State Management
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
const [filters, setFilters] = useState({
  department: 'All Departments',
  position: 'All Positions',
  status: 'All Status',
});
const [filterPanelOpen, setFilterPanelOpen] = useState(false);

// Debounced Search
const debouncedSearch = useCallback(
  debounce((term) => {
    setDebouncedSearchTerm(term);
    setCurrentPage(1);
  }, 300),
  []
);

// Apply Filters
const filteredEmployees = useMemo(() => {
  return filterEmployees(employees, {
    search: debouncedSearchTerm,
    department: filters.department,
    position: filters.position,
    status: filters.status,
  });
}, [employees, debouncedSearchTerm, filters]);

// Handle Changes
const handleFilterChange = (filterName, value) => {
  setFilters((prev) => ({ ...prev, [filterName]: value }));
};

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

## Leave Requests Page

### Features

1. **Global Search**
   - Searches by: employee name, leave details
   - Debounced (300ms)
   - Works across all tabs

2. **Advanced Filtering**
   - Leave Type filter
   - Employee filter (dropdown with all employees)
   - Date Range filter (start and end date)

3. **Tab-Based Status Filtering**
   - Pending requests
   - Approved requests
   - Rejected requests
   - All requests
   - Shows count badges

4. **Active Filters Display**
   - Shows leave type, employee, and date range as chips
   - Individual removal capability
   - Clears with "Clear Filters" button

5. **Results Count**
   - Displays "X leave requests"
   - Updates as filters change

6. **Bulk Actions**
   - Select multiple leave requests
   - Bulk approve functionality
   - Shows notification on completion

### Implementation

```jsx
// State Management
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
const [filters, setFilters] = useState({
  leaveType: 'All Types',
  startDate: '',
  endDate: '',
  employeeId: '',
});
const [filterPanelOpen, setFilterPanelOpen] = useState(false);

// Debounced Search
const debouncedSearch = useCallback(
  debounce((term) => {
    setDebouncedSearchTerm(term);
  }, 300),
  []
);

// Apply Filters
const filteredLeaves = useMemo(() => {
  let filtered = enrichedLeaves;

  if (activeTab !== 'all') {
    filtered = filtered.filter((leave) => leave.status === activeTab);
  }

  filtered = filterLeaves(filtered, {
    search: debouncedSearchTerm,
    leaveType: filters.leaveType,
    startDate: filters.startDate,
    endDate: filters.endDate,
    employeeId: filters.employeeId,
  });

  return filtered;
}, [activeTab, enrichedLeaves, debouncedSearchTerm, filters]);

// Handle Changes
const handleFilterChange = (filterName, value) => {
  setFilters((prev) => ({ ...prev, [filterName]: value }));
};

const handleClearFilters = () => {
  setSearchTerm('');
  setDebouncedSearchTerm('');
  setFilters({
    leaveType: 'All Types',
    startDate: '',
    endDate: '',
    employeeId: '',
  });
  showInfo('Filters Cleared', 'All search and filter criteria have been reset');
};
```

## Search Behavior

### Search Fields by Page

**Employee Management:**
- Name (firstName + lastName)
- Email
- Phone
- Position

**Leave Requests:**
- Employee Name
- Leave Type
- Reason (leave details)

### Debouncing

- Default delay: 300ms
- Prevents excessive filtering on every keystroke
- Resets pagination when search term changes
- Smooth UX with minimal performance impact

### Search Normalization

- Case-insensitive matching
- Whitespace trimmed
- Partial word matching supported

## Filter Types

### Select Filters

```jsx
{ 
  name: 'department', 
  label: 'Department', 
  type: 'select', 
  options: ['All Departments', 'IT', 'HR', 'Finance'] 
}
```

### Checkbox Filters

```jsx
{
  name: 'status',
  label: 'Status',
  type: 'checkbox',
  options: ['Active', 'Inactive']
}
```

### Date Range Filters

```jsx
{
  name: 'dateRange',
  label: 'Date Range',
  type: 'date-range',
  startDateName: 'startDate',
  endDateName: 'endDate'
}
```

## UI Patterns

### Active Filters Display

Filters appear as removable chips:
```
[Department: IT ✕] [Status: Active ✕] [Clear All]
```

Clicking ✕ removes that specific filter
"Clear All" removes all filters at once

### Results Count

```
Showing 45 employees (of 150)
Showing 12 leave requests (pending)
```

### Filter Panel Toggle

```
┌─────────────────────────────────┐
│ Filters [3 active] [Show Filters ▼] │
├─────────────────────────────────┤
│ [Leave Type] [Employee] [From Date] [To Date]    │
│ [Apply Filters] [Clear All]     │
└─────────────────────────────────┘
```

## Notifications

Filter actions trigger Redux notifications:

```javascript
// Clear filters
showInfo('Filters Cleared', 'All search and filter criteria have been reset');

// Export
showSuccess('Export Successful', 'CSV file downloaded successfully');
showError('Export Failed', 'Could not generate CSV');

// Bulk actions
showSuccess(
  `${count} Approved`,
  `Successfully approved ${count} leave request(s)`
);
showError('Bulk Approval Failed', 'Could not approve all requests');
```

## Performance Considerations

1. **Debouncing**
   - 300ms delay reduces filtering frequency
   - Prevents dropdown lag during rapid typing

2. **useMemo**
   - Memoizes filtered results
   - Recalculates only when dependencies change
   - Prevents unnecessary table re-renders

3. **Pagination**
   - Breaks large datasets into pages
   - Reduces DOM nodes rendered at once

4. **useCallback**
   - Memoizes handler functions
   - Prevents child component re-renders

## Adding New Filters

### Step 1: Add Filter Utility Function

```javascript
// src/utils/filterUtils.js
export function filterEmployeesByNewCriteria(employees, value) {
  return employees.filter(emp => emp.newField === value);
}
```

### Step 2: Update Main Filter Wrapper

```javascript
export function filterEmployees(employees, filters) {
  let result = employees;
  
  if (filters.search) result = filterEmployeesBySearch(result, filters.search);
  if (filters.newCriteria && filters.newCriteria !== 'All')
    result = filterEmployeesByNewCriteria(result, filters.newCriteria);
  
  return result;
}
```

### Step 3: Add to Component State

```javascript
const [filters, setFilters] = useState({
  // ... existing filters
  newCriteria: 'All',
});
```

### Step 4: Add to FilterPanel Configuration

```javascript
filterGroups={[
  // ... existing filters
  { 
    name: 'newCriteria', 
    label: 'New Criteria', 
    type: 'select', 
    options: ['All', 'Value1', 'Value2'] 
  }
]}
```

### Step 5: Add to Active Filters Display

```jsx
{filters.newCriteria !== 'All' && (
  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
    <span>{filters.newCriteria}</span>
    <button onClick={() => handleFilterChange('newCriteria', 'All')}>✕</button>
  </div>
)}
```

## Testing Filters

### Test Cases

1. **Search Functionality**
   - Type in search box
   - Verify results filter after 300ms debounce
   - Verify pagination resets

2. **Individual Filters**
   - Change each filter
   - Verify results update
   - Verify "Clear All" enables

3. **Multi-Filter Combinations**
   - Apply multiple filters
   - Verify AND logic (all criteria must match)
   - Verify active filter chips appear

4. **Clear Functionality**
   - Click individual filter's ✕
   - Verify that filter only is cleared
   - Click "Clear All"
   - Verify all filters clear

5. **Export**
   - Apply filters
   - Export to CSV
   - Verify exported data matches filtered view

6. **Date Range Filtering**
   - Set start date
   - Set end date
   - Verify leaves in range appear
   - Verify leaves outside range are hidden

## Troubleshooting

### Filters not updating

- Check `useMemo` dependencies are correct
- Verify filter state is being set with `handleFilterChange`
- Check filterUtils function logic

### Debounce not working

- Verify `useCallback` is used for debounce function
- Check debounce delay in filterUtils (default 300ms)
- Verify effect dependency array includes debounced function

### Active filters chip not showing

- Check `hasActiveFilters()` returns true
- Verify filter value is not the default/placeholder
- Check conditional rendering logic

### CSV export not working

- Verify `exportToCSV()` function exists
- Check browser console for errors
- Verify data has required fields

## Best Practices

1. **Always use debounce for search**
   - Improves performance
   - Better UX with less jank

2. **Show active filters clearly**
   - Users know what's applied
   - Easy removal capability

3. **Provide feedback**
   - Use notifications for actions
   - Show results count
   - Display loading state during export

4. **Organize filters logically**
   - Related filters grouped
   - Most used filters first
   - Clear labels and options

5. **Combine filters with AND logic**
   - All criteria must match
   - More specific results
   - Easier to understand

6. **Test all combinations**
   - Single filters
   - Multiple filters
   - Search + filters combined
   - Edge cases (empty results, no filters)

## API Reference

### filterUtils Functions

#### `debounce(func, delay = 300)`
Debounces function execution by specified delay
- **func**: Function to debounce
- **delay**: Milliseconds to delay (default 300)
- **returns**: Debounced function

#### `filterEmployees(employees, filters)`
Applies all employee filters
- **employees**: Array of employee objects
- **filters**: {search, department, position, status}
- **returns**: Filtered array

#### `filterEmployeesBySearch(employees, searchTerm)`
Searches across name, email, phone, position
- **employees**: Array of employee objects
- **searchTerm**: Search string
- **returns**: Filtered array

#### `filterLeaves(leaves, filters)`
Applies all leave filters
- **leaves**: Array of leave request objects
- **filters**: {search, leaveType, startDate, endDate, employeeId}
- **returns**: Filtered array

#### `getUniquePositions(employees)`
Extracts unique positions from employees
- **employees**: Array of employee objects
- **returns**: Array of unique position strings

#### `hasActiveFilters(filters)`
Checks if any non-default filters are applied
- **filters**: Filters object
- **returns**: Boolean

#### `formatDateRange(startDate, endDate)`
Formats date range for display
- **startDate**: ISO date string
- **endDate**: ISO date string
- **returns**: "Jan 1 - Jan 31" format string

## Files Modified/Created

### Created
- `src/utils/filterUtils.js` - Filter utility functions (430+ lines)
- `src/components/FilterPanel.jsx` - Reusable filter component (200+ lines)

### Modified
- `src/pages/EmployeeManagement.jsx` - Added search/filter UI and logic
- `src/pages/LeaveRequestsPage.jsx` - Added search/filter UI and logic

### Documentation
- `SEARCH_FILTER_GUIDE.md` - This guide
