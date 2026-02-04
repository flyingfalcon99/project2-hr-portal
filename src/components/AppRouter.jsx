import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ProtectedRoute from '@/components/ProtectedRoute';
import NotificationContainer from '@/components/NotificationContainer';
import { routes } from '@/config/routes';

/**
 * AppRouter Component
 * Configures all application routes with protection and transitions
 */
export default function AppRouter() {
  const dispatch = useDispatch();

  // Initialize auth state on app load
  useEffect(() => {
    // Load user from localStorage if available
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        JSON.parse(savedUser);
        // User data is already in localStorage, will be loaded by Redux persist
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }, [dispatch]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Router>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
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
        ))}
      </Routes>

      {/* Global Notification Container */}
      <NotificationContainer />
    </Router>
  );
}

/**
 * PageTransition Component
 * Adds smooth fade-in animation to page transitions
 */
function PageTransition({ children }) {
  return (
    <div className="page-transition">
      {children}
    </div>
  );
}
