import React, { useEffect, useState } from 'react';

/**
 * SuccessMessage Component
 * Displays success notifications with auto-dismiss
 * 
 * @component
 * @example
 * <SuccessMessage 
 *   message="Form submitted successfully!" 
 *   onDismiss={() => setShowSuccess(false)}
 *   autoClose={true}
 *   duration={5000}
 * />
 */
const SuccessMessage = ({
  message,
  title = 'Success',
  onDismiss,
  autoClose = true,
  duration = 5000,
  actionLabel,
  onAction,
  icon,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!autoClose) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [autoClose, duration, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className={`
      bg-success-50 border border-success-200 rounded-lg p-4 
      shadow-sm animation-slideDown
      ${className}
    `}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        {icon || (
          <svg
            className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}

        {/* Content */}
        <div className="flex-1">
          {title && (
            <h3 className="font-semibold text-success-900">{title}</h3>
          )}
          {message && (
            <p className="text-sm text-success-800 mt-1">{message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {actionLabel && onAction && (
            <button
              onClick={() => {
                onAction();
                setIsVisible(false);
              }}
              className="text-sm font-medium text-success-700 hover:text-success-900 transition-colors"
            >
              {actionLabel}
            </button>
          )}

          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss?.();
            }}
            className="text-success-400 hover:text-success-600 transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
