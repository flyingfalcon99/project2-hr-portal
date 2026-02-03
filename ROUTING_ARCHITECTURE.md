# Complete Routing Architecture Guide

## System Overview

The HR Portal implements a comprehensive routing system with:
- **Public Routes** - Accessible without authentication
- **Protected Routes** - Require authentication and role-based access
- **Error Routes** - 404 and 403 pages
- **Smooth Transitions** - Page fade-in animations

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Router                      │
├─────────────────────────────────────────────────────────────┤
│  AppRouter.jsx - Main router configuration                  │
│  - Renders all routes from route config                     │
│  - Wraps protected routes with ProtectedRoute               │
│  - Applies page transitions                                 │
│  - Renders global notifications                             │
└─────────────────────────────────────────────────────────────┘
         │
         ├─────────────────────────────────────────────────────┐
         │                                                     │
    ┌────▼────────────────┐                  ┌────────────────▼──────┐
    │  Public Routes      │                  │  Protected Routes    │
    ├─────────────────────┤                  ├─────────────────────┤
    │ /                   │                  │ /hr/*               │
    │ /login              │                  │ /employee/*         │
    │ /register           │                  │ + role validation   │
    │                     │                  │                     │
    │ No auth required    │                  │ Auth required       │
    │ Direct access       │                  │ Role-based access   │
    └─────────────────────┘                  └─────────────────────┘
         │                                             │
         │                                    ┌────────▼────────┐
         │                                    │ ProtectedRoute  │
         │                                    ├─────────────────┤
         │                                    │ Checks:         │
         │                                    │ - Authenticated │
         │                                    │ - Role match    │
         │                                    │ - Redirects     │
         │                                    └─────────────────┘
         │
    ┌────▼────────────────────────────────────┐
    │     PageTransition (Wrapper)            │
    ├──────────────────────────────────────────┤
    │ Applies fade-in animation               │
    │ Duration: 300ms                         │
    │ Scrolls to top on route change          │
    └──────────────────────────────────────────┘
```

## Route Configuration Structure

### Configuration File: `src/config/routes.jsx`

```javascript
export const routes = [
  // Each route has:
  {
    path: '/path',           // URL path
    element: <Component />,  // Component to render
    label: 'Label',          // Display name
    public: true,            // Optional: public routes
    requiredRole: 'Role',    // Optional: required role
  },
];
```

## Route Organization by Role

### Public Routes (No Authentication Required)

```
├── / (Home)
│   └── Home.jsx - Landing page with features
│
├── /login (Login)
│   └── Login.jsx - Login form with validation
│
└── /register (Register)
    └── Register.jsx - Registration form
```

### HR Admin Routes (Role: "HR Admin")

```
├── /hr/dashboard (HR Dashboard)
│   └── Dashboard.jsx - Analytics and overview
│
├── /hr/employees (Employee Management)
│   └── EmployeeManagement.jsx - Employee list and CRUD
│
├── /hr/leave-requests (Leave Management)
│   └── LeaveRequestsPage.jsx - Approve/reject leaves
│
└── /hr/onboarding (Onboarding Management)
    └── OnboardingDashboard.jsx - Onboarding processes
```

### Employee Routes (Role: "Employee")

```
├── /employee/dashboard (Dashboard)
│   └── EmployeeDashboard.jsx - Personal dashboard
│
├── /employee/profile (My Profile)
│   └── EmployeeProfile.jsx - Profile information
│
├── /employee/request-leave (Request Leave)
│   └── EmployeeOnboardingPortal.jsx - Leave request form
│
└── /employee/my-leaves (Leave History)
    └── LeaveHistoryPage.jsx - Leave history view
```

### Error Routes

```
├── /unauthorized (Access Denied)
│   └── Unauthorized.jsx - 403 error page
│
└── /* (Not Found)
    └── NotFound.jsx - 404 error page
```

## Authentication & Authorization Flow

### Step 1: User Visits Application
```
User visits https://localhost:5173
    ↓
App.jsx loads
    ↓
AppRouter initializes
    ↓
Check Redux auth state
    ↓
If authenticated → Show last route
If not authenticated → Redirect to /login
```

### Step 2: User Logs In
```
User fills login form at /login
    ↓
Submit credentials
    ↓
API validates user
    ↓
If valid:
    - Create user object with role
    - Store in Redux auth state
    - Save to localStorage
    - Redirect to role-based dashboard
    
If invalid:
    - Show error notification
    - Stay on /login
```

### Step 3: Access Protected Route
```
User navigates to /hr/employees
    ↓
Route checks ProtectedRoute wrapper
    ↓
ProtectedRoute checks:
    ├─ Is user authenticated? 
    │  └─ If NO → Navigate to /login
    │
    └─ Does user have required role (HR Admin)?
       └─ If NO → Navigate to /unauthorized
       └─ If YES → Render component
```

### Step 4: Page Transition
```
Route renders component
    ↓
PageTransition wrapper applies CSS animation
    ↓
fadeIn animation:
    - Duration: 300ms
    - Opacity: 0 → 1
    - Transform: translateY(8px) → 0
    ↓
Component fully visible
```

## Code Flow Examples

### Example 1: User Navigates to HR Dashboard

```javascript
// User clicks navigation link
<button onClick={() => navigate('/hr/dashboard')}>
  Dashboard
</button>

// AppRouter renders:
<Route
  path="/hr/dashboard"
  element={
    <ProtectedRoute requiredRole="HR Admin">
      <PageTransition>
        <Dashboard />
      </PageTransition>
    </ProtectedRoute>
  }
/>

// ProtectedRoute checks:
1. Is user authenticated? ✓
2. Is user role === 'HR Admin'? ✓
3. Render Dashboard component

// PageTransition applies animation:
.page-transition {
  animation: fadeIn 0.3s ease-in-out forwards;
}

// Window scrolls to top
window.scrollTo(0, 0);
```

### Example 2: Unauthorized Access Attempt

```javascript
// Employee tries to access HR route
// navigates to /hr/employees

// AppRouter renders with ProtectedRoute
// ProtectedRoute checks:
1. Is user authenticated? ✓
2. Is user role === 'HR Admin'? ✗ (User is 'Employee')

// ProtectedRoute redirects:
return <Navigate to="/unauthorized" replace />;

// Unauthorized.jsx component displays
// Shows 403 error and access denied message
```

### Example 3: Non-Authenticated User

```javascript
// User tries to access /employee/dashboard
// But is NOT logged in

// AppRouter renders with ProtectedRoute
// ProtectedRoute checks:
1. Is user authenticated? ✗ (No current user)

// ProtectedRoute redirects:
return <Navigate to="/login" replace />;

// User directed to login page
// After successful login, redirected to dashboard
```

## Helper Functions

### Get Navigation for Role

```javascript
import { getNavigationByRole } from '@/config/routes';

const hrNavigation = getNavigationByRole('HR Admin');
// Returns: [
//   { path: '/hr/dashboard', label: 'HR Dashboard' },
//   { path: '/hr/employees', label: 'Employee Management' },
//   { path: '/hr/leave-requests', label: 'Leave Requests' },
//   { path: '/hr/onboarding', label: 'Onboarding' },
// ]
```

### Get Default Dashboard

```javascript
import { getDefaultRedirect } from '@/config/routes';

const hrPath = getDefaultRedirect('HR Admin');
// Returns: '/hr/dashboard'

const empPath = getDefaultRedirect('Employee');
// Returns: '/employee/dashboard'
```

## Animation System

### CSS Animations

```css
/* Fade In */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide In Left */
@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Applied to page transitions */
.page-transition {
  animation: fadeIn 0.3s ease-in-out forwards;
}
```

### Usage

```javascript
// Applied automatically via PageTransition wrapper
<PageTransition>
  <Dashboard />  {/* Fades in when mounted */}
