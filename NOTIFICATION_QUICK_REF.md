# Notification System - Quick Reference

## Quick Start

### 1. Import the Hook
```javascript
import useNotification from '@/store/useNotification';
```

### 2. Use in Your Component
```javascript
const { success, error, warning, info } = useNotification();
```

### 3. Show Notifications
```javascript
// Success
success('Login Successful!', 'Redirecting to dashboard...');

// Error
error('Login Failed', 'Invalid email or password');

// Warning
warning('Slow Connection', 'Network is slow, operation may take longer');

// Info
info('Update Available', 'A new version is available for download');
```

## Auto-Dismiss Duration
```javascript
// Default: 5000ms (5 seconds)
success('Operation Complete', 'Record saved successfully');

// Custom duration
success('Operation Complete', 'Record saved successfully', 8000); // 8 seconds
error('Critical Error', 'Database connection lost', 10000); // 10 seconds
```

## Files Created/Modified

| File | Type | Purpose |
|------|------|---------|
| `src/store/notificationSlice.js` | Created | Redux state management |
| `src/components/NotificationContainer.jsx` | Created | Toast container component |
| `src/components/NotificationItem.jsx` | Created | Individual toast component |
| `src/store/useNotification.js` | Created | Custom hook for convenience |
| `src/components/Layout.jsx` | Modified | Added NotificationContainer |
| `src/components/Login.jsx` | Modified | Integrated notifications |
| `src/components/Register.jsx` | Modified | Integrated notifications |
| `src/store/index.js` | Modified | Added notification reducer |
| `tailwind.config.js` | Modified | Added slide animations |

## Notification Types & Colors

```
✓ Success  → Green background
✕ Error    → Red background
⚠ Warning  → Amber background
ℹ Info     → Blue background
```

## Position & Animation

- **Position**: Top-right corner of screen
- **Animation In**: Slide from right (300ms)
- **Animation Out**: Slide to right (200ms)
- **Auto-Dismiss**: After configured duration (default 5s)

## Common Patterns

### With Try-Catch
```javascript
try {
  await saveEmployee(data);
  success('Saved!', 'Employee details saved successfully');
} catch (err) {
  error('Save Failed', err.message);
}
```

### With Promise
```javascript
updateLeaveStatus(leaveId)
  .then(() => success('Updated!', 'Leave status updated'))
  .catch(err => error('Update Failed', err.message));
```

### With Redux Thunk
```javascript
const handleLogin = async () => {
  dispatch(loginUser(credentials));
};

useEffect(() => {
  if (isAuthenticated) {
    success('Welcome!', 'Login successful');
  } else if (error) {
    error('Login Error', error);
  }
}, [isAuthenticated, error]);
```

## Accessibility

Notifications include:
- ARIA labels and roles
- Keyboard navigation (Tab to focus close button)
- Screen reader announcements
- High contrast colors
- Type identification with icons + color

## Performance Tips

1. Avoid notification spam - show 1 summary instead of many individual ones
2. Use appropriate durations - longer for important info, shorter for confirmations
3. Don't show notifications for every small action - reserve for significant events
4. Batch operations - show "10 records imported" not "Record 1 imported... Record 2 imported..."

## Troubleshooting

**Notifications not visible?**
- Check NotificationContainer is in Layout component
- Verify Redux store configuration
- Check browser console for errors

**Notifications dismiss too quickly/slowly?**
- Adjust the duration parameter (in milliseconds)
- Default is 5000ms

**Wrong colors or styling?**
- Check tailwind.config.js has keyframes
- Verify Tailwind CSS is compiled
- Clear browser cache and rebuild

## Example: Form with Validation

```javascript
import useNotification from '@/store/useNotification';

function MyForm() {
  const { success, error, warning } = useNotification();
  
  const handleSubmit = async (data) => {
    // Validation
    if (!data.email) {
      error('Validation Error', 'Email is required');
      return;
    }
    
    if (data.age > 65) {
      warning('Age Alert', 'Employee is near retirement age');
    }
    
    try {
      await submitForm(data);
      success('Form Submitted!', 'Your data has been saved');
    } catch (err) {
      error('Submission Failed', err.message);
    }
  };
  
  return (
    // form JSX
  );
}
```

## Redux Integration (Advanced)

### Dispatch Manually (Without Hook)
```javascript
import { useAppDispatch } from '@/store/hooks';
import { showSuccessNotification } from '@/store/notificationSlice';

const dispatch = useAppDispatch();
dispatch(showSuccessNotification('Title', 'Message', 5000));
```

### Access Notifications State
```javascript
import { useSelector } from 'react-redux';
import { selectNotifications } from '@/store/notificationSlice';

const notifications = useSelector(selectNotifications);
console.log(notifications); // Array of active notifications
```

### Remove Notification Manually
```javascript
import { useAppDispatch } from '@/store/hooks';
import { removeNotification } from '@/store/notificationSlice';

const dispatch = useAppDispatch();
dispatch(removeNotification('notification-id'));
```

---

**For detailed documentation, see [NOTIFICATION_SYSTEM.md](./NOTIFICATION_SYSTEM.md)**
