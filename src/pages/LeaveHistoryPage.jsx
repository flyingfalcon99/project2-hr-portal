import { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useCurrentUser, useEmployeeLeaves, useLeaveLoading } from '@/store/hooks';
import { fetchLeavesByEmployee, cancelLeave } from '@/store/leaveSlice';


const API_BASE = 'http://localhost:5000/api';
const LEAVE_TYPES = [
  { type: 'Sick Leave', maxDays: 10 },
  { type: 'Vacation', maxDays: 20 },
  { type: 'Personal Leave', maxDays: 5 },
  { type: 'Emergency Leave', maxDays: 3 },
  { type: 'Paid Time Off', maxDays: 5 },
];

export default function LeaveHistory() {
  const dispatch = useAppDispatch();
  const currentUser = useCurrentUser();
  const employeeLeaves = useEmployeeLeaves();
  const loading = useLeaveLoading();

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [view, setView] = useState('list'); // 'list' or 'calendar'
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (currentUser?.employeeId) {
      dispatch(fetchLeavesByEmployee(currentUser.employeeId));
    }
  }, [dispatch, currentUser]);

  // Filter leaves
  const filteredLeaves = useMemo(() => {
    let filtered = employeeLeaves || [];

    if (filterStatus !== 'all') {
      filtered = filtered.filter((leave) => leave.status === filterStatus);
    }

    if (filterStartDate) {
      filtered = filtered.filter((leave) => new Date(leave.startDate) >= new Date(filterStartDate));
    }

    if (filterEndDate) {
      filtered = filtered.filter((leave) => new Date(leave.endDate) <= new Date(filterEndDate));
    }

    return filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }, [employeeLeaves, filterStatus, filterStartDate, filterEndDate]);

  // Calculate leave balance
  const leaveBalances = useMemo(() => {
    return LEAVE_TYPES.map((lt) => {
      const usedDays = (employeeLeaves || [])
        .filter((leave) => leave.leaveType === lt.type && leave.status === 'approved')
        .reduce((total, leave) => {
          const start = new Date(leave.startDate);
          const end = new Date(leave.endDate);
          const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
          return total + days;
        }, 0);

      return {
        type: lt.type,
        maxDays: lt.maxDays,
        usedDays,
        remainingDays: Math.max(0, lt.maxDays - usedDays),
      };
    });
  }, [employeeLeaves]);

  // Handle cancel leave
  const handleCancel = async (id) => {
    setCancelLoading(true);
    setError(null);

    try {
      await dispatch(cancelLeave(id)).unwrap();
      setSuccess(true);
      setCancelModal(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to cancel leave');
    } finally {
      setCancelLoading(false);
    }
  };

  // Calculate duration
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  };

  // Get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Check if date has approved leave
  const hasApprovedLeave = (date) => {
    return (employeeLeaves || []).some((leave) => {
      if (leave.status !== 'approved') return false;
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      return date >= leaveStart && date <= leaveEnd;
    });
  };

  // Get leave type for a date
  const getLeaveTypeForDate = (date) => {
    const leave = (employeeLeaves || []).find((leave) => {
      if (leave.status !== 'approved') return false;
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      return date >= leaveStart && date <= leaveEnd;
    });
    return leave?.leaveType;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">Leave History</h1>
            <p className="text-secondary-600 mt-1">View your leave requests and balance</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 bg-danger-50 border border-danger-200 rounded-lg p-4 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-danger-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-success-50 border border-success-200 rounded-lg p-4 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-success-700">Leave request cancelled successfully!</p>
          </div>
        )}

        {/* Leave Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {leaveBalances.map((balance) => (
            <div key={balance.type} className="card">
              <p className="text-xs font-semibold text-secondary-600 uppercase mb-2">{balance.type}</p>
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold text-primary-600">{balance.remainingDays}</span>
                  <span className="text-xs text-secondary-600">/ {balance.maxDays} days</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${(balance.usedDays / balance.maxDays) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-secondary-600">
                  {balance.usedDays} used • {balance.remainingDays} remaining
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
              view === 'list'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-secondary-900 border border-secondary-200 hover:bg-secondary-50'
            }`}
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            List View
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
              view === 'calendar'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-secondary-900 border border-secondary-200 hover:bg-secondary-50'
            }`}
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Calendar View
          </button>
        </div>

        {/* List View */}
        {view === 'list' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="card">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-2">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="input-field"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary-900 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterStatus('all');
                      setFilterStartDate('');
                      setFilterEndDate('');
                    }}
                    className="btn-outline w-full"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Leave Requests List */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
              </div>
            ) : filteredLeaves.length === 0 ? (
              <div className="card text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-secondary-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-secondary-600">No leave requests found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLeaves.map((leave) => (
                  <div key={leave.id} className="card">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-secondary-900">{leave.leaveType}</h3>
                          <span
                            className={`badge ${
                              leave.status === 'approved'
                                ? 'badge-success'
                                : leave.status === 'pending'
                                ? 'badge-warning'
                                : 'badge-danger'
                            }`}
                          >
                            {leave.status}
                          </span>
                        </div>
                        <p className="text-sm text-secondary-600 mb-2">
                          {new Date(leave.startDate).toLocaleDateString()} -{' '}
                          {new Date(leave.endDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-secondary-700">{leave.reason}</p>
                        <p className="text-xs text-secondary-500 mt-2">
                          Duration: {calculateDuration(leave.startDate, leave.endDate)} days • Submitted:{' '}
                          {new Date(leave.submittedDate).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {leave.status === 'pending' && (
                          <button
                            onClick={() => setCancelModal(leave.id)}
                            className="btn-danger btn-sm"
                          >
                            Cancel Request
                          </button>
                        )}
                        {leave.status === 'rejected' && leave.rejectionReason && (
                          <div className="text-sm bg-danger-50 border border-danger-200 rounded-lg p-3 text-danger-800">
                            <p className="font-semibold mb-1">Rejection Reason:</p>
                            <p>{leave.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Calendar View */}
        {view === 'calendar' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
                  )
                }
                className="btn-secondary btn-sm"
              >
                ← Previous
              </button>
              <h2 className="text-2xl font-bold text-secondary-900">{monthName}</h2>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
                  )
                }
                className="btn-secondary btn-sm"
              >
                Next →
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-semibold text-secondary-900 py-2">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((day, index) => {
                const hasLeave = day ? hasApprovedLeave(day) : false;
                const leaveType = day ? getLeaveTypeForDate(day) : null;

                return (
                  <div
                    key={index}
                    className={`aspect-square p-2 rounded-lg border-2 transition-colors ${
                      day
                        ? hasLeave
                          ? 'bg-success-50 border-success-300 cursor-pointer'
                          : 'bg-white border-secondary-200 hover:border-secondary-300'
                        : 'bg-secondary-50 border-secondary-100'
                    }`}
                    title={leaveType}
                  >
                    {day && (
                      <div className="h-full flex flex-col items-center justify-center">
                        <span className={`font-semibold ${hasLeave ? 'text-success-900' : 'text-secondary-900'}`}>
                          {day.getDate()}
                        </span>
                        {hasLeave && (
                          <div className="text-xs text-success-700 text-center line-clamp-1 mt-1">
                            {leaveType}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-secondary-200 flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-success-50 border-2 border-success-300 rounded" />
                <span className="text-sm text-secondary-700">Approved Leave</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border-2 border-secondary-200 rounded" />
                <span className="text-sm text-secondary-700">No Leave</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">Cancel Leave Request?</h3>
            <p className="text-secondary-600 mb-6">
              This action cannot be undone. The leave request will be permanently cancelled.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelModal(null)}
                className="btn-secondary flex-1"
              >
                Keep Request
              </button>
              <button
                onClick={() => handleCancel(cancelModal)}
                disabled={cancelLoading}
                className="btn-danger flex-1"
              >
                {cancelLoading ? 'Cancelling...' : 'Cancel Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