</PageTransition>

// Or use directly
<div className="animate-fade-in">Content</div>
<div className="animate-slide-in-left">Content</div>
```

## State Management

### Redux Integration

```javascript
// main.jsx - Redux Provider wraps entire app
<Provider store={store}>
  <App />
</Provider>

// AppRouter accesses auth state
const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
const currentUser = useSelector(state => state.auth.currentUser);

// ProtectedRoute uses hooks
const currentUser = useCurrentUser();
const isAuthenticated = useIsAuthenticated();
```

### LocalStorage

```javascript
// User data persisted to localStorage
localStorage.setItem('currentUser', JSON.stringify(user));

// Retrieved on app load
const savedUser = localStorage.getItem('currentUser');
if (savedUser) {
  // Restore user session
}
```

## Routing Hooks

### Navigation

```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/hr/dashboard');      // Navigate to path
navigate(-1);                    // Go back
navigate('/login', { replace: true }); // Replace history
```

### Location

```javascript
import { useLocation } from 'react-router-dom';

const location = useLocation();
console.log(location.pathname);  // Current path
console.log(location.search);    // Query string
```

### Params & Query

```javascript
import { useParams, useSearchParams } from 'react-router-dom';

const { id } = useParams();        // Route params
const [params] = useSearchParams(); // Query params
```

## Performance Optimization

### Code Splitting (Future)

```javascript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('@/pages/Dashboard'));

