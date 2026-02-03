import React, { useState } from 'react';

/**
 * Reusable Input Component
 * @param {string} type - Input type ('text', 'email', 'password', 'number', 'date', 'tel', 'textarea')
 * @param {string} label - Input label
 * @param {string} placeholder - Input placeholder
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {function} onBlur - Blur handler
 * @param {string} error - Error message
 * @param {boolean} required - Mark as required
 * @param {string} size - Input size ('sm', 'md', 'lg')
 * @param {ReactNode} icon - Icon element
 * @param {string} helpText - Help text below input
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props
 */
const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  size = 'md',
  icon,
  helpText,
  className = '',
  name,
  disabled = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Base styles
  const baseStyles =
    'w-full bg-white border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed';

  // Size variants
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  // Border and ring colors based on state
  const borderStyles = error
    ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
    : isFocused
    ? 'border-primary-500 focus:border-primary-600 focus:ring-primary-500'
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const inputContent = (
    <>
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}

      {type === 'textarea' ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`
            ${baseStyles}
            ${sizeStyles[size] || sizeStyles.md}
            ${borderStyles}
            ${icon ? 'pl-10' : ''}
            resize-vertical min-h-[100px]
            ${className}
          `}
          {...props}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`
            ${baseStyles}
            ${sizeStyles[size] || sizeStyles.md}
            ${borderStyles}
            ${icon ? 'pl-10' : ''}
            ${className}
          `}
          {...props}
        />
      )}

      {error && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-danger-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 14.586l-6.687-6.687a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l8-8z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </>
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-danger-600 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {inputContent}
      </div>

      {error && <div className="mt-2 text-sm text-danger-600 font-medium">{error}</div>}

      {helpText && !error && <div className="mt-2 text-sm text-gray-500">{helpText}</div>}
    </div>
  );
};

export default Input;
