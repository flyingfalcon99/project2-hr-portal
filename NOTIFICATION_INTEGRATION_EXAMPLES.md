# Notification System - Integration Examples

This file contains copy-paste ready examples for integrating notifications into other components.

## 1. Leave Request Form Integration

```javascript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import useNotification from '@/store/useNotification';
import { leaveRequestSchema, formModes } from '@/utils/validationSchemas';
import FormField from './FormField';

export default function LeaveRequestForm() {
  const { success, error, warning } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    mode: formModes.LEAVE_REQUEST,
    defaultValues: {
      leaveType: 'sick',
      startDate: '',
      endDate: '',
      reason: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Validate dates
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      if (days > 30) {
        warning('Long Leave Period', 'This leave exceeds 30 days and may require additional approval');
      }

      // Submit leave request
      const response = await fetch('http://localhost:5000/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          numberOfDays: days,
          status: 'pending',
          submittedOn: new Date().toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to submit leave request');

      success(
        'Leave Request Submitted!',
        `Your ${leaveTypeLabel(data.leaveType)} leave for ${days} days has been submitted for approval`
      );
      reset();
    } catch (err) {
      error('Submission Failed', err.message || 'Unable to submit leave request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const leaveTypeLabel = (type) => {
    const types = { sick: 'Sick', casual: 'Casual', personal: 'Personal', unpaid: 'Unpaid' };
    return types[type] || type;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Request Leave</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        <FormField
          control={control}
          name="leaveType"
          label="Leave Type"
          type="select"
          options={[
            { value: 'sick', label: 'Sick Leave' },
            { value: 'casual', label: 'Casual Leave' },
            { value: 'personal', label: 'Personal Leave' },
            { value: 'unpaid', label: 'Unpaid Leave' },
          ]}
          required
        />

        <FormField
          control={control}
          name="startDate"
          label="Start Date"
          type="date"
          required
        />

        <FormField
          control={control}
          name="endDate"
          label="End Date"
          type="date"
          required
        />

        <FormField
          control={control}
          name="reason"
          label="Reason for Leave"
          type="textarea"
          placeholder="Briefly explain the reason..."
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Leave Request'}
        </button>
      </form>
    </div>
  );
}
```

## 2. Employee Management Integration

```javascript
import { useState } from 'react';
import useNotification from '@/store/useNotification';
import FormField from './FormField';

export default function EmployeeManagement() {
  const { success, error, warning, info } = useNotification();
  const [employees, setEmployees] = useState([]);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddEmployee = async (formData) => {
    try {
      setIsAdding(true);

      // Validate email uniqueness
      const existing = employees.find(e => e.email === formData.email);
      if (existing) {
        error('Email Already Exists', 'This email is already registered in the system');
        return;
      }

      // Create employee
      const response = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to create employee');
      const newEmployee = await response.json();

      setEmployees([...employees, newEmployee]);
      success(
        'Employee Added Successfully!',
        `${formData.firstName} ${formData.lastName} has been added to the system`
      );
    } catch (err) {
      error('Failed to Add Employee', err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateEmployee = async (employeeId, updates) => {
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update employee');

      setEmployees(employees.map(e => e.id === employeeId ? { ...e, ...updates } : e));
      success('Employee Updated', 'Changes have been saved successfully');
    } catch (err) {
      error('Update Failed', err.message);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete employee');

      setEmployees(employees.filter(e => e.id !== employeeId));
      success('Employee Deleted', 'The employee record has been removed');
    } catch (err) {
      error('Deletion Failed', err.message);
    }
  };

  const handleBulkImport = async (file) => {
    try {
      info('Importing', 'Processing employee data...');
      
      // Simulate file processing
      const importedCount = await processFile(file);
      
      success(
        'Import Complete',
        `${importedCount} employees have been imported successfully`
      );
    } catch (err) {
      error('Import Failed', err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Employee Management</h1>
      
      {/* Employee list and management UI */}
    </div>
  );
}
```

## 3. Dashboard Integration

```javascript
import { useEffect, useState } from 'react';
import useNotification from '@/store/useNotification';

export default function Dashboard() {
  const { success, error, warning } = useNotification();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard');
        if (!response.ok) throw new Error('Failed to load dashboard');

        const data = await response.json();
        setDashboardData(data);

        // Show warnings for critical metrics
        if (data.pendingLeaveRequests > 10) {
          warning(
            'High Pending Leaves',
            `There are ${data.pendingLeaveRequests} pending leave requests awaiting approval`
          );
        }

        if (data.onboardingTasksOverdue > 0) {
          warning(
            'Onboarding Tasks Overdue',
            `${data.onboardingTasksOverdue} onboarding tasks are overdue`
          );
        }
      } catch (err) {
        error('Dashboard Error', 'Unable to load dashboard data');
      }
    };

    fetchDashboardData();
  }, []);

  const handleDataRefresh = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard');
      if (!response.ok) throw new Error('Failed to refresh');

      const data = await response.json();
      setDashboardData(data);
      success('Refreshed', 'Dashboard data has been updated');
    } catch (err) {
      error('Refresh Failed', err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleDataRefresh}
          className="btn-primary"
        >
          Refresh
        </button>
      </div>

      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Dashboard cards */}
        </div>
      )}
    </div>
  );
}
```

## 4. Onboarding Portal Integration

