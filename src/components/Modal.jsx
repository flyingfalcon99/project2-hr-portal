import React, { useEffect } from 'react';
import { useIsMobile } from '../utils/responsiveUtils';

/**
 * Reusable Modal Component with responsive design
 * @param {boolean} isOpen - Modal visibility state
 * @param {function} onClose - Close handler
 * @param {string} title - Modal title
 * @param {ReactNode} children - Modal content
 * @param {ReactNode} footer - Modal footer (typically action buttons)
 * @param {string} size - Modal size ('sm', 'md', 'lg', 'xl', 'full')
 * @param {boolean} closeOnBackdrop - Close when clicking backdrop
 * @param {boolean} closeButton - Show close button
 * @param {string} className - Additional CSS classes
 * @param {function} onOpen - Callback when modal opens
 * @param {boolean} responsive - Enable responsive design (mobile optimization)
 */
const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  closeButton = true,
  className = '',
  onOpen,
  responsive = true,
}) => {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      if (onOpen) onOpen();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onOpen]);

  if (!isOpen) return null;

  // Size variants - responsive versions
  const sizeStyles = {
    sm: responsive && isMobile ? 'max-w-full mx-4' : 'max-w-sm',
    md: responsive && isMobile ? 'max-w-full mx-4' : 'max-w-md',
    lg: responsive && isMobile ? 'max-w-full mx-4' : 'max-w-lg',
    xl: responsive && isMobile ? 'max-w-full mx-4' : 'max-w-xl',
    full: 'max-w-full mx-4',
  };

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={`
            bg-white rounded-lg shadow-2xl flex flex-col
            ${responsive && isMobile ? 'max-h-[95vh]' : 'max-h-[90vh]'}
            ${responsive && isMobile ? 'p-4' : 'p-0'}
            pointer-events-auto
            ${sizeStyles[size] || sizeStyles.md}
            ${className}
          `}
        >
          {/* Header */}
          {title && (
            <div className={`
              border-b border-gray-200 flex items-center justify-between
              ${responsive && isMobile ? 'px-4 py-3' : 'px-6 py-4'}
            `}>
              <h2 className={`font-semibold text-gray-900 ${responsive && isMobile ? 'text-lg' : 'text-xl'}`}>
                {title}
              </h2>
              {closeButton && (
                <button
                  onClick={onClose}
                  className={`
                    text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0
                    ${responsive && isMobile ? 'p-2' : 'p-1'}
                  `}
                  aria-label="Close modal"
                >
                  <svg
                    className={responsive && isMobile ? 'w-6 h-6' : 'w-6 h-6'}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className={`
            flex-1 overflow-y-auto
            ${responsive && isMobile ? 'px-4 py-3' : 'px-6 py-4'}
          `}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className={`
              border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-end gap-3
              ${responsive && isMobile ? 'px-4 py-3' : 'px-6 py-4'}
            `}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;
