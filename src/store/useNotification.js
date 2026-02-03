import { useCallback } from 'react';
import { useAppDispatch } from './hooks';
import {
  showSuccessNotification,
  showErrorNotification,
  showWarningNotification,
  showInfoNotification,
} from '@/store/notificationSlice';

/**
 * useNotification
 * 
 * Custom hook for convenient notification dispatch.
 * Provides methods to show different types of notifications without manual Redux dispatch.
 * 
 * @hook
 * @returns {Object} Notification methods
 * @returns {Function} success - Show success notification
 * @returns {Function} error - Show error notification
 * @returns {Function} warning - Show warning notification
 * @returns {Function} info - Show info notification
 * 
 * @example
 * const { success, error } = useNotification();
 * 
 * try {
 *   await loginUser();
 *   success('Login Successful!', 'Redirecting to dashboard...');
 * } catch (err) {
 *   error('Login Failed', 'Please check your credentials');
 * }
 */
function useNotification() {
  const dispatch = useAppDispatch();

  /**
   * Show success notification
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {number} duration - Auto-dismiss duration in ms (default 5000)
   * @returns {string} Notification ID for reference/removal
   */
  const success = useCallback((title, message, duration = 5000) => {
    return dispatch(showSuccessNotification(title, message, duration));
  }, [dispatch]);

  /**
   * Show error notification
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {number} duration - Auto-dismiss duration in ms (default 5000)
   * @returns {string} Notification ID for reference/removal
   */
  const error = useCallback((title, message, duration = 5000) => {
    return dispatch(showErrorNotification(title, message, duration));
  }, [dispatch]);

  /**
   * Show warning notification
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {number} duration - Auto-dismiss duration in ms (default 5000)
   * @returns {string} Notification ID for reference/removal
   */
  const warning = useCallback((title, message, duration = 5000) => {
    return dispatch(showWarningNotification(title, message, duration));
  }, [dispatch]);

  /**
   * Show info notification
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {number} duration - Auto-dismiss duration in ms (default 5000)
   * @returns {string} Notification ID for reference/removal
   */
  const info = useCallback((title, message, duration = 5000) => {
    return dispatch(showInfoNotification(title, message, duration));
  }, [dispatch]);

  return {
    success,
    error,
    warning,
    info,
  };
}

export default useNotification;
