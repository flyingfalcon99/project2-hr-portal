# Notification System Implementation Guide

## Overview

The HR Portal implements a comprehensive, Redux-based notification/toast system that provides real-time user feedback for various application events. The system supports multiple notification types with automatic dismissal, smooth animations, and queue management.

## Architecture

### Components

#### 1. **Redux Slice** (`src/store/notificationSlice.js`)
Manages the centralized state for all notifications.

**State Structure:**
```javascript
{
  notifications: [
    {
      id: 'unique-id',
      type: 'success' | 'error' | 'warning' | 'info',
      title: 'Notification Title',
      message: 'Detailed notification message',
      duration: 5000, // milliseconds
      timestamp: '2024-01-15T10:30:00Z'
    }
  ]
}
```

**Actions:**
- `addNotification(payload)` - Adds a new notification to the queue
- `removeNotification(id)` - Removes a notification by ID
- `clearNotifications()` - Clears all notifications
- `updateNotification(payload)` - Updates notification properties

**Selectors:**
- `selectNotifications(state)` - Returns all active notifications
- `selectNotificationCount(state)` - Returns count of notifications

**Thunk Actions (Convenience Methods):**
- `showSuccessNotification(title, message, duration)` - Dispatch success notification
- `showErrorNotification(title, message, duration)` - Dispatch error notification
- `showWarningNotification(title, message, duration)` - Dispatch warning notification
- `showInfoNotification(title, message, duration)` - Dispatch info notification

#### 2. **NotificationContainer** (`src/components/NotificationContainer.jsx`)
Fixed-position container that renders all active notifications.

**Features:**
- Displays notifications in top-right corner
- Manages auto-dismiss timers
- Queues multiple simultaneous notifications
- ARIA-compliant for accessibility

**Props:** None (connects directly to Redux)

**Auto-Dismiss Behavior:**
- Automatically removes notifications after configured duration
- Default duration: 5000ms (5 seconds)
- Custom duration can be specified per notification

#### 3. **NotificationItem** (`src/components/NotificationItem.jsx`)
Individual notification component with type-specific styling.

**Props:**
- `notification` (required) - Notification object from Redux
- `onClose` (required) - Callback for close button

**Type Styles:**
- **Success** (Green) - ✓ icon, green background
- **Error** (Red) - ✕ icon, red background
- **Warning** (Amber) - ⚠ icon, amber background
- **Info** (Blue) - ℹ icon, blue background

**Features:**
- Smooth slide-in animation (300ms)
- Smooth slide-out animation (200ms) on close
- Type-specific icons and colors
- Manual close button
- Accessibility attributes (role="alert", aria-live="polite")

#### 4. **Custom Hook** (`src/store/useNotification.js`)
Convenient hook for dispatching notifications without manual Redux setup.

**Usage:**
```javascript
const { success, error, warning, info } = useNotification();

// Show success notification
success('Operation Complete!', 'Employee added successfully');

// Show error notification
error('Operation Failed', 'Please check the form for errors');
```

## Integration Points

### Store Configuration
The `notificationSlice` is registered in `src/store/index.js`:
```javascript
import notificationReducer from './notificationSlice';

const store = configureStore({
  reducer: {
    // ... other reducers
    notifications: notificationReducer,
  },
});
```

### Layout Integration
The `NotificationContainer` is added to the main `Layout` component, ensuring notifications are visible across all protected routes:

```javascript
// src/components/Layout.jsx
import NotificationContainer from './NotificationContainer';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-secondary-50">
      <NotificationContainer /> {/* Added here */}
      <Sidebar />
      {/* ... rest of layout */}
    </div>
  );
}
```

## Usage Examples

### Example 1: Login Success Notification

```javascript
import useNotification from '@/store/useNotification';

function Login() {
  const { success, error } = useNotification();

  useEffect(() => {
    if (isAuthenticated) {
      success('Login Successful!', 'Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authError) {
      error('Login Failed', authError);
    }
  }, [authError]);

  // ... rest of component
}
```

### Example 2: Employee Creation Notification

```javascript
import useNotification from '@/store/useNotification';

function EmployeeManagement() {
  const { success, error } = useNotification();

  const handleAddEmployee = async (employeeData) => {
    try {
      await createEmployee(employeeData);
      success('Employee Added!', `${employeeData.firstName} ${employeeData.lastName} has been added to the system`);
    } catch (err) {
      error('Failed to Add Employee', err.message);
    }
  };

  // ... rest of component
}
```

### Example 3: Leave Request Notification

```javascript
import useNotification from '@/store/useNotification';

function LeaveRequests() {
  const { success, error, warning } = useNotification();

  const handleApproveLeave = async (leaveId) => {
    try {
      await approveLeave(leaveId);
      success('Leave Approved', 'The leave request has been approved');
    } catch (err) {
      error('Approval Failed', 'Unable to approve the leave request');
    }
  };

  const handleValidation = (data) => {
    if (data.days > 30) {
      warning('Long Leave', 'This is a leave request exceeding 30 days');
    }
  };

  // ... rest of component
}
```

### Example 4: Form Validation Error

```javascript
import useNotification from '@/store/useNotification';

function RegistrationForm() {
  const { error, info } = useNotification();

  const handleSubmit = async (formData) => {
    // Validation
    if (!formData.email) {
      error('Validation Error', 'Email is required');
      return;
    }

    if (formData.password.length < 8) {
      info('Weak Password', 'Password should be at least 8 characters');
      return;
    }

    // ... submit form
  };

  // ... rest of component
}
```

