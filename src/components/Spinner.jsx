import React from 'react';

/**
 * Reusable Loading Spinner Component
 * @param {string} size - Spinner size ('sm', 'md', 'lg', 'xl')
 * @param {string} variant - Spinner style ('ring', 'dots', 'pulse')
 * @param {string} color - Spinner color ('primary', 'secondary', 'success', 'danger', 'white')
 * @param {string} label - Loading label text
 * @param {boolean} fullScreen - Cover entire screen
 * @param {string} className - Additional CSS classes
 */
const Spinner = ({
  size = 'md',
  variant = 'ring',
  color = 'primary',
  label,
  fullScreen = false,
  className = '',
}) => {
  const container = fullScreen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <SpinnerContent size={size} variant={variant} color={color} label={label} className={className} />
    </div>
  ) : (
    <SpinnerContent size={size} variant={variant} color={color} label={label} className={className} />
  );

  return container;
};

const SpinnerContent = ({ size, variant, color, label, className }) => {
  const sizeStyles = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    success: 'text-success-600',
    danger: 'text-danger-600',
    white: 'text-white',
  };

  // Ring variant (default)
  if (variant === 'ring') {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <div className={`${sizeStyles[size]}`}>
          <svg className={`animate-spin ${colorClasses[color]} flex-shrink-0 inline-block`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        {label && <p className={`text-sm font-medium ${colorClasses[color]}`}>{label}</p>}
      </div>
    );
  }

  // Dots variant
  if (variant === 'dots') {
    const dotSize = size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-5 h-5';

    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <div className="flex gap-2">
          <div className={`${dotSize} ${colorClasses[color]} rounded-full animate-bounce`}></div>
          <div className={`${dotSize} ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
          <div className={`${dotSize} ${colorClasses[color]} rounded-full animate-bounce`} style={{ animationDelay: '0.4s' }}></div>
        </div>
        {label && <p className={`text-sm font-medium ${colorClasses[color]}`}>{label}</p>}
      </div>
    );
  }

  // Pulse variant
  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <div className={`${sizeStyles[size]} ${colorClasses[color]} rounded-full animate-pulse`}></div>
        {label && <p className={`text-sm font-medium ${colorClasses[color]}`}>{label}</p>}
      </div>
    );
  }

  return null;
};

export default Spinner;