// Use with Suspense
<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>
```

### Route-Level Caching

```javascript
// Routes maintain component state during navigation
// Reduces re-renders when returning to previous route
```

### Smooth Scrolling

```javascript
// Auto-scroll to top on route change
useEffect(() => {
  window.scrollTo(0, 0);
}, []);

// Smooth scroll CSS
window.scrollTo({
  top: 0,
  behavior: 'smooth'
});
```

## Debugging

### Check Current User

```javascript
import { useCurrentUser } from '@/store/hooks';

const user = useCurrentUser();
console.log('Current User:', user);
console.log('Role:', user?.role);
console.log('Is Authenticated:', !!user);
```

### Check Current Route

```javascript
import { useLocation } from 'react-router-dom';

const location = useLocation();
console.log('Current Path:', location.pathname);
console.log('Route:', location);
```

### Monitor Route Changes

```javascript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

useEffect(() => {
  console.log('Route changed to:', location.pathname);
}, [location.pathname]);
```

## Common Patterns

### Conditional Navigation

```javascript
function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    if (result.payload) {
      // Navigate to role-based dashboard
      const redirectPath = getDefaultRedirect(result.payload.role);
      navigate(redirectPath);
    }
  };
}
```

### Logout Handler

```javascript
function LogoutButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('currentUser');
    navigate('/', { replace: true });
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### Role-Based Rendering

```javascript
function Navigation() {
  const currentUser = useCurrentUser();

  return (
    <>
      {currentUser?.role === 'HR Admin' && (
        <nav>
          <Link to="/hr/dashboard">Dashboard</Link>
          <Link to="/hr/employees">Employees</Link>
        </nav>
      )}
      {currentUser?.role === 'Employee' && (
        <nav>
          <Link to="/employee/dashboard">Dashboard</Link>
          <Link to="/employee/request-leave">Request Leave</Link>
        </nav>
      )}
    </>
  );
}
```

## Related Files

| File | Purpose |
|------|---------|
| `src/config/routes.jsx` | Route definitions |
| `src/components/AppRouter.jsx` | Router setup |
| `src/components/ProtectedRoute.jsx` | Route protection |
| `src/App.jsx` | Main app component |
| `src/main.jsx` | React entry point |
| `src/pages/Home.jsx` | Landing page |
| `src/pages/NotFound.jsx` | 404 page |
| `src/components/Unauthorized.jsx` | 403 page |
| `src/store/authSlice.js` | Auth state |
| `src/store/hooks.js` | Redux hooks |

## Troubleshooting Guide

### Issue: Routes Not Loading

**Symptoms:** Getting 404 or blank pages

**Solutions:**
1. Check route is in `src/config/routes.jsx`
2. Verify component is imported
3. Check path spelling (case-sensitive)
4. Review browser console for errors

### Issue: Protected Routes Not Working

**Symptoms:** Can access protected routes without login

**Solutions:**
1. Verify Redux store is initialized with Provider
2. Check `ProtectedRoute` wrapper is applied
3. Verify user data in Redux store
4. Check role matches exactly

### Issue: Slow Page Transitions

**Symptoms:** Animations are sluggish

**Solutions:**
1. Check animations aren't disabled in browser
2. Review CSS for expensive operations
3. Consider reducing animation duration
4. Check for memory leaks in components

### Issue: localStorage Issues

**Symptoms:** User not persisting between sessions

**Solutions:**
1. Check browser localStorage isn't disabled
2. Verify Redux-persist is configured
3. Check localStorage data in DevTools
4. Clear cache and retry

## Next Steps

1. Review [ROUTING.md](./ROUTING.md) for detailed documentation
2. Check [ROUTING_QUICK_REF.md](./ROUTING_QUICK_REF.md) for quick reference
3. Examine route configuration in `src/config/routes.jsx`
4. Test various user roles and routes
5. Implement custom protected routes as needed

---

**Last Updated:** February 2, 2026  
**Version:** 1.0.0
