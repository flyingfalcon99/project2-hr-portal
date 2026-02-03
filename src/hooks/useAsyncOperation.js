import { useState, useCallback } from 'react';
import { ERROR_TYPES, isRetryableError } from '../utils/errorHandler';

/**
 * useAsyncOperation Hook
 * Manages loading, error, and success states for async operations
 * Provides built-in retry logic and error handling
 */
export const useAsyncOperation = (onError = null) => {
  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null,
    retryCount: 0,
    isRetrying: false,
  });

  // Execute async operation with automatic error handling
  const execute = useCallback(
    async (operation, options = {}) => {
      const {
        onSuccess = null,
        maxRetries = 3,
        retryDelay = 1000,
        autoRetry = true,
        shouldRetry = null,
      } = options;

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const result = await operation();

        setState((prev) => ({
          ...prev,
          loading: false,
          data: result,
          error: null,
          retryCount: 0,
        }));

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (error) {
        // Check if error should be retried
        const shouldRetryError =
          shouldRetry ? shouldRetry(error) : isRetryableError(error);

        if (autoRetry && shouldRetryError && state.retryCount < maxRetries) {
          setState((prev) => ({
            ...prev,
            isRetrying: true,
            retryCount: prev.retryCount + 1,
          }));

          // Wait before retry
          await new Promise((resolve) =>
            setTimeout(resolve, retryDelay * Math.pow(2, state.retryCount))
          );

          // Retry the operation
          return execute(operation, {
            ...options,
            autoRetry: true,
          });
        }

        // Max retries exceeded or non-retryable error
        setState((prev) => ({
          ...prev,
          loading: false,
          error: {
            message: error.message || 'An error occurred',
            type: error.type || ERROR_TYPES.UNKNOWN,
            originalError: error,
            retryCount: prev.retryCount,
            maxRetriesExceeded: prev.retryCount >= maxRetries,
          },
          isRetrying: false,
        }));

        if (onError) {
          onError(error);
        }

        throw error;
      }
    },
    [state.retryCount, onError]
  );

  // Manual retry function
  const retry = useCallback(
    (operation, options = {}) => {
      setState((prev) => ({
        ...prev,
        retryCount: 0,
        error: null,
      }));
      return execute(operation, options);
    },
    [execute]
  );

  // Clear error state
  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  // Reset entire state
  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      data: null,
      retryCount: 0,
      isRetrying: false,
    });
  }, []);

  return {
    ...state,
    execute,
    retry,
    clearError,
    reset,
  };
};

export default useAsyncOperation;
