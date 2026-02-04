// ============================================================================
// DATE & TIME UTILITIES
// ============================================================================

/**
 * Format date to readable string
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'full', 'time')
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return 'N/A';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj)) return 'Invalid Date';

  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
    datetime: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
  };

  return dateObj.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Calculate duration between two dates in days
 * @param {Date|string} startDate - Start date
 * @param {Date|string} endDate - End date
 * @returns {number} Number of days (inclusive)
 */
export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start) || isNaN(end)) return 0;

  // Calculate difference in milliseconds and convert to days
  const diffMs = end - start;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1; // +1 for inclusive

  return Math.max(0, diffDays);
};

/**
 * Check if date is in the past
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is in the past
 */
export const isPastDate = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  return dateObj < new Date();
};

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  const today = new Date();
  return (
    dateObj.getFullYear() === today.getFullYear() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getDate() === today.getDate()
  );
};

/**
 * Add days to a date
 * @param {Date|string} date - Base date
 * @param {number} days - Number of days to add
 * @returns {Date} New date
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// ============================================================================
// STATUS & COLOR UTILITIES
// ============================================================================

/**
 * Get badge color for status
 * @param {string} status - Status value
 * @returns {string} Badge CSS class
 */
export const getStatusColor = (status) => {
  const statusColors = {
    approved: 'badge-success',
    pending: 'badge-warning',
    rejected: 'badge-danger',
    completed: 'badge-success',
    'in-progress': 'badge-warning',
    'on-hold': 'badge-secondary',
    active: 'badge-success',
    inactive: 'badge-secondary',
    signed: 'badge-success',
    'pending-signature': 'badge-warning',
    draft: 'badge-secondary',
    submitted: 'badge-warning',
    cancelled: 'badge-danger',
    overdue: 'badge-danger',
  };

  return statusColors[status?.toLowerCase()] || 'badge-secondary';
};

/**
 * Get text color for status
 * @param {string} status - Status value
 * @returns {string} Text color class
 */
export const getStatusTextColor = (status) => {
  const textColors = {
    approved: 'text-success-700',
    pending: 'text-warning-700',
    rejected: 'text-danger-700',
    completed: 'text-success-700',
    'in-progress': 'text-warning-700',
    'on-hold': 'text-secondary-700',
    active: 'text-success-700',
    inactive: 'text-secondary-700',
    signed: 'text-success-700',
    'pending-signature': 'text-warning-700',
    overdue: 'text-danger-700',
  };

  return textColors[status?.toLowerCase()] || 'text-secondary-700';
};

/**
 * Get background color for status
 * @param {string} status - Status value
 * @returns {string} Background color class
 */
export const getStatusBgColor = (status) => {
  const bgColors = {
    approved: 'bg-success-50',
    pending: 'bg-warning-50',
    rejected: 'bg-danger-50',
    completed: 'bg-success-50',
    'in-progress': 'bg-warning-50',
    'on-hold': 'bg-secondary-50',
    active: 'bg-success-50',
    inactive: 'bg-secondary-50',
    signed: 'bg-success-50',
    'pending-signature': 'bg-warning-50',
    overdue: 'bg-danger-50',
  };

  return bgColors[status?.toLowerCase()] || 'bg-secondary-50';
};

/**
 * Format status text for display
 * @param {string} status - Status value
 * @returns {string} Formatted status text
 */
