

// Public pages
import Home from '@/pages/Home';
import Login from '@/components/Login';
import Register from '@/components/Register';

// Protected pages - HR Admin
import Dashboard from '@/pages/Dashboard';
import EmployeeManagement from '@/pages/EmployeeManagement';
import LeaveRequestsPage from '@/pages/LeaveRequestsPage';
import OnboardingDashboard from '@/pages/OnboardingDashboard';

// Protected pages - Employee
import EmployeeDashboard from '@/pages/EmployeeDashboard';
import EmployeeProfile from '@/pages/EmployeeProfile';
import EmployeeOnboardingPortal from '@/pages/EmployeeOnboardingPortal';
import LeaveHistoryPage from '@/pages/LeaveHistoryPage';

// Error pages
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/components/Unauthorized';

/**
 * Route Configuration
 * Defines all available routes in the application
 */
export const routes = [
  // Public Routes
  {
    path: '/',
    element: <Home />,
    label: 'Home',
    public: true,
  },
  {
    path: '/login',
    element: <Login />,
    label: 'Login',
    public: true,
  },
  {
    path: '/register',
    element: <Register />,
    label: 'Register',
    public: true,
  },

  // HR Admin Routes
  {
    path: '/hr/dashboard',
    element: <Dashboard />,
    label: 'HR Dashboard',
    requiredRole: 'hr',
  },
  {
    path: '/hr/employees',
    element: <EmployeeManagement />,
    label: 'Employee Management',
    requiredRole: 'hr',
  },
  {
    path: '/hr/leave-requests',
    element: <LeaveRequestsPage />,
    label: 'Leave Requests',
    requiredRole: 'hr',
  },
  {
    path: '/hr/onboarding',
    element: <OnboardingDashboard />,
    label: 'Onboarding',
    requiredRole: 'hr',
  },

  // Employee Routes
  {
    path: '/employee/dashboard',
    element: <EmployeeDashboard />,
    label: 'Dashboard',
    requiredRole: 'employee',
  },
  {
    path: '/employee/profile',
    element: <EmployeeProfile />,
    label: 'My Profile',
    requiredRole: 'employee',
  },
  {
    path: '/employee/request-leave',
    element: <EmployeeOnboardingPortal />,
    label: 'Request Leave',
    requiredRole: 'employee',
  },
  {
    path: '/employee/my-leaves',
    element: <LeaveHistoryPage />,
    label: 'My Leave History',
    requiredRole: 'employee',
  },

  // Error Routes
  {
    path: '/unauthorized',
    element: <Unauthorized />,
    label: 'Unauthorized',
  },
  {
    path: '*',
    element: <NotFound />,
    label: 'Not Found',
  },
];

/**
 * Get navigation links for a specific role
 * @param {string} role - User role
 * @returns {Array} Array of navigation links
 */
export const getNavigationByRole = (role) => {
  if (!role) return [];

  const baseRoutes = routes.filter((route) => route.public && route.path !== '/');

  if (role === 'hr') {
    return [
      ...baseRoutes,
      ...routes.filter(
        (route) =>
          route.requiredRole === 'hr' ||
          route.label === 'Onboarding'
      ),
    ];
  }

  if (role === 'employee') {
    return [
      ...baseRoutes,
      ...routes.filter((route) => route.requiredRole === 'employee'),
    ];
  }

  return baseRoutes;
};

/**
 * Get the default redirect path for a user role
 * @param {string} role - User role
 * @returns {string} Redirect path
 */
export const getDefaultRedirect = (role) => {
  switch (role) {
    case 'hr':
      return '/hr/dashboard';
    case 'employee':
      return '/employee/dashboard';
    default:
      return '/';
  }
};
