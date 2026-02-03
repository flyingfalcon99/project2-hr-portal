/**
 * Filter Utilities for Employee and Leave Request Management
 * Provides reusable filtering functions with consistent logic
 */

/**
 * Debounce function to delay execution
 * Useful for search input to avoid excessive filtering
 * 
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds (default 300ms)
 * @returns {Function} Debounced function
 * 
 * @example
 * const debouncedSearch = debounce((term) => {
 *   setSearchTerm(term);
 * }, 300);
 * 
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 */
export function debounce(func, delay = 300) {
  let timeoutId;
  
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Normalize text for case-insensitive searching
 * Removes extra spaces and converts to lowercase
 * 
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
function normalizeText(text) {
  return text?.toString().toLowerCase().trim() || '';
}

/**
 * Check if text matches search term
 * Supports partial matching
 * 
 * @param {string|number} text - Text to search in
 * @param {string} searchTerm - Term to search for
 * @returns {boolean} True if matches
 */
function textMatches(text, searchTerm) {
  if (!searchTerm) return true;
  return normalizeText(text).includes(normalizeText(searchTerm));
}

// ============================================================================
// EMPLOYEE FILTERING
// ============================================================================

/**
 * Filter employees by search term
 * Searches in: firstName, lastName, email
 * 
 * @param {Array} employees - Array of employee objects
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered employees
 * 
 * @example
 * const results = filterEmployeesBySearch(employees, 'john');
 */
export function filterEmployeesBySearch(employees, searchTerm) {
  if (!searchTerm) return employees;
  
  return employees.filter((emp) => {
    return (
      textMatches(emp.firstName, searchTerm) ||
      textMatches(emp.lastName, searchTerm) ||
      textMatches(emp.email, searchTerm) ||
      textMatches(emp.phone, searchTerm) ||
      textMatches(emp.position, searchTerm)
    );
  });
}

/**
 * Filter employees by department
 * 
 * @param {Array} employees - Array of employee objects
 * @param {string} department - Department to filter by
 * @returns {Array} Filtered employees
 */
export function filterEmployeesByDepartment(employees, department) {
  if (!department || department === 'All Departments') return employees;
  return employees.filter((emp) => emp.department === department);
}

/**
 * Filter employees by position
 * 
 * @param {Array} employees - Array of employee objects
 * @param {string} position - Position to filter by
 * @returns {Array} Filtered employees
 */
export function filterEmployeesByPosition(employees, position) {
  if (!position || position === 'All Positions') return employees;
  return employees.filter((emp) => emp.position === position);
}

/**
 * Filter employees by status
 * 
 * @param {Array} employees - Array of employee objects
 * @param {string} status - Status to filter by ('active', 'inactive', 'on-leave')
 * @returns {Array} Filtered employees
 */
export function filterEmployeesByStatus(employees, status) {
  if (!status || status === 'All Status') return employees;
  return employees.filter((emp) => emp.status === status);
}

/**
 * Comprehensive employee filtering function
 * Applies all filters in sequence
 * 
 * @param {Array} employees - Array of employee objects
 * @param {Object} filters - Filter criteria object
 * @param {string} filters.search - Search term
 * @param {string} filters.department - Department filter
 * @param {string} filters.position - Position filter
 * @param {string} filters.status - Status filter
 * @returns {Array} Filtered employees
 * 
 * @example
 * const filtered = filterEmployees(employees, {
 *   search: 'john',
 *   department: 'Engineering',
 *   status: 'active'
 * });
 */
export function filterEmployees(employees, filters = {}) {
  let result = [...employees];
  
  if (filters.search) {
    result = filterEmployeesBySearch(result, filters.search);
  }
  
  if (filters.department) {
    result = filterEmployeesByDepartment(result, filters.department);
  }
  
  if (filters.position) {
    result = filterEmployeesByPosition(result, filters.position);
  }
  
  if (filters.status) {
    result = filterEmployeesByStatus(result, filters.status);
  }
  
  return result;
}

/**
 * Get list of unique positions from employees
 * Useful for building filter dropdown
 * 
 * @param {Array} employees - Array of employee objects
 * @returns {Array} Sorted unique positions
 */
export function getUniquePositions(employees) {
  const positions = [...new Set(employees.map((emp) => emp.position).filter(Boolean))];
  return ['All Positions', ...positions.sort()];
}

/**
 * Get list of unique departments from employees
 * 
 * @param {Array} employees - Array of employee objects
 * @returns {Array} Sorted unique departments
 */
export function getUniqueDepartments(employees) {
  const departments = [...new Set(employees.map((emp) => emp.department).filter(Boolean))];
  return ['All Departments', ...departments.sort()];
}

// ============================================================================
// LEAVE REQUEST FILTERING
// ============================================================================

/**
 * Check if date is within range
 * 
 * @param {string|Date} date - Date to check
 * @param {string|Date} startDate - Range start
 * @param {string|Date} endDate - Range end
 * @returns {boolean} True if within range
 */
function dateInRange(date, startDate, endDate) {
  const checkDate = new Date(date);
  
  if (startDate && new Date(startDate) > checkDate) return false;
  if (endDate && new Date(endDate) < checkDate) return false;
  
  return true;
}

/**
 * Filter leave requests by search term
 * Searches in: employee name, employee email
 * 
 * @param {Array} leaves - Array of leave request objects (should be enriched with employee data)
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered leave requests
 */
export function filterLeavesBySearch(leaves, searchTerm) {
  if (!searchTerm) return leaves;
  
  return leaves.filter((leave) => {
    return (
      textMatches(leave.employeeName, searchTerm) ||
      textMatches(leave.employeeEmail, searchTerm) ||
      textMatches(leave.leaveType, searchTerm) ||
      textMatches(leave.reason, searchTerm)
    );
  });
}

/**
 * Filter leave requests by status
 * 
 * @param {Array} leaves - Array of leave request objects
 * @param {string} status - Status to filter by ('pending', 'approved', 'rejected')
 * @returns {Array} Filtered leave requests
 */
export function filterLeavesByStatus(leaves, status) {
  if (!status || status === 'All Status') return leaves;
  return leaves.filter((leave) => leave.status === status);
}

/**
 * Filter leave requests by leave type
 * 
 * @param {Array} leaves - Array of leave request objects
 * @param {string} leaveType - Leave type to filter by
 * @returns {Array} Filtered leave requests
 */
export function filterLeavesByType(leaves, leaveType) {
  if (!leaveType || leaveType === 'All Types') return leaves;
  return leaves.filter((leave) => leave.leaveType === leaveType);
}

/**
 * Filter leave requests by date range
 * Checks if leave start date falls within range
 * 
 * @param {Array} leaves - Array of leave request objects
 * @param {string} startDate - Start date (YYYY-MM-DD format)
 * @param {string} endDate - End date (YYYY-MM-DD format)
 * @returns {Array} Filtered leave requests
 */
export function filterLeavesByDateRange(leaves, startDate, endDate) {
  if (!startDate && !endDate) return leaves;
  
  return leaves.filter((leave) => {
    return dateInRange(leave.startDate, startDate, endDate);
  });
}

/**
 * Filter leave requests by employee
 * 
 * @param {Array} leaves - Array of leave request objects
 * @param {number|string} employeeId - Employee ID to filter by
 * @returns {Array} Filtered leave requests
 */
export function filterLeavesByEmployee(leaves, employeeId) {
  if (!employeeId) return leaves;
  return leaves.filter((leave) => leave.employeeId === employeeId);
}

/**
 * Comprehensive leave request filtering function
 * Applies all filters in sequence
 * 
 * @param {Array} leaves - Array of leave request objects
 * @param {Object} filters - Filter criteria object
 * @param {string} filters.search - Search term
 * @param {string} filters.status - Status filter
 * @param {string} filters.leaveType - Leave type filter
 * @param {string} filters.startDate - Date range start (YYYY-MM-DD)
 * @param {string} filters.endDate - Date range end (YYYY-MM-DD)
 * @param {number|string} filters.employeeId - Employee ID filter
 * @returns {Array} Filtered leave requests
 * 
 * @example
 * const filtered = filterLeaves(leaves, {
 *   search: 'john',
 *   status: 'pending',
 *   startDate: '2024-01-01',
 *   endDate: '2024-01-31'
 * });
 */
export function filterLeaves(leaves, filters = {}) {
  let result = [...leaves];
  
  if (filters.search) {
    result = filterLeavesBySearch(result, filters.search);
  }
  
  if (filters.status) {
    result = filterLeavesByStatus(result, filters.status);
  }
  
  if (filters.leaveType) {
    result = filterLeavesByType(result, filters.leaveType);
  }
  
  if (filters.startDate || filters.endDate) {
    result = filterLeavesByDateRange(result, filters.startDate, filters.endDate);
  }
  
  if (filters.employeeId) {
    result = filterLeavesByEmployee(result, filters.employeeId);
  }
  
  return result;
}

/**
 * Get list of unique leave types from leave requests
 * 
 * @param {Array} leaves - Array of leave request objects
 * @returns {Array} Sorted unique leave types
 */
export function getUniqueLeaveTypes(leaves) {
  const types = [...new Set(leaves.map((leave) => leave.leaveType).filter(Boolean))];
  return ['All Types', ...types.sort()];
}

/**
 * Get leave requests count by status
 * Useful for badge display
 * 
 * @param {Array} leaves - Array of leave request objects
 * @returns {Object} Count by status
 * 
 * @example
 * const counts = getLeaveCountByStatus(leaves);
 * // Returns: { pending: 5, approved: 10, rejected: 2, all: 17 }
 */
export function getLeaveCountByStatus(leaves) {
  return {
    pending: leaves.filter((l) => l.status === 'pending').length,
    approved: leaves.filter((l) => l.status === 'approved').length,
    rejected: leaves.filter((l) => l.status === 'rejected').length,
    all: leaves.length,
  };
}

// ============================================================================
// PAGINATION
// ============================================================================

/**
 * Get paginated results
 * 
 * @param {Array} items - Array of items to paginate
 * @param {number} page - Current page (1-indexed)
 * @param {number} itemsPerPage - Items per page
 * @returns {Array} Items for current page
 * 
 * @example
 * const page1Items = getPaginatedResults(employees, 1, 10); // Items 0-9
 * const page2Items = getPaginatedResults(employees, 2, 10); // Items 10-19
 */
export function getPaginatedResults(items, page, itemsPerPage) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return items.slice(start, end);
}