```javascript
import { useState } from 'react';
import useNotification from '@/store/useNotification';

export default function OnboardingPortal() {
  const { success, error, info, warning } = useNotification();
  const [tasks, setTasks] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const handleCompleteTask = async (taskId) => {
    try {
      info('Saving', 'Marking task as complete...');

      const response = await fetch(`http://localhost:5000/api/onboarding/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed', completedAt: new Date() }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'completed' } : t));
      success('Task Completed!', 'Well done! You\'ve completed this onboarding task');

      // Check if all tasks are complete
      const allComplete = tasks.every(t => t.status === 'completed');
      if (allComplete) {
        success(
          'Onboarding Complete! 🎉',
          'You have successfully completed all onboarding tasks!'
        );
      }
    } catch (err) {
      error('Update Failed', err.message);
    }
  };

  const handleSkipStep = () => {
    warning('Step Skipped', 'You can complete this later from your dashboard');
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome Onboard!</h1>

      {/* Onboarding steps and tasks */}
    </div>
  );
}
```

## 5. Profile Update Integration

```javascript
import { useState } from 'react';
import useNotification from '@/store/useNotification';
import FormField from './FormField';

export default function EmployeeProfile() {
  const { success, error, warning } = useNotification();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateProfile = async (updates) => {
    try {
      setIsSubmitting(true);

      // Validate changes
      if (updates.email && updates.email !== profile.email) {
        warning('Email Change', 'Email address changes require verification');
      }

      const response = await fetch(`http://localhost:5000/api/employees/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);

      success('Profile Updated', 'Your profile has been updated successfully');
    } catch (err) {
      error('Update Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (currentPassword, newPassword) => {
    try {
      setIsSubmitting(true);

      if (newPassword.length < 8) {
        error('Weak Password', 'New password must be at least 8 characters');
        return;
      }

      const response = await fetch('http://localhost:5000/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) throw new Error('Failed to change password');

      success('Password Changed', 'Your password has been changed successfully');
    } catch (err) {
      error('Password Change Failed', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {profile && (
        <div className="space-y-6">
          {/* Profile form */}
        </div>
      )}
    </div>
  );
}
```

## 6. Generic API Error Handler Wrapper

```javascript
import useNotification from '@/store/useNotification';

/**
 * Wrapper function to add notification handling to API calls
 */
export function withNotifications(asyncFunction, successMessage, errorTitle = 'Operation Failed') {
  return async function wrappedFunction(...args) {
    const { success, error } = useNotification();

    try {
      const result = await asyncFunction(...args);
      if (successMessage) {
        success(successMessage.title || 'Success', successMessage.message || 'Operation completed');
      }
      return result;
    } catch (err) {
      error(errorTitle, err.message || 'An unexpected error occurred');
      throw err;
    }
  };
}

// Usage:
// const createEmployeeWithNotify = withNotifications(
//   createEmployee,
//   { title: 'Employee Added', message: 'New employee created' },
//   'Failed to Create Employee'
// );
```

## 7. Validation Error Notifications

```javascript
import useNotification from '@/store/useNotification';

export function validateAndNotify(data, rules, notify) {
  const { error, warning } = notify || useNotification();
  const errors = [];
  const warnings = [];

  // Check required fields
  rules.forEach(rule => {
    if (rule.required && !data[rule.field]) {
      errors.push(`${rule.field} is required`);
    }
  });

  // Check field-specific validations
  if (data.email && !isValidEmail(data.email)) {
    errors.push('Email format is invalid');
  }

  if (data.phone && data.phone.length < 10) {
    errors.push('Phone number must be at least 10 digits');
  }

  if (data.salary && data.salary < 0) {
    errors.push('Salary cannot be negative');
  }

  // Show warnings for edge cases
  if (data.salary > 1000000) {
    warnings.push('Salary is unusually high');
  }

  // Display notifications
  if (errors.length > 0) {
    error('Validation Error', errors.join(', '));
    return false;
  }

  if (warnings.length > 0) {
    warnings.forEach(w => warning('Warning', w));
  }

  return true;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

## 8. Async Operation Wrapper

```javascript
import useNotification from '@/store/useNotification';

/**
 * Wrap async operations with notification lifecycle
 */
export function useAsyncWithNotifications(asyncFunction, options = {}) {
  const { success, error, info } = useNotification();
  const [isLoading, setIsLoading] = React.useState(false);

  const execute = React.useCallback(async (...args) => {
    try {
      setIsLoading(true);

      if (options.loadingMessage) {
        info(options.loadingMessage.title, options.loadingMessage.message);
      }

      const result = await asyncFunction(...args);

      if (options.successMessage) {
        success(options.successMessage.title, options.successMessage.message);
      }

      return result;
    } catch (err) {
      error(
        options.errorTitle || 'Operation Failed',
        err.message || 'An unexpected error occurred'
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [asyncFunction, options, success, error, info]);

  return [execute, isLoading];
}

// Usage:
// const [submitForm, isSubmitting] = useAsyncWithNotifications(
//   submitFormData,
//   {
//     loadingMessage: { title: 'Saving...', message: 'Please wait' },
//     successMessage: { title: 'Saved!', message: 'Form submitted successfully' },
//     errorTitle: 'Save Failed'
//   }
// );
```

---

These examples demonstrate various integration patterns for the notification system across different parts of the HR Portal application. Copy and adapt as needed for your specific use cases!
