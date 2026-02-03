import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useCurrentUser, useEmployees, useLeaveRequests, useOnboardingList } from '@/store/hooks';
import { fetchEmployees } from '@/store/employeeSlice';
import { fetchLeaveRequests } from '@/store/leaveSlice';
import { fetchOnboarding } from '@/store/onboardingSlice';

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const employees = useEmployees();
  const leaveRequests = useLeaveRequests();
  const onboardingList = useOnboardingList();

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchLeaveRequests());
    dispatch(fetchOnboarding());
  }, [dispatch]);

  // Calculate statistics
  const totalEmployees = employees.length;
  const pendingLeaves = leaveRequests.filter((leave) => leave.status === 'pending').length;
  const activeOnboarding = onboardingList.filter((item) => item.status === 'in-progress').length;
  
  // Get unique departments
  const departmentMap = {};
  employees.forEach((emp) => {
    departmentMap[emp.department] = (departmentMap[emp.department] || 0) + 1;
  });
  const departments = Object.keys(departmentMap).length;

  // Recent activities
  const recentActivities = [
    ...leaveRequests.slice(-3).map((leave) => ({
      id: `leave-${leave.id}`,
      type: 'leave',
      title: `Leave Request: ${leave.leaveType}`,
      description: `${leave.reason || 'No reason provided'}`,
      status: leave.status,
      date: leave.submittedDate,
      icon: '📋',
    })),
    ...onboardingList.slice(-2).map((onboard) => ({
      id: `onboard-${onboard.id}`,
      type: 'onboarding',
      title: 'Onboarding Started',
      description: `Employee ID: ${onboard.employeeId}`,
      status: onboard.status,
      date: new Date().toISOString().split('T')[0],
      icon: '👥',
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  // Department breakdown
  const topDepartments = Object.entries(departmentMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">
                Welcome, {currentUser?.role === 'hr' ? 'HR Manager' : 'Employee'}!
              </h1>
              <p className="text-secondary-600 mt-1">
                {currentUser?.email}
              </p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="btn-secondary"
            >
              Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Employees */}
          <div className="card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-semibold mb-1">Total Employees</p>
                <p className="text-4xl font-bold text-primary-600">{totalEmployees}</p>
              </div>
              <div className="bg-primary-100 p-4 rounded-lg">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10h.01M13 6H9m4 12H9m6 0h.01M9 16H5v-2a3 3 0 015.856-1.487M9 6a3 3 0 110-6 3 3 0 010 6z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-secondary-600">Active</span>
              <span className="badge-success">100%</span>
            </div>
          </div>

          {/* Pending Leave Requests */}
          <div className="card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-semibold mb-1">Pending Leaves</p>
                <p className="text-4xl font-bold text-warning-600">{pendingLeaves}</p>
              </div>
              <div className="bg-warning-100 p-4 rounded-lg">
                <svg
                  className="w-8 h-8 text-warning-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-secondary-600">To Review</span>
              <span className="badge-warning">{pendingLeaves}</span>
            </div>
          </div>

          {/* Active Onboarding */}
          <div className="card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-semibold mb-1">Active Onboarding</p>
                <p className="text-4xl font-bold text-accent-600">{activeOnboarding}</p>
              </div>
              <div className="bg-accent-100 p-4 rounded-lg">
                <svg
                  className="w-8 h-8 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-secondary-600">In Progress</span>
              <span className="badge-primary">{activeOnboarding}</span>
            </div>
          </div>

          {/* Departments */}
          <div className="card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary-600 text-sm font-semibold mb-1">Departments</p>
                <p className="text-4xl font-bold text-success-600">{departments}</p>
              </div>
              <div className="bg-success-100 p-4 rounded-lg">
                <svg
                  className="w-8 h-8 text-success-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5.217m0 0a5.338 5.338 0 00-10.436 0m10.436 0H9.927"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-secondary-600">Total</span>
              <span className="badge-success">{departments}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {currentUser?.role === 'hr' ? (
                  <>
                    <button
                      onClick={() => navigate('/employees/add')}
                      className="btn-primary w-full justify-center flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.5 1.5H9.5V9H1.5v1h7.5v7.5h1V10h7.5V9h-7.5V1.5z" />
                      </svg>
                      Add Employee
                    </button>
                    <button
                      onClick={() => navigate('/leave-requests')}
                      className="btn-secondary w-full justify-center flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      View Requests
                    </button>
                    <button
                      onClick={() => navigate('/employees')}
                      className="btn-outline w-full justify-center flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Manage Employees
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/my-leaves')}
                      className="btn-primary w-full justify-center flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.5 1.5H9.5V9H1.5v1h7.5v7.5h1V10h7.5V9h-7.5V1.5z" />
                      </svg>
                      Request Leave
                    </button>
                    <button
                      onClick={() => navigate('/onboarding')}
                      className="btn-secondary w-full justify-center flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Onboarding
                    </button>
                    <button
                      onClick={() => navigate('/profile')}
                      className="btn-outline w-full justify-center flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-5m-4 0V5a2 2 0 10-4 0v5m0 0H5" />
                      </svg>
                      My Profile
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Department Breakdown */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">Department Breakdown</h2>
              <div className="space-y-4">
                {topDepartments.length > 0 ? (
                  topDepartments.map(([dept, count]) => (
                    <div key={dept}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-secondary-700">{dept}</span>
                        <span className="text-sm font-bold text-primary-600">{count}</span>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full transition-all"
                          style={{ width: `${(count / totalEmployees) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-secondary-600 text-sm">No department data available</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">Recent Activities</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-3 pb-3 border-b border-secondary-100 last:border-b-0">
                      <div className="text-2xl">{activity.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-secondary-900 truncate">{activity.title}</p>
                        <p className="text-xs text-secondary-600 truncate">{activity.description}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-secondary-500">{activity.date}</span>
                          <span
                            className={`badge badge-${
                              activity.status === 'completed'
                                ? 'success'
                                : activity.status === 'approved'
                                ? 'success'
                                : activity.status === 'rejected'
                                ? 'danger'
                                : 'warning'
                            }`}
                          >
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-secondary-600 text-sm text-center py-6">No recent activities</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Leave Status Overview */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">Leave Status Overview</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-secondary-700">Approved</span>
                  <span className="text-sm font-bold text-success-600">
                    {leaveRequests.filter((l) => l.status === 'approved').length}
                  </span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-3">
                  <div
                    className="bg-success-600 h-3 rounded-full"
                    style={{
                      width: `${
                        leaveRequests.length > 0
                          ? (leaveRequests.filter((l) => l.status === 'approved').length / leaveRequests.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-secondary-700">Pending</span>
                  <span className="text-sm font-bold text-warning-600">{pendingLeaves}</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-3">
                  <div
                    className="bg-warning-600 h-3 rounded-full"
                    style={{
                      width: `${
                        leaveRequests.length > 0
                          ? (leaveRequests.filter((l) => l.status === 'pending').length / leaveRequests.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-secondary-700">Rejected</span>
                  <span className="text-sm font-bold text-danger-600">
                    {leaveRequests.filter((l) => l.status === 'rejected').length}
                  </span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-3">
                  <div
                    className="bg-danger-600 h-3 rounded-full"
                    style={{
                      width: `${
                        leaveRequests.length > 0
                          ? (leaveRequests.filter((l) => l.status === 'rejected').length / leaveRequests.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Onboarding Progress */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">Onboarding Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-secondary-700">Completed</span>
                  <span className="text-sm font-bold text-success-600">
                    {onboardingList.filter((o) => o.status === 'completed').length}
                  </span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-3">
                  <div
                    className="bg-success-600 h-3 rounded-full"
                    style={{
                      width: `${
                        onboardingList.length > 0
                          ? (onboardingList.filter((o) => o.status === 'completed').length / onboardingList.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-secondary-700">In Progress</span>
                  <span className="text-sm font-bold text-accent-600">{activeOnboarding}</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-3">
                  <div
                    className="bg-accent-600 h-3 rounded-full"
                    style={{
                      width: `${
                        onboardingList.length > 0
                          ? (onboardingList.filter((o) => o.status === 'in-progress').length / onboardingList.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
