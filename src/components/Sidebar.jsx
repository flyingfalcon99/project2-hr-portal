import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCurrentUser } from '@/store/hooks';

const HR_MENU = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'Employees', path: '/employees', icon: 'users' },
  { label: 'Leave Requests', path: '/leave-requests', icon: 'calendar' },
  { label: 'Onboarding', path: '/onboarding', icon: 'briefcase' },
  { label: 'Reports', path: '/reports', icon: 'chart' },
];

const EMPLOYEE_MENU = [
  { label: 'Dashboard', path: '/employee-dashboard', icon: 'dashboard' },
  { label: 'My Profile', path: '/profile', icon: 'user' },
  { label: 'Request Leave', path: '/my-leaves', icon: 'calendar' },
  { label: 'My Leaves', path: '/leave-history', icon: 'history' },
  { label: 'Onboarding', path: '/employee-onboarding', icon: 'briefcase' },
];

const getIcon = (iconName) => {
  const icons = {
    dashboard: (
      <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l4-4m0 0l4 4m-4-4v4m0-11l-4 4m0 0L3 7m4 4v-4"
        />
      </svg>
    ),
    users: (
      <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 8.048M12 4.354L9.172 9.172M12 4.354l2.828 4.818M15 10.5H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z"
        />
      </svg>
    ),
    calendar: (
      <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    briefcase: (
      <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m0 0v10l8 4"
        />
      </svg>
    ),
    user: (
      <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    history: (
      <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    chart: (
      <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    menu: (
      <svg className="w-6 h-6 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    close: (
      <svg className="w-6 h-6 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    chevron: (
      <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    ),
  };
  return icons[iconName] || null;
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useCurrentUser();

  const [isOpen, setIsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Menu based on role
  const menuItems = currentUser?.role === 'hr' ? HR_MENU : EMPLOYEE_MENU;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      if (mobile) {
        setIsOpen(false);
      } else {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when route changes
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [location]);

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-all flex items-center justify-center"
        title="Toggle navigation"
      >
        {isMobileMenuOpen ? getIcon('close') : getIcon('menu')}
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 h-screen bg-secondary-900 text-white transition-all duration-300 z-50 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-secondary-800">
          {isOpen && <span className="font-bold text-lg">HR Portal</span>}
          <button
            onClick={toggleSidebar}
            className="p-1 hover:bg-secondary-800 rounded-lg transition-colors flex-shrink-0"
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <svg
              className={`w-5 h-5 transition-transform flex-shrink-0 ${!isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive(item.path)
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'text-secondary-300 hover:text-white hover:bg-secondary-800'
              }`}
              title={!isOpen ? item.label : ''}
            >
              <div className="flex-shrink-0">{getIcon(item.icon)}</div>
              {isOpen && <span className="flex-1 text-left text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-secondary-800">
          {isOpen && (
            <div className="text-xs text-secondary-400">
              <p className="truncate">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
              <p className="text-secondary-500 mt-1 capitalize">{currentUser?.role}</p>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute left-0 top-0 h-screen w-64 bg-secondary-900 text-white shadow-lg animate-in slide-in-from-left-full">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-secondary-800">
              <span className="font-bold text-lg">HR Portal</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 hover:bg-secondary-800 rounded-lg transition-colors"
              >
                {getIcon('close')}
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="py-4 px-2 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive(item.path)
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-secondary-300 hover:text-white hover:bg-secondary-800'
                  }`}
                >
                  <div className="flex-shrink-0">{getIcon(item.icon)}</div>
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-4 border-t border-secondary-800 bg-secondary-950">
              <p className="text-xs text-secondary-400 truncate">
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
              <p className="text-xs text-secondary-500 mt-1 capitalize">{currentUser?.role}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