export const formatStatus = (status) => {
  if (!status) return 'Unknown';

  return status
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// ============================================================================
// FORM VALIDATION UTILITIES
// ============================================================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[\d\s\-+()]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with details
 */
export const validatePassword = (password) => {
  const result = {
    isValid: false,
    score: 0, // 0-4
    feedback: [],
  };

  if (!password) {
    result.feedback.push('Password is required');
    return result;
  }

  if (password.length < 8) {
    result.feedback.push('Password must be at least 8 characters');
  } else {
    result.score++;
  }

  if (/[a-z]/.test(password)) {
    result.score++;
  } else {
    result.feedback.push('Password must contain lowercase letters');
  }

  if (/[A-Z]/.test(password)) {
    result.score++;
  } else {
    result.feedback.push('Password must contain uppercase letters');
  }

  if (/\d/.test(password)) {
    result.score++;
  } else {
    result.feedback.push('Password must contain numbers');
  }

  result.isValid = result.score >= 4;
  return result;
};

/**
 * Validate ZIP code
 * @param {string} zipCode - ZIP code to validate
 * @returns {boolean} True if valid ZIP code
 */
export const validateZipCode = (zipCode) => {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
};

/**
 * Validate form field
 * @param {string} fieldName - Field name
 * @param {any} value - Field value
 * @returns {string} Error message or empty string if valid
 */
export const validateField = (fieldName, value) => {
  if (!value && value !== 0) {
    return `${fieldName} is required`;
  }

  switch (fieldName.toLowerCase()) {
    case 'email':
      return validateEmail(value) ? '' : 'Invalid email format';
    case 'phone':
      return validatePhone(value) ? '' : 'Invalid phone format';
    case 'zipcode':
    case 'zip':
      return validateZipCode(value) ? '' : 'Invalid ZIP code format (12345 or 12345-6789)';
    case 'password': {
      const pwValidation = validatePassword(value);
      return pwValidation.isValid ? '' : pwValidation.feedback[0] || 'Invalid password';
    }
    default:
      return '';
  }
};

// ============================================================================
// LEAVE & BALANCE UTILITIES
// ============================================================================

/**
 * Calculate leave balance
 * @param {number} totalDays - Total allowed days
 * @param {number} usedDays - Used days
 * @returns {object} Balance information
 */
export const calculateLeaveBalance = (totalDays, usedDays) => {
  const remaining = Math.max(0, totalDays - usedDays);
  const percentage = (usedDays / totalDays) * 100;

  return {
    total: totalDays,
    used: usedDays,
    remaining,
    percentage: Math.round(percentage),
    isLow: remaining <= 2,
    isExhausted: remaining === 0,
  };
};

/**
 * Check for overlapping leaves
 * @param {Date|string} startDate1 - Start date of first leave
 * @param {Date|string} endDate1 - End date of first leave
 * @param {Date|string} startDate2 - Start date of second leave
 * @param {Date|string} endDate2 - End date of second leave
 * @returns {boolean} True if leaves overlap
 */
export const checkLeaveOverlap = (startDate1, endDate1, startDate2, endDate2) => {
  const start1 = new Date(startDate1);
  const end1 = new Date(endDate1);
  const start2 = new Date(startDate2);
  const end2 = new Date(endDate2);

  return !(end1 < start2 || end2 < start1);
};

/**
 * Get leave type badge color
 * @param {string} leaveType - Type of leave
 * @returns {string} Color class
 */
export const getLeaveTypeColor = (leaveType) => {
  const colors = {
    'sick leave': 'bg-red-50 text-red-700 border-red-200',
    vacation: 'bg-blue-50 text-blue-700 border-blue-200',
    'personal leave': 'bg-purple-50 text-purple-700 border-purple-200',
    'emergency leave': 'bg-orange-50 text-orange-700 border-orange-200',
    'paid time off': 'bg-green-50 text-green-700 border-green-200',
  };

  return colors[leaveType?.toLowerCase()] || 'bg-gray-50 text-gray-700 border-gray-200';
};

// ============================================================================
// PERMISSION & ROLE UTILITIES
// ============================================================================

/**
 * Check if user has permission
 * @param {string} userRole - User's role ('hr' or 'employee')
 * @param {string|array} requiredRole - Required role(s)
 * @returns {boolean} True if user has permission
 */
export const hasPermission = (userRole, requiredRole) => {
  if (!userRole || !requiredRole) return false;

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }

  return userRole === requiredRole;
};

/**
 * Check if user is admin/HR
 * @param {string} userRole - User's role
 * @returns {boolean} True if user is admin
 */
export const isAdmin = (userRole) => {
  return userRole === 'hr';
};

/**
 * Check if user is employee
 * @param {string} userRole - User's role
 * @returns {boolean} True if user is employee
 */
export const isEmployee = (userRole) => {
  return userRole === 'employee';
};

/**
 * Get accessible routes based on role
 * @param {string} userRole - User's role
 * @returns {array} Array of accessible route paths
 */