## Styling & Animation

### Tailwind Configuration
Animations are defined in `tailwind.config.js`:

```javascript
// Keyframes
"@keyframes slideIn": {
  "0%": { transform: "translateX(400px)", opacity: "0" },
  "100%": { transform: "translateX(0)", opacity: "1" },
},
"@keyframes slideOut": {
  "0%": { transform: "translateX(0)", opacity: "1" },
  "100%": { transform: "translateX(400px)", opacity: "0" },
},

// Utility Classes
".animate-slideIn": {
  animation: "slideIn 300ms ease-out forwards",
},
".animate-slideOut": {
  animation: "slideOut 200ms ease-in forwards",
},
```

### Color Scheme

| Type | Background | Border | Text | Icon |
|------|------------|--------|------|------|
| Success | bg-green-50 | border-green-200 | text-green-900 | text-green-600 |
| Error | bg-red-50 | border-red-200 | text-red-900 | text-red-600 |
| Warning | bg-amber-50 | border-amber-200 | text-amber-900 | text-amber-600 |
| Info | bg-blue-50 | border-blue-200 | text-blue-900 | text-blue-600 |

## Best Practices

### 1. Clear, Concise Messages
```javascript
// Good
success('Added Successfully', 'Employee Rajesh Kumar added to Engineering team');

// Avoid
success('Success', 'The operation was completed without errors');
```

### 2. Contextual Notification Types
```javascript
// Use appropriate types
success('Login Successful', 'Welcome back!');      // Achievement
error('Password Mismatch', 'Please try again');    // Problem
warning('Session Expiring', 'You will be logged out in 5 minutes'); // Alert
info('Maintenance Scheduled', 'System maintenance on Sunday'); // Information
```

### 3. Consistent Duration
```javascript
// Standard durations
success(title, message, 5000);   // 5 seconds - normal operations
error(title, message, 7000);     // 7 seconds - important errors
warning(title, message, 6000);   // 6 seconds - warnings
```

### 4. Error Message Quality
```javascript
// Good error messages (user-friendly)
error('Upload Failed', 'File size exceeds 5MB limit. Please select a smaller file.');
error('Invalid Email', 'Email format is incorrect. Use example@domain.com format.');

// Poor error messages (technical jargon)
error('Error', 'ENOENT: no such file or directory');
```

### 5. Avoid Notification Spam
```javascript
// Don't show multiple notifications for same action
// Bad - too many notifications
success('Saved', 'Row 1 saved');
success('Saved', 'Row 2 saved');
success('Saved', 'Row 3 saved');

// Good - single notification for batch operation
success('Bulk Save Complete', '3 rows saved successfully');
```

## Common Use Cases

### Authentication
- Login success
- Login failure
- Registration complete
- Logout confirmation
- Password reset
- Session timeout warning

### Employee Management
- Employee added
- Employee updated
- Employee deleted
- Import completed
- Bulk operations

### Leave Management
- Leave request submitted
- Leave approved/rejected
- Leave cancelled
- Conflict notification

### System Messages
- Data sync completed
- Background task progress
- System maintenance alerts
- Connection issues

## Accessibility Features

The notification system includes WCAG compliance features:

- **ARIA Labels**: `aria-label`, `aria-live="polite"`, `role="alert"`
- **Keyboard Navigation**: Close button is keyboard accessible with Tab
- **Focus Management**: Focus ring visible on close button
- **Color Independence**: Icons used in addition to color for type identification
- **Text Contrast**: All text meets WCAG AA standards

## Performance Considerations

1. **Auto-Cleanup**: Notifications automatically removed after timeout
2. **Memory Efficient**: No memory leaks from lingering notifications
3. **Animations**: GPU-accelerated CSS animations (transform, opacity)
4. **Redux Optimization**: Uses selectors for efficient re-renders
5. **Queue Management**: Handles multiple simultaneous notifications smoothly

## Testing Recommendations

```javascript
// Test success notification
test('displays success notification on login', async () => {
  const { success } = renderHook(() => useNotification());
  success('Login Successful!', 'Redirecting...');
  
  expect(screen.getByText('Login Successful!')).toBeInTheDocument();
  expect(screen.getByText('Redirecting...')).toBeInTheDocument();
});

// Test auto-dismiss
test('removes notification after duration', async () => {
  jest.useFakeTimers();
  const { success } = renderHook(() => useNotification());
  success('Test', 'Message', 5000);
  
  jest.advanceTimersByTime(5000);
  expect(screen.queryByText('Test')).not.toBeInTheDocument();
});
```

## Troubleshooting

### Notifications not showing
1. Ensure `NotificationContainer` is in Layout
2. Check Redux store includes notification reducer
3. Verify `useNotification` hook is imported correctly

### Notifications not dismissing
1. Check browser console for errors
2. Verify notification duration is set
3. Ensure Redux store is configured properly

### Animation issues
1. Verify Tailwind CSS is compiled
2. Check browser support for CSS animations
3. Ensure `tailwind.config.js` has slideIn/slideOut keyframes

## Future Enhancements

Potential improvements for future versions:
- Notification persistence (localStorage)
- Sound notifications for critical alerts
- Notification center/history
- Toast position customization
- Custom action buttons in notifications
- Notification grouping by type
- Undo actions in notifications

---

## Summary

The notification system provides a robust, user-friendly way to communicate application state changes to users. By leveraging Redux for state management and Tailwind CSS for styling, it maintains consistency with the application architecture while providing smooth, accessible user feedback across all sections of the HR Portal.