/**
 * Get total number of pages
 * 
 * @param {number} totalItems - Total number of items
 * @param {number} itemsPerPage - Items per page
 * @returns {number} Total pages
 */
export function getTotalPages(totalItems, itemsPerPage) {
  return Math.ceil(totalItems / itemsPerPage);
}

// ============================================================================
// FORMATTING UTILITIES
// ============================================================================

/**
 * Format date range for display
 * 
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {string} Formatted range
 * 
 * @example
 * formatDateRange('2024-01-01', '2024-01-31') // Returns: "Jan 1 - 31, 2024"
 */
export function formatDateRange(startDate, endDate) {
  if (!startDate && !endDate) return '';
  if (!startDate || !endDate) return startDate || endDate;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const options = { month: 'short', day: 'numeric' };
  const yearOption = { year: 'numeric' };
  
  const startStr = start.toLocaleDateString('en-US', options);
  const endStr = end.toLocaleDateString('en-US', options);
  const yearStr = end.toLocaleDateString('en-US', yearOption);
  
  return `${startStr} - ${endStr}, ${yearStr}`;
}

/**
 * Check if any filters are active
 * 
 * @param {Object} filters - Filter object
 * @returns {boolean} True if any filters are set
 */
export function hasActiveFilters(filters) {
  return Object.values(filters).some((value) => {
    if (value === null || value === undefined || value === '') return false;
    if (typeof value === 'string' && (value === 'All Departments' || value === 'All Status' || value === 'All Types' || value === 'All Positions')) return false;
    return true;
  });
}
