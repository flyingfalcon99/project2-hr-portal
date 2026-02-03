import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { TOUCH_SIZES, INPUT_RESPONSIVE } from '../utils/responsiveUtils';

/**
 * FormField Component - Wrapper for React Hook Form Integration
 * Provides consistent error handling, validation feedback, and responsive sizing
 * 
 * @component
 * @example
 * <FormField
 *   control={control}
 *   name="email"
 *   label="Email Address"
 *   rules={validationRules.email}
 *   type="email"
 *   placeholder="you@example.com"
 *   responsive={true}
 * />
 */
const FormField = ({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  rules = {},
  required = false,
  disabled = false,
  rows,
  options,
  hint,
  icon,
  className = '',
  successMessage,
  onChange,
  responsive = true,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState: { error }, formState: { isDirty, isSubmitted } }) => {
        const hasError = error && (isDirty || isSubmitted);
        const showSuccess = !hasError && isDirty && !isFocused && successMessage;

        return (
          <div className={responsive ? 'space-y-2' : 'space-y-1.5'}>
            {/* Label */}
            {label && (
              <label
                htmlFor={name}
                className={`block font-semibold text-secondary-900 ${responsive ? 'text-sm md:text-base' : 'text-sm'}`}
              >
                {label}
                {required && <span className="text-danger-600 ml-1">*</span>}
              </label>
            )}

            {/* Input Container */}
            <div className="relative">
              {/* Textarea */}
              {type === 'textarea' ? (
                <textarea
                  id={name}
                  placeholder={placeholder}
                  rows={rows || 4}
                  disabled={disabled}
                  onFocus={() => setIsFocused(true)}
                  onBlur={(e) => {
                    setIsFocused(false);
                    field.onBlur();
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    onChange?.(e);
                  }}
                  className={`
                    w-full text-base transition-all duration-200 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-offset-0
                    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
                    border
                    ${responsive ? 'px-4 md:px-5 py-3 md:py-3.5' : 'px-4 py-2.5'}
                    ${hasError
                      ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
                      : isFocused
                      ? 'border-primary-500 focus:border-primary-600 focus:ring-primary-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }
                    resize-vertical min-h-[120px]
                    ${className}
                  `}
                  value={field.value || ''}
                  {...props}
                />
              ) : type === 'select' ? (
                // Select/Dropdown
                <select
                  id={name}
                  disabled={disabled}
                  onFocus={() => setIsFocused(true)}
                  onBlur={(e) => {
                    setIsFocused(false);
                    field.onBlur();
                  }}
                  onChange={(e) => {
                    field.onChange(e);
                    onChange?.(e);
                  }}
                  className={`
                    w-full text-base transition-all duration-200 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-offset-0
                    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
                    appearance-none cursor-pointer
                    border
                    ${responsive ? 'px-4 md:px-5 py-3 md:py-3.5' : 'px-4 py-2.5'}
                    ${hasError
                      ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
                      : isFocused
                      ? 'border-primary-500 focus:border-primary-600 focus:ring-primary-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                    }
                    ${className}
                  `}
                  value={field.value || ''}
                  {...props}
                >
                  <option value="">Select {label?.toLowerCase() || 'option'}</option>
                  {options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : type === 'radio' ? (
                // Radio buttons
                <fieldset className={responsive ? 'space-y-3' : 'space-y-2'}>
                  {options?.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center cursor-pointer group ${responsive ? TOUCH_SIZES.medium : ''}`}
                    >
                      <input
                        type="radio"
                        value={option.value}
                        checked={field.value === option.value}
                        onChange={(e) => {
                          field.onChange(e);
                          onChange?.(e);
                        }}
                        disabled={disabled}
                        className={`
                          transition-colors
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${responsive ? 'w-5 h-5' : 'w-4 h-4'}
                          ${hasError
                            ? 'accent-danger-600'
                            : 'accent-primary-600'
                          }
                        `}
                      />
                      <span className={`text-secondary-700 group-hover:text-secondary-900 ${responsive ? 'ml-3 text-base md:text-base' : 'ml-2'}`}>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </fieldset>
              ) : type === 'checkbox' ? (
                // Checkbox
                <label className={`flex items-center cursor-pointer group ${responsive ? TOUCH_SIZES.medium : ''}`}>
                  <input
                    type="checkbox"
                    checked={field.value || false}
                    onChange={(e) => {
                      field.onChange(e);
                      onChange?.(e);
                    }}
                    disabled={disabled}
                    className={`
                      rounded transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${responsive ? 'w-5 h-5' : 'w-4 h-4'}
                      ${hasError
                        ? 'accent-danger-600'
                        : 'accent-primary-600'
                      }
                    `}
                  />
                  <span className={`text-secondary-700 group-hover:text-secondary-900 ${responsive ? 'ml-3 text-base md:text-base' : 'ml-2'}`}>
                    {placeholder}
                  </span>
                </label>
              ) : (
                // Regular Input
                <>
                  {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      {icon}
                    </div>
                  )}
                  <input
                    id={name}
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={(e) => {
                      setIsFocused(false);
                      field.onBlur();
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                      onChange?.(e);
                    }}
                    className={`
                      w-full text-base transition-all duration-200 rounded-lg
                      border focus:outline-none focus:ring-2 focus:ring-offset-0
                      disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
                      ${responsive ? 'px-4 md:px-5 py-3 md:py-3.5' : 'px-4 py-2.5'}
                      ${icon ? (responsive ? 'pl-11 md:pl-12' : 'pl-10') : ''}
                      ${hasError
                        ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
                        : isFocused
                        ? 'border-primary-500 focus:border-primary-600 focus:ring-primary-500'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
                      }
                      ${className}
                    `}
                    value={field.value || ''}
                    {...props}
                  />
                </>
              )}
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="flex items-start gap-2 mt-2">
                <svg
                  className="w-4 h-4 text-success-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-success-700">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {hasError && (
              <div className="flex items-start gap-2 mt-2">
                <svg
                  className="w-4 h-4 text-danger-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18.101 12.93a1 1 0 00-1.414-1.414L10 14.586 3.313 7.899a1 1 0 00-1.414 1.414l7.778 7.778a1 1 0 001.414 0l8.02-8.02z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-danger-700">{error.message}</p>
              </div>
            )}

            {/* Hint Text */}
            {hint && !hasError && (
              <p className="text-xs text-secondary-500">{hint}</p>
            )}
          </div>
        );
      }}
    />
  );
};

export default FormField;
