import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import NotificationContainer from './NotificationContainer';

const BREADCRUMB_LABELS = {
  dashboard: 'Dashboard',
  'employee-dashboard': 'Dashboard',
  employees: 'Employees',
  'leave-requests': 'Leave Requests',
  'leave-history': 'Leave History',
  onboarding: 'Onboarding Dashboard',
  'employee-onboarding': 'My Onboarding',
  profile: 'My Profile',
  'my-leaves': 'Request Leave',
  reports: 'Reports',
  settings: 'Settings',
};

export default function Layout({ children }) {
  const location = useLocation();

  // Generate breadcrumbs from current path
  const breadcrumbs = useMemo(() => {
    const paths = location.pathname
      .split('/')
      .filter(Boolean)
      .slice(0, 2); // Only show up to 2 levels

    return paths.map((path, index) => {
      const label = BREADCRUMB_LABELS[path] || path.charAt(0).toUpperCase() + path.slice(1);
      const href = '/' + paths.slice(0, index + 1).join('/');
      return { label, href, path };
    });
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-secondary-50">
      {/* Notification Container */}
      <NotificationContainer />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Navbar */}
        <Navbar />

        {/* Content Area with Breadcrumbs */}
        <div className="flex-1 overflow-auto">
          {/* Breadcrumb Navigation */}
          {breadcrumbs.length > 0 && location.pathname !== '/dashboard' && location.pathname !== '/employee-dashboard' && (
            <div className="bg-white border-b border-secondary-200 sticky top-0 z-30">
              <div className="max-w-7xl mx-auto px-4 py-3">
                <nav className="flex items-center space-x-2 text-sm">
                  <button
                    onClick={() => window.history.back()}
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12a9 9 0 010-18 9 9 0 010 18zm0 0a9.004 9.004 0 008.716-6.547M3 12a9.004 9.004 0 008.716 6.547M3 12h15m0 0a1 1 0 011 1v1m0-1a1 1 0 00-1-1"
                      />
                    </svg>
                    Back
                  </button>

                  {breadcrumbs.map((breadcrumb, index) => (
                    <div key={breadcrumb.path} className="flex items-center space-x-2">
                      <span className="text-secondary-400">/</span>
                      <span className="text-secondary-700">{breadcrumb.label}</span>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Page Content */}
          <div className="min-h-[calc(100vh-64px)] flex flex-col">
            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-secondary-900 text-secondary-300 border-t border-secondary-800 mt-auto">
              <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Footer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  {/* Company Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-white">HR Portal</p>
                        <p className="text-xs text-secondary-500">Employee Management</p>
                      </div>
                    </div>
                    <p className="text-sm text-secondary-400">
                      Streamline your HR operations with our comprehensive employee management system.
                    </p>
                  </div>

                  {/* Quick Links */}
                  <div>
                    <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <button className="hover:text-primary-400 transition-colors">Dashboard</button>
                      </li>
                      <li>
                        <button className="hover:text-primary-400 transition-colors">My Profile</button>
                      </li>
                      <li>
                        <button className="hover:text-primary-400 transition-colors">Support</button>
                      </li>
                      <li>
                        <button className="hover:text-primary-400 transition-colors">Documentation</button>
                      </li>
                    </ul>
                  </div>

                  {/* Resources */}
                  <div>
                    <h4 className="font-semibold text-white mb-4">Resources</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <button className="hover:text-primary-400 transition-colors">FAQ</button>
                      </li>
                      <li>
                        <button className="hover:text-primary-400 transition-colors">Blog</button>
                      </li>
                      <li>
                        <button className="hover:text-primary-400 transition-colors">Help Center</button>
                      </li>
                      <li>
                        <button className="hover:text-primary-400 transition-colors">Contact</button>
                      </li>
                    </ul>
                  </div>

                  {/* Legal */}
                  <div>
                    <h4 className="font-semibold text-white mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <button className="hover:text-primary-400 transition-colors">Privacy Policy</button>
                      </li>
                      <li>
                        <button className="hover:text-primary-400 transition-colors">Terms of Service</button>
                      </li>
                      <li>
                        <button className="hover:text-primary-400 transition-colors">Security</button>
                      </li>
                      <li>
                        <button className="hover:text-primary-400 transition-colors">Compliance</button>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-secondary-800 pt-8">
                  {/* Footer Bottom */}
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <p className="text-sm text-secondary-500 mb-4 md:mb-0">
                      © 2024 HR Portal. All rights reserved.
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                      <button
                        className="text-secondary-400 hover:text-primary-400 transition-colors"
                        title="Facebook"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </button>
                      <button
                        className="text-secondary-400 hover:text-primary-400 transition-colors"
                        title="Twitter"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </button>
                      <button
                        className="text-secondary-400 hover:text-primary-400 transition-colors"
                        title="LinkedIn"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
