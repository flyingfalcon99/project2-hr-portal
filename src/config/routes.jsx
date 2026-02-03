import { lazy } from 'react';

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
    requiredRole: 'HR Admin',
  },
  {
    path: '/hr/employees',
    element: <EmployeeManagement />,
    label: 'Employee Management',
    requiredRole: 'HR Admin',
  },
  {
    path: '/hr/leave-requests',
    element: <LeaveRequestsPage />,
    label: 'Leave Requests',
    requiredRole: 'HR Admin',
  },
  {
    path: '/hr/onboarding',
    element: <OnboardingDashboard />,
    label: 'Onboarding',
    requiredRole: 'HR Admin',
  },

  // Employee Routes
  {
    path: '/employee/dashboard',
    element: <EmployeeDashboard />,
    label: 'Dashboard',
    requiredRole: 'Employee',
  },
  {
    path: '/employee/profile',
    element: <EmployeeProfile />,
    label: 'My Profile',
    requiredRole: 'Employee',
  },
  {
    path: '/employee/request-leave',
    element: <EmployeeOnboardingPortal />,
    label: 'Request Leave',
    requiredRole: 'Employee',
  },
  {
    path: '/employee/my-leaves',
    element: <LeaveHistoryPage />,
    label: 'My Leave History',
    requiredRole: 'Employee',
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

  if (role === 'HR Admin') {
    return [
      ...baseRoutes,
      ...routes.filter(
        (route) =>
          route.requiredRole === 'HR Admin' ||
          route.label === 'Onboarding'
      ),
    ];
  }

  if (role === 'Employee') {
    return [
      ...baseRoutes,
      ...routes.filter((route) => route.requiredRole === 'Employee'),
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
    case 'HR Admin':
      return '/hr/dashboard';
    case 'Employee':
      return '/employee/dashboard';
    default:
      return '/';
  }
};
