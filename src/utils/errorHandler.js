/**
 * Error Handler Utilities
 * Comprehensive error handling, logging, and recovery mechanisms
 */

/**
 * Error types for categorization
 */
export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  CLIENT_ERROR: 'CLIENT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

/**
 * HTTP status code mapping to error types
 */
const STATUS_CODE_MAP = {
  400: ERROR_TYPES.VALIDATION_ERROR,
  401: ERROR_TYPES.AUTHENTICATION_ERROR,
  403: ERROR_TYPES.AUTHORIZATION_ERROR,
  404: ERROR_TYPES.NOT_FOUND_ERROR,
  408: ERROR_TYPES.TIMEOUT_ERROR,
  429: 'RATE_LIMIT_ERROR',
  500: ERROR_TYPES.SERVER_ERROR,
  502: ERROR_TYPES.SERVER_ERROR,
  503: ERROR_TYPES.SERVER_ERROR,
  504: ERROR_TYPES.TIMEOUT_ERROR,
};

/**
 * Classify error by type
 * @param {Error|Object} error - Error object
 * @returns {Object} Classified error with type and details
 */
export const classifyError = (error) => {
  const classified = {
    type: ERROR_TYPES.UNKNOWN_ERROR,
    message: 'An unexpected error occurred',
    status: null,
    code: null,
    isRetryable: false,
  };

  // Network errors
  if (!error) {
    classified.type = ERROR_TYPES.NETWORK_ERROR;
    classified.message = 'Network error. Please check your connection.';
    classified.isRetryable = true;
    return classified;
  }

  // Axios errors
  if (error.response) {
    classified.status = error.response.status;
    classified.type = STATUS_CODE_MAP[error.response.status] || ERROR_TYPES.SERVER_ERROR;
    classified.message = error.response.data?.message || error.message;
    classified.code = error.response.data?.code;

    // Determine if retryable
    classified.isRetryable = [408, 429, 500, 502, 503, 504].includes(error.response.status);
  } else if (error.request) {
    // Request made but no response
    classified.type = ERROR_TYPES.NETWORK_ERROR;
    classified.message = 'No response from server. Please check your connection.';
    classified.isRetryable = true;
  } else if (error.code === 'ECONNABORTED') {
    classified.type = ERROR_TYPES.TIMEOUT_ERROR;
    classified.message = 'Request timeout. Please try again.';
    classified.isRetryable = true;
  } else if (error.message) {
    classified.message = error.message;
  }

  return classified;
};

/**
 * Get user-friendly error message
 * @param {Error|Object} error - Error object
 * @returns {string} User-friendly error message
 */
export const getUserFriendlyMessage = (error) => {
  const classified = classifyError(error);

  const messages = {
    [ERROR_TYPES.NETWORK_ERROR]: 'Network connection failed. Please check your internet and try again.',
    [ERROR_TYPES.TIMEOUT_ERROR]: 'Request took too long. Please try again.',
    [ERROR_TYPES.AUTHENTICATION_ERROR]: 'Your session has expired. Please log in again.',
    [ERROR_TYPES.AUTHORIZATION_ERROR]: 'You do not have permission to access this resource.',
    [ERROR_TYPES.NOT_FOUND_ERROR]: 'The requested resource was not found.',
    [ERROR_TYPES.VALIDATION_ERROR]: classified.message || 'Please check your input and try again.',
    [ERROR_TYPES.SERVER_ERROR]: 'Server error. Please try again later.',
    [ERROR_TYPES.CLIENT_ERROR]: classified.message || 'Something went wrong. Please try again.',
    [ERROR_TYPES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
    RATE_LIMIT_ERROR: 'Too many requests. Please wait a moment and try again.',
  };

  return messages[classified.type] || classified.message || 'An error occurred';
};

/**
 * Log error for debugging
 * @param {Error|Object} error - Error object
 * @param {string} context - Context where error occurred
 * @param {*} additionalData - Additional data to log
 */
export const logError = (error, context = 'Unknown', additionalData = {}) => {
  const classified = classifyError(error);

  const errorLog = {
    timestamp: new Date().toISOString(),
    context,
    type: classified.type,
    message: classified.message,
    status: classified.status,
    code: classified.code,
    additionalData,
    stack: error?.stack,
  };

  console.error('[Error Log]', errorLog);

  // In production, could send to error tracking service (Sentry, LogRocket, etc.)
  if (import.meta.env.PROD) {
    // Send to error tracking service
    // Example: Sentry.captureException(error, { contexts: { app: errorLog } });
  }
};

/**
 * Check if error is retryable
 * @param {Error|Object} error - Error object
 * @returns {boolean} True if error is retryable
 */
export const isRetryableError = (error) => {
  const classified = classifyError(error);
  return classified.isRetryable;
};

/**
 * Retry failed operation with exponential backoff
 * @param {Function} operation - Async operation to retry
 * @param {Object} options - Retry options
 * @returns {Promise} Result of successful operation
 */
export const retryWithExponentialBackoff = async (
  operation,
  options = {}
) => {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    onRetry = null,
  } = options;

  let lastError;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Check if error is retryable
      if (!isRetryableError(error) || attempt === maxRetries) {
        throw error;
      }

      // Call retry callback
      if (onRetry) {
        onRetry(attempt + 1, delay, error);
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Calculate next delay with exponential backoff
      delay = Math.min(delay * backoffMultiplier, maxDelay);
    }
  }

  throw lastError;
};

