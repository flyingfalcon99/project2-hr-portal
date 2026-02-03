import React from 'react';

/**
 * Reusable Badge Component for Status Indicators
 * @param {string} children - Badge content
 * @param {string} variant - Badge style variant ('primary', 'secondary', 'success', 'danger', 'warning', 'info', 'neutral')
 * @param {string} size - Badge size ('sm', 'md', 'lg')
 * @param {string} shape - Badge shape ('rounded', 'pill')
 * @param {boolean} outline - Use outline style
 * @param {string} icon - Icon element or component
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props
 */
const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  shape = 'rounded',
  outline = false,
  icon,
  className = '',
  ...props
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-semibold whitespace-nowrap';

  // Size variants
  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  // Shape variants
  const shapeStyles = {
    rounded: 'rounded-md',
    pill: 'rounded-full',
  };

  // Color variants (filled)
  const filledVariants = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success-100 text-success-800',
    danger: 'bg-danger-100 text-danger-800',
    warning: 'bg-warning-100 text-warning-800',
    info: 'bg-info-100 text-info-800',
    neutral: 'bg-gray-100 text-gray-800',
  };

  // Color variants (outline)
  const outlineVariants = {
    primary: 'border-2 border-primary-300 text-primary-700',
    secondary: 'border-2 border-secondary-300 text-secondary-700',
    success: 'border-2 border-success-300 text-success-700',
    danger: 'border-2 border-danger-300 text-danger-700',
    warning: 'border-2 border-warning-300 text-warning-700',
    info: 'border-2 border-info-300 text-info-700',
    neutral: 'border-2 border-gray-300 text-gray-700',
  };

  const colorStyles = outline
    ? outlineVariants[variant] || outlineVariants.primary
    : filledVariants[variant] || filledVariants.primary;

  return (
    <span
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${shapeStyles[shape] || shapeStyles.rounded}
        ${colorStyles}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
