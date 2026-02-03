import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Add a new notification
    addNotification: (state, action) => {
      const {
        id = Date.now() + Math.random(),
        type = 'info',
        title,
        message,
        duration = 5000,
        action: actionName,
      } = action.payload;

      state.notifications.push({
        id,
        type, // 'success', 'error', 'warning', 'info'
        title,
        message,
        duration,
        action: actionName,
        timestamp: new Date().toISOString(),
      });
    },

    // Remove a specific notification
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },

    // Remove all notifications
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Update a notification
    updateNotification: (state, action) => {
      const { id, updates } = action.payload;
      const notification = state.notifications.find((n) => n.id === id);
      if (notification) {
        Object.assign(notification, updates);
      }
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearNotifications,
  updateNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;

/**
 * Selector: Get all notifications
 */
export const selectNotifications = (state) => state.notifications.notifications;

/**
 * Selector: Get notification count
 */
export const selectNotificationCount = (state) =>
  state.notifications.notifications.length;

/**
 * Thunk: Show success notification with auto-dismiss
 */
export const showSuccessNotification = (title, message, duration = 5000) => (
  dispatch
) => {
  const id = Date.now() + Math.random();
  dispatch(
    addNotification({
      id,
      type: 'success',
      title: title || 'Success',
      message,
      duration,
    })
  );
  return id;
};

/**
 * Thunk: Show error notification with auto-dismiss
 */
export const showErrorNotification = (title, message, duration = 5000) => (
  dispatch
) => {
  const id = Date.now() + Math.random();
  dispatch(
    addNotification({
      id,
      type: 'error',
      title: title || 'Error',
      message,
      duration,
    })
  );
  return id;
};

/**
 * Thunk: Show warning notification
 */
export const showWarningNotification = (title, message, duration = 5000) => (
  dispatch
) => {
  const id = Date.now() + Math.random();
  dispatch(
    addNotification({
      id,
      type: 'warning',
      title: title || 'Warning',
      message,
      duration,
    })
  );
  return id;
};

/**
 * Thunk: Show info notification
 */
export const showInfoNotification = (title, message, duration = 5000) => (
  dispatch
) => {
  const id = Date.now() + Math.random();
  dispatch(
    addNotification({
      id,
      type: 'info',
      title: title || 'Information',
      message,
      duration,
    })
  );
  return id;
};
