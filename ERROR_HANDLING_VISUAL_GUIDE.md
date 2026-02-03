# Error Handling System - Visual Reference

## Quick System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  HR PORTAL APPLICATION                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Error Boundary                                      │  │
│  │  (Catches Component Errors)                         │  │
│  │                                                      │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  Application Routes & Pages                    │ │  │
│  │  │                                                │ │  │
│  │  │  ┌─────────────────────────────────────────┐  │ │  │
│  │  │  │ Components Using useAsyncOperation      │  │ │  │
│  │  │  │                                         │  │ │  │
│  │  │  │ • Dashboard                             │  │ │  │
│  │  │  │ • EmployeeManagement                    │  │ │  │
│  │  │  │ • LeaveRequests                         │  │ │  │
│  │  │  │ • Forms                                 │  │ │  │
│  │  │  └─────────────────────────────────────────┘  │ │  │
│  │  │                                                │ │  │
│  │  │  ┌──────────────────────────────────────────┐ │ │  │
│  │  │  │ API Service (Enhanced)                  │ │ │  │
│  │  │  │ • Error Classification                  │ │ │  │
│  │  │  │ • User-Friendly Messages                │ │ │  │
│  │  │  │ • Retry Logic                           │ │ │  │
│  │  │  │ • Error Logging                         │ │ │  │
│  │  │  └──────────────────────────────────────────┘ │ │  │
│  │  │                                                │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │                                                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  UI Components                                       │  │
│  │  • LoadingSpinner (During API calls)               │  │
│  │  • NetworkStatus (Online/Offline)                  │  │
│  │  • Error Messages (From errorHandler)              │  │
│  │  • NotFoundPage (404 Route)                        │  │
│  │  • ServerErrorPage (500 Errors)                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Error Flow Diagram

```
┌──────────────────┐
│   User Action    │
│  (Button Click)  │
└────────┬─────────┘
         │
         ▼
    ┌─────────────┐
    │  Component  │
    │  executes:  │
    │ execute(fn) │
    └────┬────────┘
         │
         ▼
    ┌──────────────────┐
    │  Show Spinner?   │
    │ {loading: true}  │
    └────┬─────────────┘
         │
         ▼
    ┌──────────────────┐
    │  API Service     │
    │   (Axios)        │
    └────┬─────────────┘
         │
    ┌────┴──────────────────┐
    │                       │
    ▼                       ▼
 SUCCESS              ERROR
    │                   │
    ▼                   ▼
 Return Data      classifyError()
    │                   │
    ▼                   ▼
 Hide Spinner      getUserFriendly
    │              Message()
    ▼              │
 Render Data       ▼
                isRetryable?
                │         │
            YES │         │ NO
                ▼         ▼
           Retry w/    Set Error
           Backoff     State
                │       │
                │       ▼
                │    Show Error
                │    Message
                │    + Retry
                │    Button
                │
                │ (1s, 2s, 4s, 8s, 10s)
                ▼
           Retry Request
           (Max 3 times)
```

## Component Connection Map

```
┌─────────────────────────────────────────────────────────┐
│                  Any Component                          │
│                  (Dashboard, etc)                       │
└─────────────────────────┬───────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐
  │ useAsync    │  │ LoadingSpinn│  │ Error Alert  │
  │ Operation   │  │ er          │  │              │
  │             │  │             │  │              │
  │ Returns:    │  │ Shows when: │  │ Shows when:  │
  │ • loading   │  │ • loading   │  │ • error != n │
  │ • error     │  │   === true  │  │   ull        │
  │ • data      │  │             │  │              │
  │ • execute() │  │ Props:      │  │ Props:       │
  │ • retry()   │  │ • size      │  │ • message    │
  │             │  │ • message   │  │ • onRetry    │
  └─────────────┘  └─────────────┘  └──────────────┘
         │                 │                │
         ▼                 ▼                ▼
      ┌────────────────────────────────────────────┐
      │  Error Handling Utilities                 │
      │  (errorHandler.js)                        │
      │                                            │
      │  classifyError()                          │
      │  getUserFriendlyMessage()                 │
      │  logError()                               │
      │  isRetryableError()                       │
      │  retryWithExponentialBackoff()            │
      └────────────────┬─────────────────────────┘
                       │
                       ▼
                ┌─────────────┐
                │ API Service │
                │  (Enhanced) │
                └─────────────┘
```

## Error Type Decision Tree