export const getAccessibleRoutes = (userRole) => {
  const baseRoutes = ['/dashboard', '/profile', '/settings'];

  const roleRoutes = {
    hr: ['/employees', '/leave-requests', '/onboarding', '/reports'],
    employee: ['/my-leaves', '/leave-history', '/employee-onboarding'],
  };

  return [...baseRoutes, ...(roleRoutes[userRole] || [])];
};

// ============================================================================
// LOCAL STORAGE UTILITIES
// ============================================================================

/**
 * Set authentication token
 * @param {string} token - Auth token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  }
};

/**
 * Get authentication token
 * @returns {string|null} Auth token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Remove authentication token
 */
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * Save user data to storage
 * @param {object} userData - User data object
 */
export const saveUserData = (userData) => {
  if (userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  }
};

/**
 * Get user data from storage
 * @returns {object|null} User data or null
 */
export const getUserData = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Remove user data from storage
 */
export const removeUserData = () => {
  localStorage.removeItem('user');
};

/**
 * Clear all auth data
 */
export const clearAuthData = () => {
  removeAuthToken();
  removeUserData();
};

/**
 * Store item in localStorage with expiration
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @param {number} expirationMs - Expiration time in milliseconds
 */
export const setStorageWithExpiry = (key, value, expirationMs) => {
  const item = {
    value: value,
    expiry: new Date().getTime() + expirationMs,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

/**
 * Get item from localStorage with expiration check
 * @param {string} key - Storage key
 * @returns {any} Stored value or null if expired
 */
export const getStorageWithExpiry = (key) => {
  const item = localStorage.getItem(key);
  if (!item) return null;

  const parsed = JSON.parse(item);
  if (new Date().getTime() > parsed.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return parsed.value;
};

// ============================================================================
// CSV EXPORT UTILITIES
// ============================================================================

/**
 * Export data to CSV
 * @param {array} data - Array of objects to export
 * @param {string} filename - CSV filename
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from first object keys
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(',')
    ),
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Format data for CSV export
 * @param {array} items - Items to format
 * @param {array} fields - Fields to include
 * @returns {array} Formatted data
 */
export const formatDataForCSV = (items, fields) => {
  return items.map((item) => {
    const row = {};
    fields.forEach((field) => {
      const keys = field.split('.');
      let value = item;
      for (const key of keys) {
        value = value?.[key];
      }
      row[field] = value || '';
    });
    return row;
  });
};

/**
 * Download CSV from URL
 * @param {string} url - CSV file URL
 * @param {string} filename - Filename for download
 */
export const downloadCSVFromUrl = (url, filename = 'download.csv') => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ============================================================================
// STRING UTILITIES
// ============================================================================

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert string to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} length - Max length
 * @returns {string} Truncated string
 */
export const truncate = (str, length = 50) => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
};

// ============================================================================
// NUMBER UTILITIES
// ============================================================================

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (typeof num !== 'number') return '0';
  return num.toLocaleString('en-US');
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// ============================================================================
// NOTIFICATION UTILITIES
// ============================================================================

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Deep clone object
 * @param {object} obj - Object to clone
 * @returns {object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

export default {
  // Date utilities
  formatDate,
  calculateDuration,
  isPastDate,
  isToday,
  addDays,

  // Status utilities
  getStatusColor,
  getStatusTextColor,
  getStatusBgColor,
  formatStatus,

  // Validation
  validateEmail,
  validatePhone,
  validatePassword,
  validateZipCode,
  validateField,

  // Leave utilities
  calculateLeaveBalance,
  checkLeaveOverlap,
  getLeaveTypeColor,

  // Permissions
  hasPermission,
  isAdmin,
  isEmployee,
  getAccessibleRoutes,

  // Storage
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  saveUserData,
  getUserData,
  removeUserData,
  clearAuthData,
  setStorageWithExpiry,
  getStorageWithExpiry,

  // CSV
  exportToCSV,
  formatDataForCSV,
  downloadCSVFromUrl,

  // String utilities
  capitalize,
  toTitleCase,
  truncate,

  // Number utilities
  formatNumber,
  formatCurrency,

  // General utilities
  generateUniqueId,
  deepClone,
};
