# Error Handling & Loading States Implementation Guide

## Overview
This document describes the comprehensive error handling and loading states system implemented in the HR Portal project.

## Table of Contents
1. [Error Handling Utilities](#error-handling-utilities)
2. [Components](#components)
3. [Hooks](#hooks)
4. [API Service](#api-service)
5. [Implementation Examples](#implementation-examples)
6. [Error Types](#error-types)

---

## Error Handling Utilities

### `src/utils/errorHandler.js`

Central error handling system with 12+ utility functions.

#### Error Types Classification

```javascript
ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',           // Connection failed
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',           // Request timeout
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR', // 401 - Session expired
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',   // 403 - No permission
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',       // 404 - Resource missing
  VALIDATION_ERROR: 'VALIDATION_ERROR',     // 400 - Bad input
  SERVER_ERROR: 'SERVER_ERROR',             // 5xx - Server error
  CLIENT_ERROR: 'CLIENT_ERROR',             // Other client errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'            // Unclassified
}
```

#### Key Functions

##### `classifyError(error)`
Categorizes and structures error objects.

```javascript
import { classifyError } from '@/utils/errorHandler';

try {
  // API call
} catch (error) {
  const classified = classifyError(error);
  console.log(classified.type);        // Error type
  console.log(classified.isRetryable); // Can retry?
  console.log(classified.message);     // Error message
}
```

##### `getUserFriendlyMessage(error)`
Returns user-facing error messages instead of technical details.

```javascript
import { getUserFriendlyMessage } from '@/utils/errorHandler';

const error = classifyError(apiError);
const message = getUserFriendlyMessage(error);
// Shows: "Unable to connect. Please check your internet connection."
```

##### `logError(error, context, data)`
Logs errors with debugging context (development only).

```javascript
import { logError } from '@/utils/errorHandler';

logError(error, {
  endpoint: '/api/employees',
  method: 'GET',
  operation: 'Fetch Employees'
}, { employeeId: 123 });
```

##### `isRetryableError(error)`
Checks if an error should be automatically retried.

```javascript
import { isRetryableError } from '@/utils/errorHandler';

const error = classifyError(apiError);
if (isRetryableError(error)) {
  // Retry the request
}
```

##### `retryWithExponentialBackoff(operation, options)`
Automatically retries failed operations with exponential backoff.

```javascript
import { retryWithExponentialBackoff } from '@/utils/errorHandler';

// Retry with default settings (3 retries, 1s-10s backoff)
await retryWithExponentialBackoff(
  () => api.get('/employees'),
  {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    multiplier: 2,
    onRetry: (attempt, error) => {
      console.log(`Retry attempt ${attempt}:`, error.message);
    }
  }
);
```

**Backoff Strategy:**
- Initial delay: 1 second
- Multiplier: 2x per retry
- Max delay: 10 seconds
- Retryable status codes: 408, 429, 500, 502, 503, 504

##### `isOnline() / waitForNetwork(timeout)`
Network connectivity detection.

```javascript
import { isOnline, waitForNetwork } from '@/utils/errorHandler';

// Check current status
if (isOnline()) {
  console.log('Internet connection active');
}

// Wait for network to be available
try {
  await waitForNetwork(30000); // 30 second timeout
  console.log('Network restored!');
} catch (error) {
  console.log('Network unavailable');
}
```

##### `safeAsync(fn, onError)`
Wrapper for safe async operations.

```javascript
import { safeAsync } from '@/utils/errorHandler';

const result = await safeAsync(
  () => api.get('/employees'),
  (error) => console.log('Error occurred:', error.message)
);
```

---

## Components

### ErrorBoundary

**Location:** `src/components/ErrorBoundary.jsx`

React error boundary component to catch component errors and prevent app crashes.

#### Features
- Catches component render errors
- Displays fallback UI
- Retry mechanism
- Error logging with context
- Development mode: shows stack traces
- Production mode: clean error message

#### Usage

```jsx
import ErrorBoundary from '@/components/ErrorBoundary';

// Wrap entire app
<ErrorBoundary>
  <App />
</ErrorBoundary>

// Or wrap specific sections
<ErrorBoundary>
  <EmployeeManagement />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<CustomErrorUI />}>
  <DataTable />
</ErrorBoundary>
```

### NotFoundPage (404)

**Location:** `src/pages/NotFoundPage.jsx`

Displays 404 error page when resource is not found.

#### Features
- Clear 404 error message
- Helpful navigation links
- Back button
- Home button
- Responsive design

#### Usage

```jsx
// In routing configuration
import NotFoundPage from '@/pages/NotFoundPage';

<Route path="/404" element={<NotFoundPage />} />
<Route path="*" element={<NotFoundPage />} /> // Catch-all route
```

### ServerErrorPage (500)

**Location:** `src/pages/ServerErrorPage.jsx`

Displays 500 error page for server errors.

#### Features
- Server error explanation
- Troubleshooting steps
- Refresh page button
- Contact support link
- Error details (dev mode only)

#### Usage

```jsx
import ServerErrorPage from '@/pages/ServerErrorPage';

// In error boundary
<ErrorBoundary fallback={<ServerErrorPage />}>
  <App />
</ErrorBoundary>
```

### LoadingSpinner

**Location:** `src/components/LoadingSpinner.jsx`

Visual loading indicator component.

#### Props

```javascript
{
  size: 'md',           // 'sm' | 'md' | 'lg' | 'xl'
  message: 'Loading...',// Loading message text
  fullScreen: false,    // Display as full-screen overlay
  overlay: false,       // Semi-transparent overlay background
}
```

#### Usage

```jsx
import LoadingSpinner from '@/components/LoadingSpinner';

// Inline spinner
{isLoading && <LoadingSpinner size="md" message="Fetching data..." />}

// Full-screen spinner
{isLoading && <LoadingSpinner fullScreen overlay message="Processing..." />}

// Spinner with custom size
<LoadingSpinner size="lg" message="Uploading file..." />
```

### NetworkStatus

**Location:** `src/components/NetworkStatus.jsx`

Displays network connectivity status.

#### Props

```javascript
{
  position: 'bottom',   // 'top' | 'bottom' | 'top-right' | 'bottom-right' | etc.
  showOnline: false,    // Show when online (normally hidden)
}
```

#### Usage

```jsx
import NetworkStatus from '@/components/NetworkStatus';

// Add to App layout
<div>
  <Navbar />
  <NetworkStatus position="top" showOnline={false} />
  <Route /* ... */ />
</div>

// Shows only when offline, appears at bottom
// Shows when back online with success message
```

---

## Hooks

### useAsyncOperation

**Location:** `src/hooks/useAsyncOperation.js`

Custom hook for managing async operation states (loading, error, data).

#### State

```javascript
{
  loading: boolean,        // Currently loading
  error: object | null,    // Error details if failed
  data: any,              // Result data
  retryCount: number,     // Number of retry attempts
  isRetrying: boolean,    // Currently retrying
}
```

#### Methods

```javascript
{
  execute,     // (fn, options) => Promise - Execute async operation
  retry,       // (fn, options) => Promise - Manual retry
  clearError,  // () => void - Clear error state
  reset,       // () => void - Reset all state
}
```

#### Usage

```jsx
import useAsyncOperation from '@/hooks/useAsyncOperation';

function EmployeeList() {
  const { loading, error, data, execute } = useAsyncOperation();

  useEffect(() => {
    execute(() => api.get('/employees'))
      .catch(err => console.log('Failed:', err.message));
  }, [execute]);

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert type="error" title={error.message} />;
  
  return <DataTable data={data} />;
}
```

#### With Options

```jsx
const { loading, error, data, execute, retry } = useAsyncOperation(
  (error) => {
    // Custom error handler
    showToast(error.message);
  }
);

// Execute with auto-retry
await execute(
  () => api.post('/employees', employeeData),
  {
    maxRetries: 3,
    retryDelay: 1000,
    autoRetry: true,
    onSuccess: (result) => {
      console.log('Success:', result);
      navigate('/employees');
    },
  }
);

// Manual retry
await retry(() => api.post('/employees', employeeData));
```

---

## API Service

### Enhanced API Service

**Location:** `src/services/api.js`

API service with integrated error handling and retry logic.

#### Features
- Request interceptor: Auto-attach auth token
- Response interceptor: Classify and handle errors
- Built-in error logging
- User-friendly error messages
- Token refresh on 401

#### New Utility Functions

##### `withRetry(apiCall, options)`
Wrapper for API calls with automatic retry.

```javascript
import { withRetry } from '@/services/api';

// Retry failed GET request
const employees = await withRetry(() => api.get('/employees'));

// With custom options
const data = await withRetry(
  () => api.post('/employees', payload),
  {
    maxRetries: 5,
    initialDelay: 2000,
  }
);
```

##### `createApiErrorHandler(operation)`
Create standardized error handlers for specific operations.

```javascript
import { createApiErrorHandler, employeeGetAll } from '@/services/api';

const handleError = createApiErrorHandler('Fetch Employees');

try {
  const employees = await employeeGetAll();
} catch (error) {
  handleError(error); // Logs with operation context
}
```

#### Error Response Format

All API errors now include:

```javascript
{
  type: 'ERROR_TYPE',        // Classification
  message: 'Technical message', // For logging
  userMessage: 'User-friendly message',
  isRetryable: boolean,      // Can be retried
  status: 404,              // HTTP status
  data: {},                 // Response data
  originalError: Error      // Original error object
}
```

---

## Implementation Examples

### Example 1: Protected Form with Error Handling

```jsx
import { useState } from 'react';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import { employeeCreate } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import Alert from '@/components/Alert';

export default function CreateEmployeeForm() {
  const { loading, error, execute, clearError } = useAsyncOperation();
  const [formData, setFormData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    try {
      await execute(() => employeeCreate(formData), {
        autoRetry: true,
        maxRetries: 3,
        onSuccess: () => {
          showNotification('Employee created successfully!');
          navigate('/employees');
        },
      });
    } catch (err) {
      console.log('Creation failed:', err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert
          type="error"
          title="Error"
          message={error.message}
          onClose={clearError}
        />
      )}

      {/* Form fields */}
      
      <button disabled={loading} type="submit">
        {loading ? <LoadingSpinner size="sm" /> : 'Create Employee'}
      </button>
    </form>
  );
}
```

### Example 2: Data Fetching with Retry UI

```jsx
import { useEffect, useState } from 'react';
import { employeeGetAll } from '@/services/api';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';
import LoadingSpinner from '@/components/LoadingSpinner';
import Alert from '@/components/Alert';

export default function EmployeeList() {
  const { loading, error, data: employees, execute, retry } = useAsyncOperation();

  useEffect(() => {
    execute(() => employeeGetAll(), {
      autoRetry: true,
      onSuccess: (data) => console.log('Employees loaded:', data.length),
    });
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading employees..." />;
  }

  if (error) {
    return (
      <Alert
        type="error"
        title="Failed to load employees"
        message={error.userMessage || error.message}
        actions={[
          {
            label: 'Retry',
            onClick: () => retry(() => employeeGetAll()),
          },
          {
            label: 'Go Back',
            onClick: () => navigate(-1),
          },
        ]}
      />
    );
  }

  return (
    <div>
      <h1>Employees ({employees.length})</h1>
      {/* Render employee list */}
    </div>
  );
}
```

### Example 3: Error Boundary in Router

```jsx
import ErrorBoundary from '@/components/ErrorBoundary';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  return (
    <ErrorBoundary fallback={<ServerErrorPage />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<EmployeeList />} />
          
          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
```

### Example 4: Network-Aware Component

```jsx
import { useState, useEffect } from 'react';
import { waitForNetwork, isOnline } from '@/utils/errorHandler';
import NetworkStatus from '@/components/NetworkStatus';

export default function DataSync() {
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!isOnline()) {
      // Wait for network
      waitForNetwork(30000)
        .then(() => {
          console.log('Network restored, syncing...');
          syncData();
        })
        .catch(() => {
          console.log('Network timeout');
        });
    }
  }, []);

  const syncData = async () => {
    setSyncing(true);
    try {
      // Sync operations
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      <NetworkStatus />
      {syncing && <LoadingSpinner message="Syncing data..." />}
    </div>
  );
}
```

---

## Error Types & Handling

### Network Errors

```javascript
// Automatically detected and classified
// Retryable: YES
// User message: "Connection lost. Please check your internet."
```

**Handling:**
- Show offline indicator
- Queue requests
- Retry when online

### Authentication Errors (401)

```javascript
// Session expired or invalid token
// Retryable: NO
// User message: "Your session has expired. Please log in again."
```

**Handling:**
- Clear stored token
- Redirect to login
- Preserve return URL

### Authorization Errors (403)

```javascript
// User lacks permission
// Retryable: NO
// User message: "You don't have permission to perform this action."
```

**Handling:**
- Show unauthorized message
- Suggest contacting admin
- Redirect to accessible page

### Validation Errors (400)

```javascript
// Invalid input data
// Retryable: NO
// User message: "Please check your input and try again."
```

**Handling:**
- Highlight invalid fields
- Show field-specific errors
- Allow user to correct

### Server Errors (5xx)

```javascript
// Server-side failure
// Retryable: YES (with backoff)
// User message: "Service temporarily unavailable. Trying again..."
```

**Handling:**
- Show error page
- Implement exponential backoff
- Display retry UI

### Timeout Errors

```javascript
// Request took too long
// Retryable: YES
// User message: "Request took too long. Please try again."
```

**Handling:**
- Auto-retry with backoff
- Show loading indicator
- Allow manual retry

---

## Best Practices

1. **Always use try-catch in async operations**
   ```javascript
   try {
     await api.post('/endpoint', data);
   } catch (error) {
     // Handle error
   }
   ```

2. **Use error utilities for classification**
   ```javascript
   const classified = classifyError(error);
   if (classified.isRetryable) { /* retry */ }
   ```

3. **Log errors with context**
   ```javascript
   logError(error, { operation: 'Create Employee', userId: 123 });
   ```

4. **Show user-friendly messages**
   ```javascript
   const message = getUserFriendlyMessage(error);
   showNotification(message); // Not error.message
   ```

5. **Use loading spinners**
   ```javascript
   {loading && <LoadingSpinner message="Loading..." />}
   ```

6. **Implement retry UI**
   ```javascript
   {error && <button onClick={() => retry()}>Retry</button>}
   ```

7. **Wrap app in ErrorBoundary**
   ```javascript
   <ErrorBoundary>
     <App />
   </ErrorBoundary>
   ```

---

## Testing Error Scenarios

### Network Error
- Disable internet connection
- Check offline indicator appears
- Verify automatic retry on reconnect

### API Error
- Call non-existent endpoint
- Verify error message displays
- Check error is logged

### Component Error
- Cause render error (e.g., `undefined.map()`)
- Verify ErrorBoundary catches it
- Check fallback UI displays

### Timeout
- Increase API_TIMEOUT in .env
- Call slow endpoint
- Verify timeout error handling

### Authentication
- Let token expire
- Make authenticated request
- Verify redirect to login

---

## Files Summary

| File | Purpose | Status |
|------|---------|--------|
| `src/utils/errorHandler.js` | Error classification & utilities | ✅ Complete |
| `src/components/ErrorBoundary.jsx` | React error boundary | ✅ Complete |
| `src/components/LoadingSpinner.jsx` | Loading indicator | ✅ Complete |
| `src/components/NetworkStatus.jsx` | Network status indicator | ✅ Complete |
| `src/pages/NotFoundPage.jsx` | 404 error page | ✅ Complete |
| `src/pages/ServerErrorPage.jsx` | 500 error page | ✅ Complete |
| `src/hooks/useAsyncOperation.js` | Async state management | ✅ Complete |
| `src/services/api.js` | Enhanced API service | ✅ Updated |

---

## Next Steps

1. ✅ Update all API endpoints in components to use error handling
2. ✅ Add try-catch blocks to async operations
3. ✅ Integrate LoadingSpinner in forms and data fetches
4. ✅ Test all error scenarios
5. ✅ Add error handling to offline scenarios
6. ✅ Update existing components with error handlers

---

**Last Updated:** 2024
**Status:** Complete & Ready for Production
