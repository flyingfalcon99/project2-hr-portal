# Routing Configuration Documentation

## Overview

The HR Portal uses React Router v7 with a comprehensive routing configuration that includes public routes, protected routes with role-based access control, and smooth page transitions.

## Route Structure

### Public Routes

These routes are accessible to all users without authentication:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Home` | Landing page with features overview |
| `/login` | `Login` | User login form |
| `/register` | `Register` | User registration form |

### HR Admin Routes (Protected)

These routes are accessible only to users with the `HR Admin` role:

| Path | Component | Description |
|------|-----------|-------------|
| `/hr/dashboard` | `Dashboard` | HR admin dashboard with analytics |
| `/hr/employees` | `EmployeeManagement` | Employee list and management |
| `/hr/leave-requests` | `LeaveRequestsPage` | Leave request approvals and management |
| `/hr/onboarding` | `OnboardingDashboard` | Onboarding process management |

### Employee Routes (Protected)

These routes are accessible only to users with the `Employee` role:

| Path | Component | Description |
|------|-----------|-------------|
| `/employee/dashboard` | `EmployeeDashboard` | Employee dashboard with personal stats |
| `/employee/profile` | `EmployeeProfile` | Employee profile and personal information |
| `/employee/request-leave` | `EmployeeOnboardingPortal` | Leave request submission form |
| `/employee/my-leaves` | `LeaveHistoryPage` | View personal leave history |

### Error Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/unauthorized` | `Unauthorized` | Access denied page (403) |
| `*` | `NotFound` | Page not found (404) |

## Route Configuration File

**Location:** `src/config/routes.jsx`

The route configuration is centralized in a single file that defines all routes with their properties:

```javascript
export const routes = [
  {
    path: '/',
    element: <Home />,
    label: 'Home',
    public: true,
  },
  {
    path: '/hr/dashboard',
    element: <Dashboard />,
    label: 'HR Dashboard',
    requiredRole: 'HR Admin',
  },
  // ... more routes
];
```

### Route Properties

- **path** (string): URL path for the route
- **element** (React component): Component to render
- **label** (string): Display label for navigation
- **public** (boolean, optional): Whether route is accessible without authentication
- **requiredRole** (string, optional): Required user role (e.g., "HR Admin", "Employee")

## Router Implementation

**Location:** `src/components/AppRouter.jsx`

The `AppRouter` component:
- Configures all routes from the route configuration
- Wraps protected routes with the `ProtectedRoute` component
- Provides smooth page transitions
- Renders the global notification container
- Scrolls to top on route change

```javascript
<Route
  path={route.path}
  element={
    route.requiredRole ? (
      <ProtectedRoute requiredRole={route.requiredRole}>
        <PageTransition>{route.element}</PageTransition>
      </ProtectedRoute>
    ) : (
      <PageTransition>{route.element}</PageTransition>
    )
  }
/>
```

## Protected Routes

The `ProtectedRoute` component handles authentication and authorization:

```javascript
<ProtectedRoute requiredRole="HR Admin">
  <Dashboard />
</ProtectedRoute>
```

### How It Works

1. Checks if user is authenticated
2. If not authenticated, redirects to `/login`
3. If authenticated but lacks required role, redirects to `/unauthorized`
4. If all checks pass, renders the protected component

### Authentication Check

```javascript
const isAuthenticated = useIsAuthenticated();
const currentUser = useCurrentUser();

if (!isAuthenticated || !currentUser) {
  return <Navigate to="/login" replace />;
}
```

### Role Check

```javascript
const userRole = currentUser.role || currentUser.userType;

if (requiredRole && userRole !== requiredRole) {
  return <Navigate to="/unauthorized" replace />;
}
```

## Page Transitions

Smooth fade-in animations are applied to all page transitions:

```css
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

.page-transition {
  animation: fadeIn 0.3s ease-in-out forwards;
}
```

## Helper Functions

### `getNavigationByRole(role)`

Returns navigation links appropriate for a user role:

```javascript
import { getNavigationByRole } from '@/config/routes';

const links = getNavigationByRole('HR Admin');
// Returns: [Home, Login, Register, HR Dashboard, Employee Management, ...]
```

### `getDefaultRedirect(role)`

Returns the default redirect path after login based on role:

```javascript
import { getDefaultRedirect } from '@/config/routes';

const path = getDefaultRedirect('Employee');
// Returns: '/employee/dashboard'
```

## Usage Examples