```
                          ┌─ Error Occurs ─┐
                          │                │
                          └────────┬────────┘
                                   │
                      ┌────────────▼────────────┐
                      │  Do we have response?  │
                      └────┬──────────────┬────┘
                         NO │             │ YES
                            ▼             ▼
                    ┌──────────────┐  Check Status
                    │ NETWORK_ERR  │    │
                    │ or           │    ├─ 401? ──→ AUTH_ERR (redirect)
                    │ TIMEOUT_ERR  │    ├─ 403? ──→ AUTHZ_ERR
                    │              │    ├─ 400? ──→ VALIDATION_ERR
                    │ RETRYABLE:   │    ├─ 404? ──→ NOT_FOUND_ERR
                    │ YES (wait)   │    ├─ 5xx? ──→ SERVER_ERR
                    └──────────────┘    └─ 4xx? ──→ CLIENT_ERR
                                           (other)
                                             │
                                             ▼
                                        Return Error
                                        with metadata:
                                        • type
                                        • message
                                        • userMessage
                                        • isRetryable
```

## Component States

```
┌────────────────────────────────────────────────┐
│        Component State Management              │
├────────────────────────────────────────────────┤
│                                                │
│  Initial:  {                                  │
│            loading: false,                    │
│            error: null,                       │
│            data: null                         │
│            }                                  │
│                                               │
│  Loading:  {                                  │
│            loading: true,   ← Spinner shows   │
│            error: null,     ← Error hidden    │
│            data: null       ← No data yet     │
│            }                                  │
│                                               │
│  Success:  {                                  │
│            loading: false,  ← Spinner hidden  │
│            error: null,     ← No error        │
│            data: {...}      ← Show data       │
│            }                                  │
│                                               │
│  Error:    {                                  │
│            loading: false,  ← Spinner hidden  │
│            error: {         ← Show error      │
│              type: 'ERR',                    │
│              message: '...',                  │
│              isRetryable: true                │
│            },                                 │
│            data: null       ← No data         │
│            }                                  │
│                                               │
└────────────────────────────────────────────────┘
```

## Retry Logic Timeline

```
Time →
│
├─ 0s ─────► First Attempt (Fails)
│           Classify Error
│           Check if Retryable
│
├─ 1s ──────► DELAY (1 second)
│
├─ 1s ─────► Retry Attempt 1 (Fails)
│           Increment counter
│
├─ 3s ──────► DELAY (2 seconds)
│
├─ 3s ─────► Retry Attempt 2 (Fails)
│           Increment counter
│
├─ 7s ──────► DELAY (4 seconds)
│
├─ 7s ─────► Retry Attempt 3 (Fails)
│           Max retries reached
│
└─ 7s ─────► GIVE UP
           Show Error to User
           Enable Manual Retry

Legend:
─ Exponential Backoff: 1s, 2s, 4s, 8s (max 10s)
─ Multiplier: 2x each retry
─ Total Attempts: 3 + initial = 4 requests
─ Total Time: ~15 seconds
```

## Error Message Flow

```
┌─────────────────────────────────────────┐
│  Raw Error from Server/Network          │
│  "connect ENOTFOUND api.example.com"    │
└──────────────┬──────────────────────────┘
               │
               ▼
        ┌──────────────────┐
        │ classifyError()  │
        │                  │
        │ Analyzes error   │
        │ Determines type  │
        └────────┬─────────┘
                 │
                 ▼
        ┌─────────────────────┐
        │ Error Object:       │
        │ {                   │
        │   type: 'NETWORK',  │
        │   message: 'RAW',   │
        │   status: null      │
        │ }                   │
        └────────┬────────────┘
                 │
                 ▼
        ┌────────────────────────────────┐
        │ getUserFriendlyMessage()        │
        │                                │
        │ Maps error type to user text   │
        └────────┬───────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────┐
        │ User-Friendly Message:         │
        │ "Connection lost.              │
        │  Please check your internet    │
        │  connection and try again."    │
        └────────┬───────────────────────┘
                 │
                 ▼
        ┌────────────────────────────────┐
        │ Display to User in:            │
        │ • Toast notification           │
        │ • Alert component              │
        │ • Error field                  │
        │ • Error page                   │
        └────────────────────────────────┘
```

## Loading States Lifecycle

