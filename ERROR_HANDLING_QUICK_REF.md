# Error Handling Quick Reference

## Quick Start Checklist

- [x] Error classification system created
- [x] Error boundary component created  
- [x] 404 error page created
- [x] 500 error page created
- [x] Loading spinner component created
- [x] useAsyncOperation hook created
- [x] API service enhanced with error handling
- [x] Network status component created
- [ ] Update all components with error handling (IN PROGRESS)
- [ ] Update all async operations with try-catch
- [ ] Test all error scenarios

## Most Common Patterns

### Pattern 1: Fetch Data with Loading & Error

```jsx
import useAsyncOperation from '@/hooks/useAsyncOperation';
import LoadingSpinner from '@/components/LoadingSpinner';
import Alert from '@/components/Alert';

function MyComponent() {
  const { loading, error, data, execute, retry } = useAsyncOperation();

  useEffect(() => {
    execute(() => api.get('/endpoint'));
  }, [execute]);

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" message={error.message} onRetry={retry} />;
  
  return <div>{/* render data */}</div>;
}
```

### Pattern 2: Form Submission with Error Handling

```jsx
const { loading, error, execute, clearError } = useAsyncOperation();

const handleSubmit = async (data) => {
  clearError();
  try {
    await execute(() => api.post('/endpoint', data), {
      autoRetry: true,
      onSuccess: () => {
        showNotification('Success!');
        navigate('/');
      }
    });
  } catch (err) {
    // Error already in state
  }
};

return (
  <form onSubmit={handleSubmit}>
    {error && <Alert type="error" message={error.message} />}
    <button disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
  </form>
);
```

### Pattern 3: Try-Catch for Async Operations

```jsx
try {
  const result = await api.post('/endpoint', data);
  console.log('Success:', result);
} catch (error) {
  const classified = classifyError(error);
  logError(error, { operation: 'MyOperation' });
  showNotification(getUserFriendlyMessage(classified));
}
```

### Pattern 4: Automatic Retry with Backoff

```jsx
import { retryWithExponentialBackoff } from '@/utils/errorHandler';

try {
  const result = await retryWithExponentialBackoff(
    () => api.get('/data'),
    {
      maxRetries: 3,
      onRetry: (attempt, error) => {
        console.log(`Attempt ${attempt}: ${error.message}`);
      }
    }
  );
} catch (error) {
  console.log('All retries failed');
}
```

## Error Types Quick Lookup

| Type | Status Code | Retryable | Action |
|------|-------------|-----------|--------|
| NETWORK_ERROR | - | ✅ Yes | Retry, Show offline UI |
| TIMEOUT_ERROR | - | ✅ Yes | Retry with backoff |
| AUTHENTICATION_ERROR | 401 | ❌ No | Redirect to login |
| AUTHORIZATION_ERROR | 403 | ❌ No | Show unauthorized UI |
| NOT_FOUND_ERROR | 404 | ❌ No | Show 404 page |
| VALIDATION_ERROR | 400 | ❌ No | Show field errors |
| SERVER_ERROR | 5xx | ✅ Yes | Retry, Show error page |
| CLIENT_ERROR | 4xx (other) | ❌ No | Show error message |
| UNKNOWN_ERROR | - | ❌ No | Show generic error |

## Component Usage Examples

### LoadingSpinner
```jsx
import LoadingSpinner from '@/components/LoadingSpinner';

<LoadingSpinner size="md" message="Loading..." />
<LoadingSpinner fullScreen overlay message="Processing..." />
```

### ErrorBoundary
```jsx
import ErrorBoundary from '@/components/ErrorBoundary';

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

### NetworkStatus
```jsx
import NetworkStatus from '@/components/NetworkStatus';

<NetworkStatus position="top" />
```

### Error Pages
```jsx
import NotFoundPage from '@/pages/NotFoundPage';
import ServerErrorPage from '@/pages/ServerErrorPage';

<Route path="*" element={<NotFoundPage />} />
```

## Utility Functions Quick Reference

```javascript
import {
  classifyError,           // Categorize error
  getUserFriendlyMessage,  // Get user message
  logError,               // Log error
  isRetryableError,       // Check if retryable
  retryWithExponentialBackoff, // Retry with backoff
  isOnline,               // Check connection
  waitForNetwork,         // Wait for connection
  createError,            // Create error object
  validateResponse,       // Validate response
  safeAsync,              // Wrap async operation
  debounceWithErrorHandling, // Debounce safely
} from '@/utils/errorHandler';
```

## API Service Utilities

```javascript
import {
  withRetry,              // Wrapper with retry
  createApiErrorHandler,  // Create error handler
} from '@/services/api';
```

## Hook Usage

```javascript
import useAsyncOperation from '@/hooks/useAsyncOperation';

const {
  loading,     // boolean
  error,       // error object or null
  data,        // result data
  retryCount,  // number
  isRetrying,  // boolean
  execute,     // (fn, options) => Promise
  retry,       // (fn, options) => Promise
  clearError,  // () => void
  reset,       // () => void
} = useAsyncOperation();
```

## Common Debugging

### Check Error Type
```javascript
const error = classifyError(apiError);
console.log('Error Type:', error.type);
console.log('Is Retryable:', error.isRetryable);
```

### Get User Message
```javascript
const message = getUserFriendlyMessage(error);
console.log('Show to user:', message);
```

### Enable Dev Logging
```javascript
// In development, errors are logged to console with context
logError(error, { operation: 'MyOp', userId: 123 });
```

### Test Offline Mode
1. Open DevTools
2. Go to Network tab
3. Set Throttling to "Offline"
4. Component should show offline UI

### Test Error Boundary
```javascript
// Cause an error
const data = undefined;
data.map(x => x); // RenderError - caught by ErrorBoundary
```

## File Locations

```
src/
├── utils/
│   └── errorHandler.js          ✅ Error utilities
├── hooks/
│   └── useAsyncOperation.js      ✅ Async state hook
├── components/
│   ├── ErrorBoundary.jsx         ✅ Error catching
│   ├── LoadingSpinner.jsx        ✅ Loading indicator
│   └── NetworkStatus.jsx         ✅ Network status
├── pages/
│   ├── NotFoundPage.jsx          ✅ 404 page
│   └── ServerErrorPage.jsx       ✅ 500 page
└── services/
    └── api.js                    ✅ Enhanced API service
```

## Implementation Status

✅ Error classification system - COMPLETE
✅ Error handling utilities - COMPLETE  
✅ Error boundary component - COMPLETE
✅ Loading spinner component - COMPLETE
✅ Network status component - COMPLETE
✅ 404 error page - COMPLETE
✅ 500 error page - COMPLETE
✅ useAsyncOperation hook - COMPLETE
✅ API service enhancement - COMPLETE
⏳ Component integration - IN PROGRESS
⏳ Test error scenarios - PENDING

## Next Steps

1. Update components to use error handling:
   - [ ] Dashboard.jsx
   - [ ] EmployeeManagement.jsx
   - [ ] LeaveRequestsPage.jsx
   - [ ] EmployeeOnboardingPortal.jsx
   - [ ] Other data-fetching components

2. Add try-catch to async operations:
   - [ ] authSlice.js
   - [ ] employeeSlice.js
   - [ ] All async thunks

3. Test error scenarios:
   - [ ] Network offline
   - [ ] API timeout
   - [ ] Invalid token
   - [ ] 404 resource
   - [ ] 500 server error
   - [ ] Component render error

4. Update documentation for each component

---

**Status:** Error Handling System Complete - Ready for Component Integration
**Last Updated:** 2024
