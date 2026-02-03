import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useCurrentUser, useEmployeeLeaves } from '@/store/hooks';
import { fetchLeavesByEmployee } from '@/store/leaveSlice';

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Holiday Schedule 2024',
    message: 'Updated holiday calendar has been posted. Please check the HR portal for details.',
    date: '2024-01-28',
    priority: 'high',
    icon: 'calendar',
  },
  {
    id: 2,
    title: 'New Benefits Portal',
    message: 'Check out our new benefits enrollment platform. Open through March 15th.',
    date: '2024-01-25',
    priority: 'medium',
    icon: 'star',
  },
  {
    id: 3,
    title: 'Office Closure',
    message: 'All offices will be closed on February 19th for Presidents Day.',
    date: '2024-01-20',
    priority: 'medium',
    icon: 'building',
  },
  {
    id: 4,
    title: 'Team Building Event',
    message: 'Join us for our quarterly team building event on March 8th!',
    date: '2024-01-18',
    priority: 'low',
    icon: 'users',
  },
];

const QUICK_ACTIONS = [
  { id: 1, label: 'Request Leave', path: '/my-leaves', icon: 'calendar', color: 'primary' },
  { id: 2, label: 'Update Profile', path: '/profile', icon: 'user', color: 'secondary' },
  { id: 3, label: 'View Payslips', path: '/payslips', icon: 'document', color: 'accent' },
  { id: 4, label: 'Contact HR', path: '/hr-support', icon: 'mail', color: 'success' },
];

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();
  const employeeLeaves = useEmployeeLeaves();

  const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);

  useEffect(() => {
    if (currentUser?.employeeId) {
      dispatch(fetchLeavesByEmployee(currentUser.employeeId));
    }
  }, [dispatch, currentUser]);

  // Calculate leave stats
  const leaveStats = useMemo(() => {
    if (!employeeLeaves) return { upcoming: 0, pending: 0, approved: 0, balances: [] };

    const today = new Date();
    const upcoming = employeeLeaves.filter((leave) => {
      const startDate = new Date(leave.startDate);
      return leave.status === 'approved' && startDate >= today;
    }).length;

    const pending = employeeLeaves.filter((leave) => leave.status === 'pending').length;
    const approved = employeeLeaves.filter((leave) => leave.status === 'approved').length;

    // Calculate balance per leave type
    const leaveTypes = ['Sick Leave', 'Vacation', 'Personal Leave', 'Emergency Leave', 'Paid Time Off'];
    const maxDays = {
      'Sick Leave': 10,
      'Vacation': 20,
      'Personal Leave': 5,
      'Emergency Leave': 3,
      'Paid Time Off': 5,
    };

    const balances = leaveTypes.map((type) => {
      const usedDays = employeeLeaves
        .filter((leave) => leave.leaveType === type && leave.status === 'approved')
        .reduce((total, leave) => {
          const start = new Date(leave.startDate);
          const end = new Date(leave.endDate);
          const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
          return total + days;
        }, 0);

      return {
        type,
        max: maxDays[type],
        used: usedDays,
        remaining: Math.max(0, maxDays[type] - usedDays),
      };
    });

    return { upcoming, pending, approved, balances };
  }, [employeeLeaves]);

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'badge-danger';
      case 'medium':
        return 'badge-warning';
      case 'low':
        return 'badge-secondary';
      default:
        return 'badge-secondary';
    }
  };

  // Get announcement icon
  const getAnnouncementIcon = (icon) => {
    const icons = {
      calendar: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      star: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      building: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m4-4h1m-1 4h1m-5-10h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      ),
      users: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 8.048M12 4.354L9.172 9.172M12 4.354l2.828 4.818M15 10.5H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
      ),
      mail: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    };
    return icons[icon] || icons.mail;
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold">Welcome back, {currentUser?.firstName}!</h1>
          <p className="text-primary-100 mt-2">Here's what's happening with your account today</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Card & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Welcome Card */}
          <div className="lg:col-span-2 card">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-secondary-900">
                {currentUser?.firstName} {currentUser?.lastName}
              </h2>
              <p className="text-secondary-600 mt-1">{currentUser?.position}</p>
              <p className="text-sm text-secondary-500 mt-1">{currentUser?.department}</p>
              <div className="mt-4 pt-4 border-t border-secondary-200 w-full">
                <p className="text-xs text-secondary-600">Employee ID: {currentUser?.employeeId}</p>
                <p className="text-xs text-secondary-600 mt-1">
                  Joined: {currentUser?.dateOfJoining ? new Date(currentUser.dateOfJoining).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <p className="text-xs font-semibold text-secondary-600 uppercase mb-3">Upcoming Leaves</p>
            <p className="text-4xl font-bold text-primary-600 mb-1">{leaveStats.upcoming}</p>
            <p className="text-sm text-secondary-600">approved leaves scheduled</p>
            <div className="mt-4 pt-4 border-t border-secondary-200">
              <p className="text-xs font-semibold text-secondary-600 uppercase mb-2">Pending Requests</p>
              <p className="text-2xl font-bold text-warning-600">{leaveStats.pending}</p>
            </div>
          </div>

          <div className="card">
            <p className="text-xs font-semibold text-secondary-600 uppercase mb-3">Annual Balance</p>
            <div className="space-y-3">
              {leaveStats.balances.slice(0, 2).map((balance) => (
                <div key={balance.type}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-medium text-secondary-700">{balance.type}</p>
                    <p className="text-sm font-bold text-primary-600">{balance.remaining}/{balance.max}</p>
                  </div>
                  <div className="w-full bg-secondary-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${(balance.used / balance.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => navigate(action.path)}
              className={`card hover:shadow-lg transition-all group cursor-pointer`}
            >
              <div className={`w-12 h-12 rounded-lg bg-${action.color}-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <svg className={`w-6 h-6 text-${action.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {action.icon === 'calendar' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  )}
                  {action.icon === 'user' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  )}
                  {action.icon === 'document' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  )}
                  {action.icon === 'mail' && (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  )}
                </svg>
              </div>
              <p className="font-semibold text-secondary-900">{action.label}</p>
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Announcements */}
          <div className="lg:col-span-2">
            <div className="card">
              <h3 className="text-xl font-bold text-secondary-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                Announcements & Notifications
              </h3>

              <div className="space-y-3">
                {ANNOUNCEMENTS.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="border-l-4 border-secondary-200 pl-4 py-3 hover:border-primary-500 transition-colors cursor-pointer"
                    onClick={() =>
                      setExpandedAnnouncement(
                        expandedAnnouncement === announcement.id ? null : announcement.id
                      )
                    }
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-primary-600 flex-shrink-0 mt-1">
                          {getAnnouncementIcon(announcement.icon)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-secondary-900">{announcement.title}</p>
                            <span className={`badge ${getPriorityColor(announcement.priority)} text-xs`}>
                              {announcement.priority}
                            </span>
                          </div>
                          <p className="text-sm text-secondary-600">
                            {expandedAnnouncement === announcement.id
                              ? announcement.message
                              : announcement.message.substring(0, 60) + '...'}
                          </p>
                          <p className="text-xs text-secondary-500 mt-2">
                            {new Date(announcement.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <svg
                        className={`w-5 h-5 text-secondary-400 flex-shrink-0 transition-transform ${
                          expandedAnnouncement === announcement.id ? 'rotate-180' : ''
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              <button className="mt-6 btn-outline w-full">View All Announcements</button>
            </div>
          </div>

          {/* Personal Information Summary */}
          <div className="card">
            <h3 className="text-lg font-bold text-secondary-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Personal Info
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-secondary-600 uppercase mb-1">Email</p>
                <p className="text-sm text-secondary-900 break-all">{currentUser?.email}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-secondary-600 uppercase mb-1">Position</p>
                <p className="text-sm text-secondary-900">{currentUser?.position}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-secondary-600 uppercase mb-1">Department</p>
                <p className="text-sm text-secondary-900">{currentUser?.department}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-secondary-600 uppercase mb-1">Status</p>
                <span className="badge badge-success text-xs">Active</span>
              </div>

              <div className="pt-4 border-t border-secondary-200">
                <p className="text-xs font-semibold text-secondary-600 uppercase mb-2">Quick Links</p>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-primary-600 hover:text-primary-700 font-semibold">
                    → Edit Profile
                  </button>
                  <button className="w-full text-left text-sm text-primary-600 hover:text-primary-700 font-semibold">
                    → Change Password
                  </button>
                  <button className="w-full text-left text-sm text-primary-600 hover:text-primary-700 font-semibold">
                    → Download Documents
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Balance Details */}
        <div className="mt-8 card">
          <h3 className="text-lg font-bold text-secondary-900 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Complete Leave Balance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {leaveStats.balances.map((balance) => (
              <div key={balance.type} className="bg-secondary-50 rounded-lg p-4 border border-secondary-200">
                <p className="text-xs font-semibold text-secondary-600 uppercase mb-3">{balance.type}</p>
                <div className="mb-3">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-2xl font-bold text-primary-600">{balance.remaining}</span>
                    <span className="text-xs text-secondary-600">/ {balance.max} days</span>
                  </div>
                  <div className="w-full bg-secondary-300 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${(balance.used / balance.max) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-xs text-secondary-600">
                  {balance.used} used • {balance.remaining} remaining
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
