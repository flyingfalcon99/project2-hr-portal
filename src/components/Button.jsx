import React from 'react';
import { TOUCH_SIZES, BUTTON_RESPONSIVE } from '../utils/responsiveUtils';

/**
 * Reusable Button Component with responsive design
 * @param {string} variant - Button style variant ('primary', 'secondary', 'danger', 'success', 'outline', 'ghost')
 * @param {string} size - Button size ('sm', 'md', 'lg', 'touch')
 * @param {boolean} loading - Show loading state
 * @param {boolean} disabled - Disable button
 * @param {string} className - Additional CSS classes
 * @param {ReactNode} children - Button content
 * @param {function} onClick - Click handler
 * @param {object} props - Additional props (type, title, etc.)
 * @param {boolean} responsive - Enable responsive sizing (44px minimum on mobile)
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  onClick,
  type = 'button',
  responsive = true,
  ...props
}) => {
  // Base styles
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Size variants with responsive touch sizing
  const sizeStyles = {
    sm: responsive ? 'px-3 py-2 md:py-1.5 text-xs md:text-sm min-h-10 md:min-h-auto' : 'px-3 py-1.5 text-sm',
    md: responsive ? 'px-4 md:px-4 py-3 md:py-2 text-sm md:text-base min-h-11 md:min-h-auto' : 'px-4 py-2 text-base',
    lg: responsive ? 'px-6 md:px-6 py-3 md:py-3 text-base md:text-lg min-h-12 md:min-h-auto' : 'px-6 py-3 text-lg',
    touch: TOUCH_SIZES.medium + ' px-4 text-base',
  };

  // Color variants
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-primary-400',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 disabled:bg-secondary-400',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 disabled:bg-danger-400',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 disabled:bg-success-400',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 disabled:border-primary-400 disabled:text-primary-400',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500 disabled:text-primary-400',
  };

  const handleClick = (e) => {
    if (!loading && !disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.primary}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
