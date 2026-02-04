import axios from 'axios';
import {
  classifyError,
  getUserFriendlyMessage,
  logError,
  retryWithExponentialBackoff,
} from '../utils/errorHandler';

// Get API configuration from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
});

// Request Interceptor - Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors with enhanced error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Classify the error
    const classifiedError = classifyError(error);

    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Log error with context
    logError(error, {
      endpoint: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
    });

    // Return classified error with user-friendly message
    return Promise.reject({
      ...classifiedError,
      userMessage: getUserFriendlyMessage(classifiedError),
      originalError: error,
    });
  }
);

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} User and token data
 */
export const authLogin = (email, password) => {
  return api.post('/auth/login', { email, password }).then((data) => {
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  });
};

/**
 * Register new employee
 * @param {object} userData - Employee data (firstName, lastName, email, phone, department, position, password)
 * @returns {Promise} Created employee and user data
 */
export const authRegister = (userData) => {
  return api.post('/auth/register', userData);
};

/**
 * Logout current user
 * @returns {Promise} Logout response
 */
export const authLogout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  return Promise.resolve({ message: 'Logged out successfully' });
};

/**
 * Get current user info
 * @returns {Promise} Current user data
 */
export const authGetCurrentUser = () => {
  return api.get('/auth/me');
};

// ============================================================================
// EMPLOYEE ENDPOINTS
// ============================================================================

/**
 * Get all employees with optional filters
 * @param {object} params - Query parameters (page, limit, search, department, status)
 * @returns {Promise} Array of employees and pagination info
 */
export const employeeGetAll = (params = {}) => {
  return api.get('/employees', { params });
};

/**
 * Get employee by ID
 * @param {number|string} id - Employee ID
 * @returns {Promise} Employee data
 */
export const employeeGetById = (id) => {
  return api.get(`/employees/${id}`);
};

/**
 * Create new employee
 * @param {object} employeeData - Employee data
 * @returns {Promise} Created employee
 */
export const employeeCreate = (employeeData) => {
  return api.post('/employees', employeeData);
};

/**
 * Update employee
 * @param {number|string} id - Employee ID
 * @param {object} updates - Data to update
 * @returns {Promise} Updated employee
 */
export const employeeUpdate = (id, updates) => {
  return api.put(`/employees/${id}`, updates);
};

/**
 * Delete employee
 * @param {number|string} id - Employee ID
 * @returns {Promise} Deletion confirmation
 */
export const employeeDelete = (id) => {
  return api.delete(`/employees/${id}`);
};

/**
 * Export employees to CSV
 * @param {object} params - Query parameters for filtering
 * @returns {Promise} CSV data
 */
export const employeeExportCSV = (params = {}) => {
  return api.get('/employees/export/csv', { params, responseType: 'blob' });
};

// ============================================================================
// LEAVE ENDPOINTS
// ============================================================================

/**
 * Get all leave requests (HR view)
 * @param {object} params - Query parameters (status, page, limit)
 * @returns {Promise} Array of leave requests
 */
export const leaveGetAll = (params = {}) => {
  return api.get('/leaves', { params });
};

/**
 * Get leave requests for specific employee
 * @param {number|string} employeeId - Employee ID
 * @returns {Promise} Array of employee's leave requests
 */
export const leaveGetByEmployee = (employeeId) => {
  return api.get(`/leaves/employee/${employeeId}`);
};

/**
 * Submit new leave request
 * @param {object} leaveData - Leave data (leaveType, startDate, endDate, reason)
 * @returns {Promise} Created leave request
 */
export const leaveSubmit = (leaveData) => {
  return api.post('/leaves', leaveData);
};

/**
 * Approve leave request
 * @param {number|string} leaveId - Leave request ID
 * @param {string} approvedBy - HR staff ID or name
 * @returns {Promise} Updated leave request
 */
export const leaveApprove = (leaveId, approvedBy) => {
  return api.put(`/leaves/${leaveId}/approve`, { approvedBy });
};

/**
 * Reject leave request
 * @param {number|string} leaveId - Leave request ID
 * @param {object} rejectionData - Rejection reason and approver
 * @returns {Promise} Updated leave request
 */
export const leaveReject = (leaveId, rejectionData) => {
  return api.put(`/leaves/${leaveId}/reject`, rejectionData);
};

/**
 * Cancel leave request
 * @param {number|string} leaveId - Leave request ID
 * @returns {Promise} Updated leave request
 */