```
IDLE
 │
 └─► USER ACTION (Click, Submit, Search)
     │
     ▼
 LOADING STARTS
 │
 ├─ Show: LoadingSpinner
 ├─ Show: "Loading..." message
 ├─ Disable: Buttons, Inputs
 └─ Hide: Previous data/error
     │
     ▼
 API REQUEST IN PROGRESS
 │
 ├─ Spinner animates
 ├─ User can't interact
 ├─ Timeout timer starts
 └─ Retries if network available
     │
     ├─────── SUCCESS ────────┐
     │                        │
     │                        ▼
     │                   SUCCESS
     │                    │
     │                    ├─ Hide: LoadingSpinner
     │                    ├─ Show: Data
     │                    ├─ Enable: Buttons
     │                    └─ Return to IDLE
     │
     └─────── ERROR ─────────┐
                             │
                             ▼
                        ERROR CAUGHT
                         │
                         ├─ Hide: LoadingSpinner
                         ├─ Show: Error message
                         ├─ Show: Retry button
                         ├─ Enable: Buttons
                         └─ Check if retryable?
                             │
                             ├─ YES ──→ Auto-retry with backoff
                             │         (Exponential: 1s, 2s, 4s, 8s)
                             │
                             └─ NO ──→ Wait for user manual retry
```

## Network Status Indicator

```
              Browser Online/Offline
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
    ONLINE       OFFLINE      RECONNECTING
        │             │             │
        ▼             ▼             ▼
    Hidden        Show:         Transitioning
               "Offline"
               - Red badge
               - Error message
               - Queued requests
                    │
                    │ (User connects)
                    ▼
              BACK ONLINE
               - Green badge
               - "Back online" message
               - Auto-retry queued
               - Hidden after 3s
```

## File Organization

```
src/
│
├── utils/
│   └── errorHandler.js ·········· Error system hub
│       ├── ERROR_TYPES
│       ├── classifyError()
│       ├── getUserFriendlyMessage()
│       ├── logError()
│       ├── isRetryableError()
│       ├── retryWithExponentialBackoff()
│       ├── Network utilities
│       └── Helper functions
│
├── hooks/
│   └── useAsyncOperation.js ····· State management
│       ├── State variables
│       ├── execute()
│       ├── retry()
│       ├── clearError()
│       └── reset()
│
├── components/
│   ├── ErrorBoundary.jsx ········ Error catching
│   ├── LoadingSpinner.jsx ········ Loading indicator
│   ├── NetworkStatus.jsx ········ Connection status
│   └── [Other components]
│
├── pages/
│   ├── NotFoundPage.jsx ········· 404 page
│   ├── ServerErrorPage.jsx ······ 500 page
│   └── [Other pages]
│
└── services/
    └── api.js ···················· Enhanced API service
        ├── Request interceptor
        ├── Response interceptor
        ├── withRetry()
        └── createApiErrorHandler()
```

---

## Quick Reference Table

### When to Use What

| Need | Use | Location |
|------|-----|----------|
| Catch component errors | `<ErrorBoundary>` | components/ErrorBoundary.jsx |
| Manage async state | `useAsyncOperation()` | hooks/useAsyncOperation.js |
| Show loading | `<LoadingSpinner>` | components/LoadingSpinner.jsx |
| Show network status | `<NetworkStatus>` | components/NetworkStatus.jsx |
| Classify errors | `classifyError()` | utils/errorHandler.js |
| Get user message | `getUserFriendlyMessage()` | utils/errorHandler.js |
| Log errors | `logError()` | utils/errorHandler.js |
| Check retryable | `isRetryableError()` | utils/errorHandler.js |
| Auto-retry | `retryWithExponentialBackoff()` | utils/errorHandler.js |
| Check connection | `isOnline()` | utils/errorHandler.js |
| Wait for network | `waitForNetwork()` | utils/errorHandler.js |
| Wrap API calls | `withRetry()` | services/api.js |

### Error Type Quick Lookup

| Error | Type | Retryable | Show |
|-------|------|-----------|------|
| No connection | NETWORK | ✅ | Offline indicator |
| Request timeout | TIMEOUT | ✅ | Spinner + Retry |
| Invalid token | AUTH | ❌ | Redirect to login |
| No permission | AUTHZ | ❌ | Forbidden message |
| URL not found | NOT_FOUND | ❌ | 404 page |
| Bad input | VALIDATION | ❌ | Field errors |
| Server error | SERVER | ✅ | 500 page + Retry |
| Other 4xx | CLIENT | ❌ | Error message |
| Unknown | UNKNOWN | ❌ | Generic message |

---

**Last Updated:** 2024
**Status:** Complete & Production Ready
