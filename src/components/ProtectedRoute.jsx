import { Navigate } from 'react-router-dom';
import { useCurrentUser, useIsAuthenticated } from '@/store/hooks';

/**
 * ProtectedRoute Component
 * 
 * This component protects routes from unauthorized access.
 * It checks:
 * 1. If user is authenticated
 * 2. If user has the required role (if specified)
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Route element to render
 * @param {string} props.requiredRole - Required role to access this route (optional)
 * @returns {React.ReactNode} Protected route element or redirect
 */
export default function ProtectedRoute({ children, requiredRole = null }) {
  const isAuthenticated = useIsAuthenticated();
  const currentUser = useCurrentUser();

  // Not authenticated - redirect to login
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  // Allow if user role matches required role exactly
  if (requiredRole) {
    const userRole = currentUser.role || currentUser.userType;
    
    if (userRole !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // User is authorized
  return children;
}