### In Navigation Components

```javascript
import { useNavigate } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();
  
  const handleLogin = () => {
    navigate('/login');
  };
}
```

### Programmatic Navigation

```javascript
import { useNavigate } from 'react-router-dom';
import { getDefaultRedirect } from '@/config/routes';

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleLoginSuccess = (user) => {
    dispatch(setCurrentUser(user));
    const redirectPath = getDefaultRedirect(user.role);
    navigate(redirectPath);
  };
}
```

### Checking Current Route

```javascript
import { useLocation } from 'react-router-dom';

function MyComponent() {
  const location = useLocation();
  
  const isOnDashboard = location.pathname === '/hr/dashboard';
}
```

## Authentication Flow

### Login Flow

1. User visits `/login`
2. User submits login credentials
3. Backend validates credentials
4. If valid:
   - User data is stored in Redux
   - User is saved to localStorage
   - User is redirected to role-based dashboard
5. If invalid:
   - Error notification is shown
   - User remains on login page

### Protected Route Access

1. User tries to access protected route (e.g., `/hr/dashboard`)
2. `ProtectedRoute` checks authentication
3. If not authenticated → redirect to `/login`
4. If authenticated but wrong role → redirect to `/unauthorized`
5. If authorized → render component

### Logout Flow

1. User clicks logout
2. Auth state is cleared from Redux
3. LocalStorage data is cleared
4. User is redirected to `/` (home page)

## Handling Role-Based Access

### Check Current User Role

```javascript
import { useCurrentUser } from '@/store/hooks';

function MyComponent() {
  const currentUser = useCurrentUser();
  
  if (currentUser?.role === 'HR Admin') {
    // Show HR-specific UI
  }
}
```

### Show Role-Specific UI

```javascript
import { useCurrentUser } from '@/store/hooks';

function Dashboard() {
  const currentUser = useCurrentUser();
  
  return (
    <>
      {currentUser?.role === 'HR Admin' && <HRDashboard />}
      {currentUser?.role === 'Employee' && <EmployeeDashboard />}
    </>
  );
}
```

## Error Handling

### 404 Not Found

When a user navigates to a non-existent route, the `NotFound` component is displayed with:
- 404 error code
- Helpful message
- Navigation options (Go Back, Go to Home)
- Support contact link

### 403 Unauthorized

When a user tries to access a route they don't have permission for, the `Unauthorized` component is displayed with:
- 403 error code
- Explanation of access denial
- Navigation to allowed pages
- Contact administrator information

## Adding New Routes

To add a new route to the application:

1. Create the component in `src/pages/` or `src/components/`
2. Add the route to `src/config/routes.jsx`:

```javascript
{
  path: '/new-route',
  element: <NewComponent />,
  label: 'New Route',
  requiredRole: 'HR Admin', // if protected
}
```

3. The route is automatically configured in `AppRouter.jsx`

## Performance Considerations

### Code Splitting

Future optimization - consider lazy loading route components:

```javascript
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const EmployeeManagement = lazy(() => import('@/pages/EmployeeManagement'));

// Wrap with Suspense
<Suspense fallback={<Spinner />}>
  <Dashboard />
</Suspense>
```

### Route Transitions

Smooth transitions are applied with CSS animations:
- Fade in: 300ms duration
- Slide left/right: 400ms duration
- Smooth scroll to top on route change

## Troubleshooting

### Route Not Found

If navigating to a route results in a 404:
1. Verify the route exists in `src/config/routes.jsx`
2. Check the component is imported correctly
3. Ensure the path is spelled correctly
4. Check browser console for errors

### Access Denied

If getting redirected to `/unauthorized`:
1. Verify user has the required role
2. Check `currentUser.role` in Redux
3. Verify the route has `requiredRole` set correctly
4. Check `ProtectedRoute` component logic

### Page Not Transitioning

If page transitions are not smooth:
1. Check `.page-transition` CSS is loaded
2. Verify animations are not disabled in browser
3. Check console for CSS errors
4. Ensure `PageTransition` wrapper is applied

## Related Documentation

- [Authentication Guide](./AUTH_GUIDE.md) - Authentication system details
- [Redux Store](./STORE_GUIDE.md) - State management
- [Component Guide](./COMPONENTS_GUIDE.md) - Component architecture
- [Form Validation](./VALIDATION_GUIDE.md) - Form validation rules

---

**Last Updated:** February 2, 2026
**Version:** 1.0.0
