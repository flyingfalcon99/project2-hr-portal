/**
 * Validation Schemas and Rules for React Hook Form
 * Provides reusable validation rules and schemas for all forms
 */

// Email validation pattern (RFC 5322 simplified)
export const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

// Phone validation pattern (10+ digits)
export const PHONE_PATTERN = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;

// Password validation pattern (min 8 chars, 1 uppercase, 1 number, 1 special char)
export const PASSWORD_PATTERN = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Zip code validation pattern (5-9 digits)
export const ZIP_CODE_PATTERN = /^\d{5}(-\d{4})?$/;

/**
 * Common Validation Rules
 */
export const validationRules = {
  // Name validation
  name: {
    required: 'Name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters',
    },
    maxLength: {
      value: 50,
      message: 'Name cannot exceed 50 characters',
    },
    pattern: {
      value: /^[a-zA-Z\s'-]*$/,
      message: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    },
  },

  // Email validation
  email: {
    required: 'Email is required',
    pattern: {
      value: EMAIL_PATTERN,
      message: 'Please enter a valid email address',
    },
  },

  // Password validation
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters',
    },
    pattern: {
      value: PASSWORD_PATTERN,
      message: 'Password must contain at least 1 uppercase letter, 1 number, and 1 special character (@$!%*?&)',
    },
  },

  // Confirm password validation (requires password field)
  confirmPassword: {
    required: 'Please confirm your password',
    validate: (value, formValues) => value === formValues.password || 'Passwords do not match',
  },

  // Phone validation
  phone: {
    required: 'Phone number is required',
    pattern: {
      value: PHONE_PATTERN,
      message: 'Please enter a valid phone number',
    },
  },

  // Phone optional validation
  phoneOptional: {
    pattern: {
      value: PHONE_PATTERN,
      message: 'Please enter a valid phone number',
    },
  },

  // Date validation
  date: {
    required: 'Date is required',
    validate: (value) => {
      if (!value) return 'Date is required';
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today || 'Date cannot be in the past';
    },
  },

  // Date optional (no past date validation)
  dateOptional: {
    validate: (value) => {
      if (!value) return true;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today || 'Date cannot be in the past';
    },
  },

  // Date of joining validation
  dateOfJoining: {
    required: 'Date of joining is required',
    validate: (value) => {
      if (!value) return 'Date of joining is required';
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate <= today || 'Date cannot be in the future';
    },
  },

  // Date range validation (start date)
  startDate: {
    required: 'Start date is required',
    validate: (value) => {
      if (!value) return 'Start date is required';
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today || 'Start date cannot be in the past';
    },
  },

  // Date range validation (end date)
  endDate: {
    required: 'End date is required',
    validate: (value, formValues) => {
      if (!value) return 'End date is required';
      if (formValues.startDate) {
        const startDate = new Date(formValues.startDate);
        const endDate = new Date(value);
        return endDate >= startDate || 'End date must be after start date';
      }
      return true;
    },
  },

  // Textarea/Reason validation
  reason: {
    required: 'Reason/Description is required',
    minLength: {
      value: 10,
      message: 'Reason must be at least 10 characters',
    },
    maxLength: {
      value: 500,
      message: 'Reason cannot exceed 500 characters',
    },
  },

  // Optional textarea/reason
  reasonOptional: {
    minLength: {
      value: 10,
      message: 'Reason must be at least 10 characters if provided',
    },
    maxLength: {
      value: 500,
      message: 'Reason cannot exceed 500 characters',
    },
  },

  // Position validation
  position: {
    required: 'Position is required',
    minLength: {
      value: 2,
      message: 'Position must be at least 2 characters',
    },
    maxLength: {
      value: 50,
      message: 'Position cannot exceed 50 characters',
    },
  },

  // Department validation
  department: {
    required: 'Department is required',
  },

  // Leave type validation
  leaveType: {
    required: 'Leave type is required',
  },

  // Number validation (positive integers)
  positiveNumber: {
    required: 'This field is required',
    min: {
      value: 0,
      message: 'Value must be 0 or greater',
    },
    pattern: {
      value: /^\d+$/,
      message: 'Please enter a valid number',
    },
  },

  // Number validation (positive integers, excluding 0)
  positiveNumberNonZero: {
    required: 'This field is required',
    min: {
      value: 1,
      message: 'Value must be greater than 0',
    },
    pattern: {
      value: /^\d+$/,
      message: 'Please enter a valid number',
    },
  },

  // Zip code validation
  zipCode: {
    pattern: {
      value: ZIP_CODE_PATTERN,
      message: 'Please enter a valid zip code (e.g., 12345 or 12345-6789)',
    },
  },

  // Generic required field
  required: {
    required: 'This field is required',
  },
};

