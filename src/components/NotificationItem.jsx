import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * NotificationItem
 * 
 * Displays a single toast notification with type-specific styling and icons.
 * Supports success, error, warning, and info notification types.
 * Includes close button and smooth animations.
 * 
 * @component
 * @param {Object} notification - Notification object from Redux
 * @param {string} notification.id - Unique notification identifier
 * @param {string} notification.type - Notification type: 'success' | 'error' | 'warning' | 'info'
 * @param {string} notification.title - Notification title
 * @param {string} notification.message - Notification message
 * @param {number} notification.duration - Auto-dismiss duration in milliseconds
 * @param {Function} onClose - Callback function when close button is clicked
 * 
 * @example
 * <NotificationItem
 *   notification={{ id: '1', type: 'success', title: 'Success', message: 'Operation completed' }}
 *   onClose={() => handleClose('1')}
 * />
 * 
 * @returns {JSX.Element} Styled notification item with animation
 */
function NotificationItem({ notification, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const { type = 'info', title, message } = notification;

  /**
   * Style configuration for different notification types
   * Includes colors, icons, and Tailwind classes
   */
  const styleConfig = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      titleColor: 'text-green-900',
      messageColor: 'text-green-700',
      iconColor: 'text-green-600',
      icon: '✓',
      ariaLabel: 'Success notification',
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      titleColor: 'text-red-900',
      messageColor: 'text-red-700',
      iconColor: 'text-red-600',
      icon: '✕',
      ariaLabel: 'Error notification',
    },
    warning: {
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      titleColor: 'text-amber-900',
      messageColor: 'text-amber-700',
      iconColor: 'text-amber-600',
      icon: '⚠',
      ariaLabel: 'Warning notification',
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      titleColor: 'text-blue-900',
      messageColor: 'text-blue-700',
      iconColor: 'text-blue-600',
      icon: 'ℹ',
      ariaLabel: 'Information notification',
    },
  };

  const style = styleConfig[type] || styleConfig.info;

  /**
   * Handle close button click with closing animation
   */
  const handleCloseClick = () => {
    setIsClosing(true);
    // Allow animation to complete before removing from DOM
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div
      className={`
        ${style.bgColor} ${style.borderColor}
        border rounded-lg shadow-lg p-4 max-w-sm w-full
        flex gap-3 items-start
        ${isClosing ? 'animate-slideOut' : 'animate-slideIn'}
        transition-all duration-200
      `}
      role="alert"
      aria-label={style.ariaLabel}
      aria-live="polite"
    >
      {/* Icon */}
      <div className={`${style.iconColor} flex-shrink-0 text-lg font-bold mt-0.5`}>
        {style.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <div className={`${style.titleColor} font-semibold text-sm mb-1`}>
            {title}
          </div>
        )}
        {message && (
          <div className={`${style.messageColor} text-sm break-words`}>
            {message}
          </div>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={handleCloseClick}
        className={`
          ${style.iconColor} hover:opacity-70
          flex-shrink-0 text-lg leading-none
          transition-opacity duration-150
          focus:outline-none focus:ring-2 focus:ring-offset-2
          rounded p-0.5
        `}
        aria-label="Close notification"
        type="button"
      >
        ✕
      </button>
    </div>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
    title: PropTypes.string,
    message: PropTypes.string,
    duration: PropTypes.number,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NotificationItem;
