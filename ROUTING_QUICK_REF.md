# Routing Quick Reference

## Quick Navigation

### Files & Locations

| File | Purpose |
|------|---------|
| `src/config/routes.jsx` | Route configuration definitions |
| `src/components/AppRouter.jsx` | Router setup and configuration |
| `src/components/ProtectedRoute.jsx` | Route protection logic |
| `src/App.jsx` | Main app component |
| `src/main.jsx` | React entry point with Redux Provider |
| `ROUTING.md` | Complete routing documentation |

## All Routes at a Glance

### Public Routes (No Login Required)
```
/ → Home page
/login → Login form
/register → Registration form
```

### HR Admin Routes (HR Admin only)
```
/hr/dashboard → HR dashboard with analytics
/hr/employees → Employee management
/hr/leave-requests → Leave request management
/hr/onboarding → Onboarding management
```

### Employee Routes (Employees only)
```
/employee/dashboard → Personal dashboard
/employee/profile → My profile
/employee/request-leave → Submit leave request
/employee/my-leaves → Leave history
```

### Error Routes
```
/unauthorized → Access denied (403)
/* → Page not found (404)
```

## Common Tasks

### Navigate to a Page

```javascript
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  // Navigate to a route
  navigate('/hr/dashboard');
  
  // Navigate back
  navigate(-1);
  
  // Navigate with replace
  navigate('/login', { replace: true });
}
```

### Check Current Route

```javascript
import { useLocation } from 'react-router-dom';

function MyComponent() {
  const location = useLocation();
  
  if (location.pathname === '/hr/dashboard') {
    // Current route is HR dashboard
  }
}
```

### Get Current User Info

```javascript
import { useCurrentUser } from '@/store/hooks';

function MyComponent() {
  const currentUser = useCurrentUser();
  
  console.log(currentUser.role); // 'HR Admin' or 'Employee'
  console.log(currentUser.name);
  console.log(currentUser.email);
}
```

### Add Navigation Link

```javascript
import { useNavigate } from 'react-router-dom';

function NavigationLink() {
  const navigate = useNavigate();
  
  return (
    <button onClick={() => navigate('/hr/employees')}>
      View Employees
    </button>
  );
}
```

### Protect a Component

```javascript
import ProtectedRoute from '@/components/ProtectedRoute';
import MyComponent from './MyComponent';

// In your router configuration
<Route
  path="/admin-only"
  element={
    <ProtectedRoute requiredRole="HR Admin">
      <MyComponent />
    </ProtectedRoute>
  }
/>
```

## Route Configuration Example

**File:** `src/config/routes.jsx`

```javascript
export const routes = [
  {
    path: '/hr/employees',
    element: <EmployeeManagement />,
    label: 'Employee Management',
    requiredRole: 'HR Admin',
  },
];
```

## Get Navigation Items by Role

```javascript
import { getNavigationByRole } from '@/config/routes';

const hrLinks = getNavigationByRole('HR Admin');
// Returns all routes accessible to HR admins

const employeeLinks = getNavigationByRole('Employee');
// Returns all routes accessible to employees
```

## Get Default Dashboard Path

```javascript
import { getDefaultRedirect } from '@/config/routes';

const path = getDefaultRedirect('HR Admin');
// Returns: '/hr/dashboard'

const path = getDefaultRedirect('Employee');
// Returns: '/employee/dashboard'
```

## Authentication Flow

### Login
1. User enters credentials on `/login`
2. System validates and stores user info
3. Redirects to role-based dashboard

### Access Protected Route
1. Route checks if user is authenticated
2. Checks if user has required role
3. Shows component if authorized
4. Redirects to `/login` if not authenticated
5. Redirects to `/unauthorized` if wrong role

### Logout
1. User data is cleared from Redux
2. LocalStorage is cleared
3. Redirect to `/`

## Page Transitions

All pages have smooth fade-in animations:

```css
/* Animation applied automatically */
.page-transition {
  animation: fadeIn 0.3s ease-in-out;
}
```

### Available Animation Classes

```html
<!-- Fade in -->
<div class="animate-fade-in">Content</div>

<!-- Slide from left -->
<div class="animate-slide-in-left">Content</div>

<!-- Slide from right -->
<div class="animate-slide-in-right">Content</div>
```

## Error Pages

### 404 Not Found
- Path: `/*` (any undefined route)
- Component: `NotFound.jsx`
- Shows helpful message and navigation options

### 403 Unauthorized
- Path: `/unauthorized`
- Component: `Unauthorized.jsx`
- Shows when user lacks required role

## Troubleshooting

### "Cannot find module" error
- Check the import path is correct
- Use `@/` for src directory
- Verify file exists

### Page won't load
- Check browser console for errors
- Verify route is in `src/config/routes.jsx`
- Check component is imported correctly

### Route protection not working
- Verify `ProtectedRoute` is wrapping the component
- Check `requiredRole` matches exactly (case-sensitive)
- Verify Redux store has user data

### Redirects to wrong page
- Check Redux auth state
- Verify `getDefaultRedirect()` function
- Check route configuration

## Imports

```javascript
// Navigation
import { useNavigate, useLocation } from 'react-router-dom';

// Route protection
import ProtectedRoute from '@/components/ProtectedRoute';

// Router setup
import AppRouter from '@/components/AppRouter';

// Route config
import { routes, getNavigationByRole, getDefaultRedirect } from '@/config/routes';

// Redux hooks
import { useCurrentUser, useIsAuthenticated } from '@/store/hooks';
```

## Next Steps

- Review [ROUTING.md](./ROUTING.md) for detailed documentation
- Check [src/config/routes.jsx](./src/config/routes.jsx) for all routes
- See [src/components/AppRouter.jsx](./src/components/AppRouter.jsx) for router setup
- Review [src/components/ProtectedRoute.jsx](./src/components/ProtectedRoute.jsx) for protection logic

---

**Quick Help:** Use this file as a quick reference. See [ROUTING.md](./ROUTING.md) for complete documentation.
