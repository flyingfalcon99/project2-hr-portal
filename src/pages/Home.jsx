import { useNavigate } from 'react-router-dom';
import { useIsAuthenticated, useCurrentUser } from '@/store/hooks';

export default function Home() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const currentUser = useCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 animate-fade-in">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary-600">HR Portal</div>
          <div className="flex gap-4">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                <span className="px-4 py-2 text-gray-700">
                  Welcome, {currentUser?.name}
                </span>
                <button
                  onClick={() =>
                    navigate(
                      currentUser?.role === 'HR Admin'
                        ? '/hr/dashboard'
                        : '/employee/dashboard'
                    )
                  }
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-primary-600">HR Portal</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Modern Human Resources Management System designed to streamline your
          employee management, leave requests, and onboarding processes.
        </p>

        {/* CTA Buttons */}
        {!isAuthenticated && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gray-200 text-gray-900 text-lg font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Create Account
            </button>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Employee Management
              </h3>
              <p className="text-gray-600">
                Easily manage employee profiles, departments, roles, and
                organizational structure with our intuitive interface.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Leave Management
              </h3>
              <p className="text-gray-600">
                Streamline leave requests, approvals, and tracking with our
                comprehensive leave management system.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Onboarding Portal
              </h3>
              <p className="text-gray-600">
                Guide new employees through a structured onboarding process
                with automated workflows and checklists.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Advanced Search & Filter
              </h3>
              <p className="text-gray-600">
                Find employees and data quickly with powerful search and
                filtering capabilities across all modules.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="text-4xl mb-4">🔔</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Notifications
              </h3>
              <p className="text-gray-600">
                Stay informed with real-time in-app notifications for all
                important events and updates.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Form Validation
              </h3>
              <p className="text-gray-600">
                Robust client-side validation ensures data integrity and
                provides immediate feedback to users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
            <p className="text-gray-600">Employees Managed</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">50K+</div>
            <p className="text-gray-600">Leave Requests</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
            <p className="text-gray-600">Onboardings</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">99.9%</div>
            <p className="text-gray-600">Uptime</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="bg-primary-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of companies using HR Portal to streamline their
              HR operations.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Start Free Trial
            </button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            &copy; 2026 HR Portal. All rights reserved. | Created for
            Simplilearn
          </p>
        </div>
      </footer>
    </div>
  );
}