/**
 * Handle API error response
 * @param {Error} error - Axios error
 * @returns {Object} Structured error object
 */
export const handleApiError = (error) => {
  const classified = classifyError(error);

  return {
    type: classified.type,
    message: getUserFriendlyMessage(error),
    status: classified.status,
    code: classified.code,
    isRetryable: classified.isRetryable,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Network status detector
 * @returns {boolean} True if online
 */
export const isOnline = () => {
  return typeof navigator !== 'undefined' && navigator.onLine;
};

/**
 * Wait for network to be available
 * @param {number} timeout - Timeout in ms (default: 30000)
 * @returns {Promise} Resolves when online
 */
export const waitForNetwork = (timeout = 30000) => {
  return new Promise((resolve, reject) => {
    if (isOnline()) {
      resolve();
      return;
    }

    const handleOnline = () => {
      window.removeEventListener('online', handleOnline);
      clearTimeout(timeoutId);
      resolve();
    };

    const timeoutId = setTimeout(() => {
      window.removeEventListener('online', handleOnline);
      reject(new Error('Network timeout'));
    }, timeout);

    window.addEventListener('online', handleOnline);
  });
};

/**
 * Create error object with standard structure
 * @param {string} message - Error message
 * @param {string} type - Error type
 * @param {*} data - Additional error data
 * @returns {Error} Structured error
 */
export const createError = (message, type = ERROR_TYPES.UNKNOWN_ERROR, data = {}) => {
  const error = new Error(message);
  error.type = type;
  error.data = data;
  return error;
};

/**
 * Validate API response
 * @param {*} response - API response
 * @returns {*} Validated response
 */
export const validateResponse = (response) => {
  if (!response) {
    throw createError('Empty response from server', ERROR_TYPES.SERVER_ERROR);
  }

  if (response.error) {
    throw createError(response.error.message || 'API Error', ERROR_TYPES.CLIENT_ERROR, response.error);
  }

  return response;
};

/**
 * Safe async wrapper with error handling
 * @param {Function} fn - Async function to wrap
 * @param {Function} onError - Error handler (optional)
 * @returns {Function} Wrapped function
 */
export const safeAsync = (fn, onError = null) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, fn.name);
      if (onError) {
        return onError(error);
      }
      throw error;
    }
  };
};

/**
 * Debounce function with error handling
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} Debounced function
 */
export const debounceWithErrorHandling = (fn, delay = 300) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      try {
        fn(...args);
      } catch (error) {
        logError(error, 'Debounced function');
      }
    }, delay);
  };
};

export default {
  ERROR_TYPES,
  classifyError,
  getUserFriendlyMessage,
  logError,
  isRetryableError,
  retryWithExponentialBackoff,
  handleApiError,
  isOnline,
  waitForNetwork,
  createError,
  validateResponse,
  safeAsync,
  debounceWithErrorHandling,
};
