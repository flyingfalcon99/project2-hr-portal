import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectNotifications, removeNotification } from '@/store/notificationSlice';
import NotificationItem from './NotificationItem';

/**
 * NotificationContainer
 * 
 * Displays a queue of toast notifications in the top-right corner of the screen.
 * Automatically removes notifications after their configured duration expires.
 * Supports multiple simultaneous notifications with smooth animations.
 * 
 * @component
 * @example
 * // Add to App or main Layout component
 * <NotificationContainer />
 * 
 * @returns {JSX.Element} Fixed positioned container with notification items
 */
function NotificationContainer() {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);

  /**
   * Handle auto-dismiss of notifications
   * Each notification is removed after its configured duration (default 5000ms)
   */
  useEffect(() => {
    const timers = notifications.map((notification) => {
      const timer = setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, notification.duration || 5000);

      return { id: notification.id, timer };
    });

    return () => {
      timers.forEach(({ timer }) => {
        clearTimeout(timer);
      });
    };
  }, [notifications, dispatch]);

  /**
   * Track which notifications should be displayed
   * Used for animation state tracking
   */
  useEffect(() => {
    // Keep track of displayed notifications without setState
    if (notifications && notifications.length > 0) {
      notifications.map(n => n.id);
    }
  }, [notifications]);

  /**
   * Handle manual close button click
   * Remove notification immediately before auto-dismiss
   */
  const handleClose = (notificationId) => {
    dispatch(removeNotification(notificationId));
  };

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      aria-label="Notifications"
      role="region"
      aria-live="polite"
      aria-atomic="false"
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="pointer-events-auto animate-slideIn"
        >
          <NotificationItem
            notification={notification}
            onClose={() => handleClose(notification.id)}
          />
        </div>
      ))}
    </div>
  );
}

export default NotificationContainer;
