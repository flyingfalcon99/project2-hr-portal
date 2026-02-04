import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCurrentUser, useAppDispatch } from '@/store/hooks';
import { logoutUser } from '@/store/authSlice';
import { useIsMobile, TOUCH_SIZES } from '@/utils/responsiveUtils';

const HR_MENU = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'Employees', path: '/employees', icon: 'users' },
  { label: 'Leave Requests', path: '/leave-requests', icon: 'calendar' },
  { label: 'Onboarding', path: '/onboarding', icon: 'briefcase' },
];

const EMPLOYEE_MENU = [
  { label: 'Dashboard', path: '/employee-dashboard', icon: 'dashboard' },
  { label: 'My Leaves', path: '/my-leaves', icon: 'calendar' },
  { label: 'Onboarding', path: '/employee-onboarding', icon: 'briefcase' },
  { label: 'Profile', path: '/profile', icon: 'user' },
];

const getIcon = (iconName) => {
  const icons = {
    dashboard: (
      <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l4-4m0 0l4 4m-4-4v4m0-11l-4 4m0 0L3 7m4 4v-4" />
      </svg>
    ),
    users: (
      <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.048M12 4.354L9.172 9.172M12 4.354l2.828 4.818M15 10.5H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
      </svg>
    ),
    calendar: (
      <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    briefcase: (
      <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m0 0v10l8 4" />
      </svg>
    ),
    user: (
      <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    bell: (
      <svg className="w-6 h-6 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.158c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
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
      <svg className="w-4 h-4 flex-shrink-0 inline-block" fill="currentColor" viewBox="0 0 20 20" width="16" height="16">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    ),
    logout: (
      <svg className="w-5 h-5 flex-shrink-0 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
  };
  return icons[iconName] || null;
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();
  const isMobile = useIsMobile();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Menu based on role
  const menuItems = currentUser?.role === 'hr' ? HR_MENU : EMPLOYEE_MENU;
  const notificationCount = 3; // Mock notification count

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [location]);

  // Check if link is active
  const isActive = (path) => location.pathname === path;

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('currentUser');
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-secondary-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md flex-shrink-0">
              <svg className="w-6 h-6 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <div className="hidden md:flex flex-col">
              <span className="font-bold text-secondary-900">HR Portal</span>
              <span className="text-xs text-secondary-600">Employee Management</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-3 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700 shadow-sm'
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                }`}
              >
                {getIcon(item.icon)}
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className={`flex items-center gap-2 md:gap-4`}>
            {/* Notifications Bell */}
            <button className={`relative ${TOUCH_SIZES.medium} p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded-lg transition-colors`}>
              {getIcon('bell')}
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-danger-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center gap-2 ${TOUCH_SIZES.medium} rounded-lg hover:bg-secondary-50 transition-colors`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-sm flex-shrink-0">
                  <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs sm:text-sm font-semibold text-secondary-900">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </span>
                  <span className="text-xs text-secondary-600 capitalize">{currentUser?.role}</span>
                </div>
                <div className={`transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`}>
                  {getIcon('chevron')}
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className={`absolute right-0 mt-2 ${isMobile ? 'w-48' : 'w-56'} bg-white rounded-lg shadow-xl border border-secondary-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2`}>
                  {/* User Info */}
                  <div className={`px-3 md:px-4 py-2 md:py-3 bg-secondary-50 border-b border-secondary-200`}>
                    <p className={`font-semibold text-secondary-900 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <p className="text-xs text-secondary-600">{currentUser?.email}</p>
                    <p className="text-xs text-secondary-500 mt-1">
                      ID: {currentUser?.employeeId}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsProfileDropdownOpen(false);
                      }}
                      className={`w-full px-3 md:px-4 py-2 text-left text-xs md:text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-700 transition-colors flex items-center gap-2 md:gap-3`}
                    >
                      {getIcon('user')}
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate('/settings');
                        setIsProfileDropdownOpen(false);
                      }}
                      className={`w-full px-3 md:px-4 py-2 text-left text-xs md:text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-700 transition-colors flex items-center gap-2 md:gap-3`}
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Settings</span>
                    </button>

                    <div className="border-t border-secondary-200 my-2" />

                    <button
                      onClick={handleLogout}
                      className={`w-full px-3 md:px-4 py-2 text-left text-xs md:text-sm text-danger-700 hover:bg-danger-50 transition-colors flex items-center gap-2 md:gap-3`}
                    >
                      {getIcon('logout')}
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden ${TOUCH_SIZES.medium} p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded-lg transition-colors`}
            >
              {isMobileMenuOpen ? getIcon('close') : getIcon('menu')}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-secondary-200 bg-secondary-50 animate-in fade-in slide-in-from-top-2">
            <div className="px-2 py-2 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full px-3 py-3 rounded-lg font-medium transition-all flex items-center gap-3 text-sm ${TOUCH_SIZES.medium} ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-700 shadow-sm'
                      : 'text-secondary-600 hover:text-secondary-900 hover:bg-white'
                  }`}
                >
                  {getIcon(item.icon)}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