export const leaveCancel = (leaveId) => {
  return api.put(`/leaves/${leaveId}/cancel`, {});
};

/**
 * Get leave balance for employee
 * @param {number|string} employeeId - Employee ID
 * @returns {Promise} Leave balance data
 */
export const leaveGetBalance = (employeeId) => {
  return api.get(`/leaves/balance/${employeeId}`);
};

// ============================================================================
// ONBOARDING ENDPOINTS
// ============================================================================

/**
 * Get all onboarding records
 * @param {object} params - Query parameters (status, page, limit)
 * @returns {Promise} Array of onboarding records
 */
export const onboardingGetAll = (params = {}) => {
  return api.get('/onboarding', { params });
};

/**
 * Get onboarding record by employee ID
 * @param {number|string} employeeId - Employee ID
 * @returns {Promise} Onboarding record
 */
export const onboardingGetByEmployee = (employeeId) => {
  return api.get(`/onboarding/employee/${employeeId}`);
};

/**
 * Get onboarding record by ID
 * @param {number|string} onboardingId - Onboarding record ID
 * @returns {Promise} Onboarding record details
 */
export const onboardingGetById = (onboardingId) => {
  return api.get(`/onboarding/${onboardingId}`);
};

/**
 * Create new onboarding record
 * @param {object} onboardingData - Onboarding data (employeeId, tasks, documents)
 * @returns {Promise} Created onboarding record
 */
export const onboardingCreate = (onboardingData) => {
  return api.post('/onboarding', onboardingData);
};

/**
 * Update task status in onboarding
 * @param {number|string} onboardingId - Onboarding record ID
 * @param {number|string} taskId - Task ID
 * @param {object} taskData - Task update data (status, completedDate, etc.)
 * @returns {Promise} Updated onboarding record
 */
export const onboardingUpdateTask = (onboardingId, taskId, taskData) => {
  return api.put(`/onboarding/${onboardingId}/tasks/${taskId}`, taskData);
};

/**
 * Upload document for onboarding
 * @param {number|string} onboardingId - Onboarding record ID
 * @param {FormData} formData - Form data with file
 * @returns {Promise} Upload response
 */
export const onboardingUploadDocument = (onboardingId, formData) => {
  return api.post(`/onboarding/${onboardingId}/documents/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Update document status
 * @param {number|string} onboardingId - Onboarding record ID
 * @param {number|string} documentId - Document ID
 * @param {object} documentData - Document update data (status, etc.)
 * @returns {Promise} Updated onboarding record
 */
export const onboardingUpdateDocument = (onboardingId, documentId, documentData) => {
  return api.put(`/onboarding/${onboardingId}/documents/${documentId}`, documentData);
};

/**
 * Complete onboarding
 * @param {number|string} onboardingId - Onboarding record ID
 * @returns {Promise} Completed onboarding record
 */
export const onboardingComplete = (onboardingId) => {
  return api.put(`/onboarding/${onboardingId}/complete`, {});
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check API connectivity
 * @returns {Promise} API health status
 */
export const apiHealthCheck = () => {
  return api.get('/health').catch(() => {
    throw new Error('API server is not responding');
  });
};

/**
 * Get file download URL
 * @param {string} fileId - File ID
 * @returns {string} Download URL
 */
export const getFileDownloadUrl = (fileId) => {
  return `${api.defaults.baseURL}/files/${fileId}/download`;
};

/**
 * Handle batch operations
 * @param {array} requests - Array of API request functions
 * @returns {Promise} Array of results
 */
export const batchRequests = (requests) => {
  return Promise.all(requests);
};

/**
 * API call wrapper with automatic retry logic
 * @param {Function} apiCall - API function to execute
 * @param {object} options - Retry options (maxRetries, retryDelay, etc.)
 * @returns {Promise} API response
 */
export const withRetry = (apiCall, options = {}) => {
  return retryWithExponentialBackoff(apiCall, {
    maxRetries: 3,
    initialDelay: 1000,
    ...options,
  });
};

/**
 * Create and configure an error handler for API calls
 * @param {string} operation - Operation name for logging
 * @returns {Function} Error handler function
 */
export const createApiErrorHandler = (operation) => {
  return (error) => {
    logError(error, {
      operation,
      context: 'API Call',
    });
    throw error;
  };
};

export default api;
