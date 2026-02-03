import AppRouter from '@/components/AppRouter';
import './App.css';

/**
 * Main App Component
 * 
 * This is the root component that renders the entire application.
 * It includes the router configuration and global state management.
 * 
 * Route Structure:
 * - Public routes: /, /login, /register
 * - HR routes: /hr/dashboard, /hr/employees, /hr/leave-requests, /hr/onboarding
 * - Employee routes: /employee/dashboard, /employee/profile, /employee/request-leave, /employee/my-leaves
 * - Error routes: /unauthorized, /404
 */
function App() {
  return (
    <div className="app">
      <AppRouter />
    </div>
  );
}

export default App;
