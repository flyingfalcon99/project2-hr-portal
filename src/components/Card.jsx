import React from 'react';

/**
 * Reusable Card Component
 * @param {ReactNode} children - Card content
 * @param {ReactNode} header - Header content
 * @param {ReactNode} footer - Footer content
 * @param {string} className - Additional CSS classes
 * @param {boolean} interactive - Add hover effects
 * @param {string} variant - Card style variant ('default', 'elevated', 'outlined')
 * @param {object} props - Additional props
 */
const Card = ({
  children,
  header,
  footer,
  className = '',
  interactive = false,
  variant = 'default',
  ...props
}) => {
  // Base styles
  const baseStyles = 'bg-white rounded-lg overflow-hidden transition-all duration-200';

  // Variant styles
  const variantStyles = {
    default: 'border border-gray-200',
    elevated: 'shadow-md',
    outlined: 'border-2 border-gray-300',
  };

  // Interactive styles
  const interactiveStyles = interactive
    ? 'hover:shadow-lg hover:border-primary-200 cursor-pointer'
    : '';

  return (
    <div
      className={`
        ${baseStyles}
        ${variantStyles[variant] || variantStyles.default}
        ${interactiveStyles}
        ${className}
      `}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          {typeof header === 'string' ? (
            <h3 className="text-lg font-semibold text-gray-900">{header}</h3>
          ) : (
            header
          )}
        </div>
      )}

      <div className="px-6 py-4">
        {children}
      </div>

      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          {typeof footer === 'string' ? (
            <p className="text-sm text-gray-600">{footer}</p>
          ) : (
            footer
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