/**
 * Login Form Schema
 */
export const loginSchema = {
  email: validationRules.email,
  password: {
    required: 'Password is required',
  },
  role: {
    required: 'Please select a role',
  },
};

/**
 * Register Form Schema - Step 1 (Personal Info)
 */
export const registerStep1Schema = {
  firstName: validationRules.name,
  lastName: validationRules.name,
  email: validationRules.email,
  phone: validationRules.phone,
};

/**
 * Register Form Schema - Step 2 (Job Info)
 */
export const registerStep2Schema = {
  department: validationRules.department,
  position: validationRules.position,
  dateOfJoining: validationRules.dateOfJoining,
};

/**
 * Register Form Schema - Step 3 (Security)
 */
export const registerStep3Schema = {
  password: validationRules.password,
  confirmPassword: validationRules.confirmPassword,
};

/**
 * Leave Request Form Schema
 */
export const leaveRequestSchema = {
  leaveType: validationRules.leaveType,
  startDate: validationRules.startDate,
  endDate: validationRules.endDate,
  reason: validationRules.reason,
};

/**
 * Employee Management Form Schema (Add/Edit Employee)
 */
export const employeeManagementSchema = {
  firstName: validationRules.name,
  lastName: validationRules.name,
  email: validationRules.email,
  phone: validationRules.phone,
  department: validationRules.department,
  position: validationRules.position,
  dateOfJoining: validationRules.dateOfJoining,
};

/**
 * Onboarding Form Schema
 */
export const onboardingFormSchema = {
  fullName: validationRules.name,
  email: validationRules.email,
  phone: validationRules.phone,
  position: validationRules.position,
  department: validationRules.department,
  startDate: validationRules.startDate,
};

/**
 * Profile Update Form Schema
 */
export const profileUpdateSchema = {
  firstName: validationRules.name,
  lastName: validationRules.name,
  phone: validationRules.phoneOptional,
  email: validationRules.email,
};

/**
 * Form Mode Options
 * 'onSubmit': Validate on submit
 * 'onBlur': Validate on blur
 * 'onChange': Validate on change
 * 'onTouched': Validate on touched
 * 'all': Validate on all events
 */
export const formModes = {
  LOGIN: 'onBlur',
  REGISTER: 'onBlur',
  LEAVE_REQUEST: 'onBlur',
  EMPLOYEE_MANAGEMENT: 'onBlur',
  ONBOARDING: 'onChange',
};

/**
 * Custom Validators
 */
export const customValidators = {
  /**
   * Validate date range
   * Ensures end date is after start date
   */
  validateDateRange: (startDate, endDate) => {
    if (!startDate || !endDate) return true;
    return new Date(endDate) >= new Date(startDate);
  },

  /**
   * Validate leave days
   * Ensures leave days don't exceed maximum for type
   */
  validateLeaveDays: (days, maxDays) => {
    return parseInt(days) <= parseInt(maxDays);
  },

  /**
   * Validate password strength
   */
  validatePasswordStrength: (password) => {
    const strength = {
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password),
      minLength: password.length >= 8,
    };

    const score = Object.values(strength).filter(Boolean).length;
    return {
      score,
      strength:
        score === 5
          ? 'strong'
          : score >= 3
          ? 'medium'
          : 'weak',
      ...strength,
    };
  },

  /**
   * Validate email uniqueness (requires API call)
   * This should be called with async/await
   */
  validateEmailUnique: async (email, apiCall) => {
    try {
      const response = await apiCall(email);
      return !response.exists;
    } catch (error) {
      return true; // Allow submission on API error
    }
  },
};

/**
 * Error message customization
 */
export const getErrorMessage = (fieldName, errorType, customMessage) => {
  if (customMessage) return customMessage;

  const messages = {
    required: `${fieldName} is required`,
    pattern: `${fieldName} format is invalid`,
    minLength: `${fieldName} is too short`,
    maxLength: `${fieldName} is too long`,
    validate: `${fieldName} validation failed`,
    min: `${fieldName} is too small`,
    max: `${fieldName} is too large`,
  };

  return messages[errorType] || `${fieldName} is invalid`;
};

export default {
  EMAIL_PATTERN,
  PHONE_PATTERN,
  PASSWORD_PATTERN,
  ZIP_CODE_PATTERN,
  validationRules,
  loginSchema,
  registerStep1Schema,
  registerStep2Schema,
  registerStep3Schema,
  leaveRequestSchema,
  employeeManagementSchema,
  onboardingFormSchema,
  profileUpdateSchema,
  formModes,
  customValidators,
  getErrorMessage,
};
